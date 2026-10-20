import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { CreateUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { hashPassword } from "../utils/bcrypt.utils";
import { hashToken } from "../utils/tokenHash.utils";



export class AuthService{

    public async findSessionByUserIdAndToken(userId:string, token:string){
        try {
            // Tokens are stored as a SHA-256 digest, so the session is found by direct equality.
            return await prisma.session.findFirst({
                where:{userId:userId, refreshToken:hashToken(token)}
            })
        } catch {
            
            throw new ApiError(404,"connection to DB failed")
            
        }
    }

    public async deleteSessionById(sessionId:string){
        return await prisma.session.delete({
            where:{id:sessionId}
        })
    }


    // Google accounts must only come from the verified Google callback (provider "google" here means Google
    // has already confirmed the email); signup only ever creates "credentials" accounts.
    public async createUser(data:CreateUserInput){



        if(data.provider=="credentials"){

            // Hash before opening the transaction: bcrypt is slow and shouldn't hold a DB connection
            const passwordHash = await hashPassword(data.password)

            return await prisma.$transaction(async(tx)=>{

            // An email that already has an account is always a 409, whatever that account signs in with.
            // Never attach a password to an existing (e.g. Google-only) account here: signup proves nothing
            // about who owns the email, so that would let anyone take over the account by "signing up" with it.
            const existingUser = await tx.user.findUnique({
                where:{email:data.email}
            })
            if(existingUser){
                throw new ApiError(409, "User already exists with same email id")
            }

            const Newuser = await tx.user.create({
                data:{
                    email: data.email,
                    fullName: data.fullName,
                    phone:data.phone,
                    avatarUrl:"https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"

                }
            })

            // create auth account with credentials
            await tx.authAccount.create({
                    data:{
                        userId: Newuser.id,
                        provider:"credentials",
                        passwordHash: passwordHash
                    }
                })

            return Newuser

        })

        }

        if(data.provider=="google"){

            


            return await prisma.$transaction(async(tx)=>{


                const existingUser = await tx.user.findUnique({
                where:{email:data.email}
                })

            if(existingUser){                


                //check if credentials auth exists for existing user
                const authAccountCrendential = await tx.authAccount.findUnique({
                    where:{
                        userId_provider:{
                            userId: existingUser.id,
                            provider: "credentials"
                        }
                    }
                })

                //check if google auth exists for existing user
                const authAccountGoogle = await tx.authAccount.findUnique({
                    where:{
                        userId_provider:{
                            userId: existingUser.id,
                            provider: "google"
                        }
                    }
                })

                if(authAccountCrendential && !authAccountGoogle){

                    //add a row with google auth for existing user
                    await tx.authAccount.create({
                        data:{
                            userId: existingUser.id,
                            provider:"google",
                            providerId: data.providerId
                        }
                    })


                    //update avatarurl with google avatar
                    await tx.user.update({
                        where:{id:existingUser.id},
                        data:{avatarUrl:data.avatar}
                    })

                    return existingUser
                }
                
                

                //if google auth already exists, return existing user
                if(authAccountGoogle){
                    return existingUser
                }

                throw new ApiError(409, "User already exists with same email id")
            }

            //create user
            
            const Newuser = await tx.user.create({
                data:{
                    email: data.email,
                    fullName: data.fullName,
                    avatarUrl:data.avatar,

                }
            })


            // create auth account with google
            await tx.authAccount.create({
                    data:{
                        userId: Newuser.id,
                        provider:"google",
                        providerId: data.providerId
                    }
                })

            return Newuser

        })
            
            
        }
    }


    // Creates the session row for a freshly issued refresh token, sweeping the user's expired sessions
    // in the same transaction so rows can't pile up (uses the Session(userId) index, so it stays cheap).
    private async createSession(tx:Prisma.TransactionClient, userId:string, token:string){
        // Session lifetime follows the token's own exp claim, so it always matches REFRESH_TOKEN_EXPIRY
        const { exp } = jwt.decode(token) as { exp: number }

        await tx.session.deleteMany({
            where:{userId:userId, expiresAt:{lt:new Date()}}
        })
        return await tx.session.create({
            data:{
                userId:userId,
                refreshToken: hashToken(token),
                expiresAt: new Date(exp * 1000)
            }
        })
    }

    public async saveRefreshToken(userId:string, token:string){
        return await prisma.$transaction((tx) => this.createSession(tx, userId, token))
    }

    // Retires `sessionId` and creates the session for `newToken` atomically: either both happen or
    // neither does, so a crash mid-refresh can't leave the user with no valid session.
    // Returns null if the session was already retired, i.e. a concurrent refresh with the same token
    // won the race; only one of them may mint a new session.
    public async rotateSession(sessionId:string, userId:string, newToken:string){
        return await prisma.$transaction(async (tx) => {
            const retired = await tx.session.updateMany({
                where:{id:sessionId, revokedAt:null},
                data:{revokedAt:new Date()}
            })
            if (retired.count === 0) return null
            return await this.createSession(tx, userId, newToken)
        })
    }

    // Response to refresh-token reuse: sign the user out of every device.
    public async revokeAllSessions(userId:string){
        await prisma.session.deleteMany({
            where:{userId:userId}
        })
    }

    public async deleteRefreshToken(userId:string, token:string){

        await prisma.session.deleteMany({
            where:{userId:userId, refreshToken:hashToken(token)}
        })
    }



    // Sign-in lookup. Both queries always run, in parallel, whether or not the email exists, so an
    // unknown email takes the same time as a known one. (`include` would skip its second query when
    // there's no user, which makes "not registered" measurably faster.)
    public async findUserWithCredentialAccount(email:string){
        const [user, credentialAccount] = await Promise.all([
            prisma.user.findUnique({ where:{email:email} }),
            prisma.authAccount.findFirst({ where:{provider:"credentials", user:{email:email}} }),
        ])
        return { user, credentialAccount }
    }


    public async getUserById(userId:string){
        return await prisma.user.findUnique({
            where:{id:userId}
        })
    }
}