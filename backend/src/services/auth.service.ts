import prisma from "../config/prisma";
import type { createUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { hash, hashPassword, verifyHash, verifyPassword } from "../utils/bcrypt.utils";



export class AuthService{

    public async findUserbyEmail(email:string){
        try {
            const user = await prisma.user.findUnique({
                where:{email:email}
            })
    
            return user;
        } catch (error) {
            
            throw new ApiError(404,"connection to DB failed")
            
        }
        
    }


    public async createUser(data:createUserInput){


        if(data.hashedPassword){
                let newHashedPassword = await hashPassword(data.hashedPassword)
                data.hashedPassword = newHashedPassword
            }

        return await prisma.$transaction(async(tx)=>{


            const existingUser = await tx.user.findUnique({
                where:{email:data.email}
            })

            if(existingUser){
                throw new ApiError(409, "User already exists")
            }





            //create user

            const user = await tx.user.create({
                data:{
                    email: data.email,
                    fullName: data.fullName,
                    phone:data.phone

                }
            })


            // create auth


            


            if(data.provider=="credentials"){

                await tx.authAccount.create({
                    data:{
                        userId: user.id,
                        provider:"credentials",
                        passwordHash: data.hashedPassword
                    }
                })

            } else{
                await tx.authAccount.create({
                    data:{
                        userId: user.id,
                        provider: data.provider,
                        providerId:data.providerId
                    }
                })
            }




            return user

        })


    }


    public async saveRefreshToken(userId:string, token:string){

        const hashedToken = await hash(token)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        return await prisma.session.create({
            data:{
                userId:userId,
                refreshToken: hashedToken,
                expiresAt: expiresAt
            }
        })
    }
    
    public async deleteRefreshToken(userId:string, token:string){

        const sessions = await prisma.session.findMany({
            where:{userId:userId}
        })

        for(const i of sessions){
            const isValid = await verifyHash(token, i.refreshToken)

            if(isValid){
                await prisma.session.delete({
                    where:{id:i.id}
                })
            }
        }
        
    }


    public async getUserAuthAccount(userId:string, provider:string){
        return await prisma.authAccount.findUnique({
            where:{

                userId_provider:{
                userId:userId,
                provider:provider
                }
            }
        })
    }
}