import prisma from "../config/prisma";
import type { createUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";



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
        return await prisma.user.update({

            where:{id:userId},
            data:{refreshToken:token}
        })
    }
}