import { asyncHandler } from "../utils/asyncHandler.utils";
import { requireUserId } from "../middlewares/auth.middleware";
import type { AuthRequest } from "../types/auth.types";
import type { Response } from "express";
import { AuthService } from "../services/auth.service";
import { generateOptions, getUserPasskeys, verifyOptions, savePasskeyToDB, generateLoginOptions, getPasskeyAndUserFromCredentialID, verifyLogin, updateCounter } from "../services/passkey.service";
import { ApiResponse } from "../utils/apiResponse.utils";
import type { AuthenticationResponseJSON, RegistrationResponseJSON, VerifiedRegistrationResponse } from "@simplewebauthn/server";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { authCookieOptions, challengeCookieOptions } from "../config/cookies";



const authService = new AuthService()

export const setupPasskey = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req)
    const user = await authService.getUserById(userId)
    const userPasskeys = await getUserPasskeys(userId)
    if (user) {
        const passkeyOptions = await generateOptions(userId, user.email!, user.fullName!, userPasskeys)
        const challenge = passkeyOptions.challenge


        return res
            .status(200)
            .cookie("challenge", challenge, challengeCookieOptions)
            .json(new ApiResponse(200, passkeyOptions, "Passkey options generated successfully"))

    } else {
        return res.status(404).json(new ApiResponse(404, null, "User not found"))
    }


})

export const verifyPasskey = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req)
    const credentialPayload = req.body as RegistrationResponseJSON
    const expectedChallenge = req.signedCookies["challenge"]

    if (!expectedChallenge) {
        return res.status(400).json(new ApiResponse(400, null, "No challenge found"))
    }
    const verification: VerifiedRegistrationResponse = await verifyOptions(credentialPayload, expectedChallenge)

    const { verified, registrationInfo } = verification

    if (!verified || !registrationInfo) {
        return res.status(400).json(new ApiResponse(400, null, "Passkey verification failed"))
    }

    const { credential, credentialDeviceType } = registrationInfo
    const { id: credentialID, publicKey, counter, transports } = credential
    await savePasskeyToDB(credentialID, Buffer.from(publicKey), BigInt(counter), transports as string[], credentialDeviceType, userId)

    return res
        .status(200)
        .clearCookie("challenge", challengeCookieOptions)
        .json(new ApiResponse(200, null, "Passkey registered successfully"))


})

export const getPasskeyLoginOptions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const loginOptions = await generateLoginOptions()
    return res
        .status(200)
        .cookie("login_challenge", loginOptions.challenge, challengeCookieOptions)
        .json(new ApiResponse(200, loginOptions, "Passkey login options generated successfully"))
})


export const verifyPasskeyLogin = asyncHandler(async (req: AuthRequest, res: Response) => {

    const credentialPayload = req.body as AuthenticationResponseJSON
    const expectedChallenge = req.signedCookies["login_challenge"]
    if (!expectedChallenge) {
        return res.status(400).json(new ApiResponse(400, null, "No login challenge found"))
    }

    const credentialID = credentialPayload.id
    const passkeyWithUser = await getPasskeyAndUserFromCredentialID(credentialID)
    if (!passkeyWithUser) {
        return res.status(404).json(new ApiResponse(404, null, "Passkey not registered"))
    }
    const verification = await verifyLogin(credentialPayload, expectedChallenge, passkeyWithUser)
    const { verified, authenticationInfo } = verification
    if (!verified || !authenticationInfo) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid Passkey"))
    }

    await updateCounter(credentialID, BigInt(authenticationInfo.newCounter))

    const accessToken = generateAccessToken(passkeyWithUser.userId)
    const refreshToken = generateRefreshToken(passkeyWithUser.userId)

    await authService.saveRefreshToken(passkeyWithUser.userId, refreshToken)

    return res
        .status(200)
        .clearCookie("login_challenge", challengeCookieOptions)
        .cookie("accessToken", accessToken, authCookieOptions)    // matches req.cookies?.accessToken in auth middleware
        .cookie("refreshToken", refreshToken, authCookieOptions)  // matches req.cookies.refreshToken in refresh endpoint
        .json(new ApiResponse(200, passkeyWithUser.user, "Passkey login successful"))
})