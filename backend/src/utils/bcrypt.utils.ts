import bcrypt from 'bcrypt'
import { password } from 'bun'

const hashPassword = async(password:string):Promise<string>=>{

    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword

}


const verifyPassword = async(password:string, hashedPassword:string):Promise<boolean>=>{
    return await bcrypt.compare(password, hashedPassword);
}