import prisma from "../config/prisma";
import type { createUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";



class AuthService{

    public async findUserbyEmail(email:string){
        try {
            const user = await prisma.users.findUnique({
                where:{email:email}
            })
    
            return user;
        } catch (error) {
            
            throw new ApiError(404,"Email ID doesn't exist")
            
        }
    }


    public async createUser(data:createUserInput){

        return await prisma.$transaction(async(tx)=>{


            const existingUser = await tx.users.findUnique({
                where:{email:data.email}
            })

            if(existingUser){
                return {
                    success:false,
                    message: "user with this email already exists",
                    data:null
                }
            }





            //create user

            const user = tx.users.create({
                data:{
                    email: data.email,
                    fullName: data.fullName,
                    phone:data.phone

                }
            })


            // create auth


            if(data.provider=="credentials"){
                
            }






        })


    }
}