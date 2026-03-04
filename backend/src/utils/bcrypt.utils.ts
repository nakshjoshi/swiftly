import bcrypt from 'bcrypt'


const hashPassword = async(password:string):Promise<string>=>{

    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword

}


const verifyPassword = async(password:string, hashedPassword:string):Promise<boolean>=>{
    return await bcrypt.compare(password, hashedPassword);
}

const hash = async(toBeHashed:string):Promise<string>=>{

    const hashed = await bcrypt.hash(toBeHashed, 10)
    return hashed

}

export {hash, hashPassword, verifyPassword}