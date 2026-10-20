import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON, AuthenticatorTransportFuture, PublicKeyCredentialRequestOptionsJSON, VerifiedRegistrationResponse, WebAuthnCredential } from "@simplewebauthn/server";
import prisma from "../config/prisma";
import { ApiError } from "../utils/apiError.utils";
import type { Bytes } from "@prisma/client/runtime/client";
import type { Passkey } from "../../generated/prisma/browser";
import "dotenv/config";

// methods for passkey registration\

export async function generateOptions(userId:string, userEmail:string, fullName:string, userPasskeys:Array<{credentialID:string, userId:string}>) {


    const encodedId = new TextEncoder().encode(userId);
    const options = await generateRegistrationOptions({
        rpName:"Swiftly",
        rpID: process.env.DOMAIN_NAME || "localhost",
        userID: encodedId,
        userName: userEmail,
        userDisplayName: `${fullName} - ${userEmail}`,

        excludeCredentials: userPasskeys.map(passkey => ({
            id: passkey.credentialID,
            type :'public-key',
        })),
        authenticatorSelection: {
            residentKey: 'required',
            // Passkeys are a sole login factor here, so require PIN/biometric, not just a touch
            userVerification: 'required',
        },
        attestationType: 'none',
    })
    return options
}



export async function getUserPasskeys(userId:string){
    return await prisma.passkey.findMany({
        where:{
            userId:userId
        },
        select:{
            credentialID:true,
            userId:true
        }
    })
}


export async function verifyOptions(credentialPayload:RegistrationResponseJSON, expectedChallenge:string, ): Promise<VerifiedRegistrationResponse> {
    const verification = await verifyRegistrationResponse({
        response: credentialPayload,
        expectedChallenge,
        expectedOrigin: process.env.FRONTEND_URL || "http://localhost:3000",
        expectedRPID: process.env.DOMAIN_NAME || "localhost",
        requireUserVerification: true,
    })

    return verification
    
}


export async function savePasskeyToDB(credentialID:string, publicKey:Bytes, counter:bigint, transports:string[], credentialDeviceType:string, userId:string){

    try {
        await prisma.passkey.create({
            data:{
                credentialID,
                publicKey,
                counter,
                name:transports.join(', '),
                deviceType:credentialDeviceType,
                userId:userId,
            }
        })
    } catch (error) {
        // credentialID is unique: the same authenticator was already registered (by this or another account)
        if ((error as { code?: string })?.code === "P2002") {
            throw new ApiError(409, "This passkey is already registered")
        }
        throw error
    }

}


// methods for passkey login

export async function generateLoginOptions(): Promise<PublicKeyCredentialRequestOptionsJSON>{
    return await generateAuthenticationOptions({
        rpID: process.env.DOMAIN_NAME as string || "localhost",
        userVerification: "required",
    })
}

export async function getPasskeyAndUserFromCredentialID(credentialID:string){

    return await prisma.passkey.findUnique({
        where:{credentialID},
        include:{user:true}
    })



}

export async function updateCounter(credentialID:string, counter:bigint){
    await prisma.passkey.update({
        where:{credentialID},
        data:{counter:counter}
    })

}


export async function verifyLogin(credentialPayload:AuthenticationResponseJSON, expectedChallenge:string, savedPasskey:Passkey){

    const credential:WebAuthnCredential ={
        // The WebAuthn credential ID (base64url), not the DB row's primary key
        id:savedPasskey.credentialID,
        publicKey: new Uint8Array(savedPasskey.publicKey),
        counter: Number(savedPasskey.counter),
        transports: savedPasskey.name?.split(', ') as AuthenticatorTransportFuture[]
    }
    return await verifyAuthenticationResponse({
        response: credentialPayload,
        expectedChallenge,
        expectedOrigin: process.env.FRONTEND_URL as string || "http://localhost:3000",
        expectedRPID: process.env.DOMAIN_NAME as string || "localhost",
        requireUserVerification: true,
        credential
    })
}