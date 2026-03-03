import prisma from "../config/prisma";
import type { createUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";



class AuthService{

    public async findUserbyEmail(email:string){
        try {
            const user = await prisma.user.findUnique({
                where:{email:email}
            })
    
            return user;
        } catch (error) {
            
            throw new ApiError(404,"Email ID doesn't exist")
            
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
}