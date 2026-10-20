import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import type { User } from '../types/user.types';
import { env } from '../config/env';

const accessTokenSecret = env.ACCESS_TOKEN_SECRET
const accessTokenExpiry = env.ACCESS_TOKEN_EXPIRY


const refreshTokenSecret = env.REFRESH_TOKEN_SECRET
const refreshTokenExpiry = env.REFRESH_TOKEN_EXPIRY

const generateAccessToken = (userId:string)=>{
    return jwt.sign({
        userId: userId,
        role: "user"
    } as JwtPayload,
    accessTokenSecret,{
        expiresIn:accessTokenExpiry
    } as SignOptions)
}


const generateRefreshToken = (userId:string)=>{
    return jwt.sign({
        userId:userId,
        role:"user"

    }as JwtPayload, refreshTokenSecret,
    {
        expiresIn:refreshTokenExpiry,
        // iat only has 1s resolution; jwtid makes every refresh token unique even if issued within the same second
        jwtid: crypto.randomUUID()
    } as SignOptions)
}



const verifyAccessToken = (token: string): User | null => {
    try {
        const decoded = jwt.verify(token, accessTokenSecret) as any;
        if (decoded && decoded.userId) {
            return decoded as User;
        }
        return null;
    } catch {
        return null;
    }
}


const verifyRefreshToken = (token:string)=>{

    try {       
        const decoded = jwt.verify(token, refreshTokenSecret) as any
        if(decoded && decoded.userId){
            return decoded as User
        }
        return null
    } catch {
        return null
    }
}


export {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}