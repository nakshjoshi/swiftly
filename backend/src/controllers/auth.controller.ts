import type { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { createUserInput, SignIn } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse.utils";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { hash, verifyPassword } from "../utils/bcrypt.utils";


const Auth = new AuthService()

export const signUp = asyncHandler(async (req: Request, res: Response)=>{

    const {email, fullName, phone, provider, providerId, hashedPassword}:createUserInput = req.body

    if (!email?.trim() || !fullName?.trim() || (!hashedPassword?.trim() && !providerId?.trim())){
        throw new ApiError(400, "Please fill mandatory field")  
    }


    const data: createUserInput = {
        email: email.trim().toLowerCase(),
        fullName,
        phone,
        provider,
        providerId,
        hashedPassword
    } as createUserInput

    
    const createdUser = await Auth.createUser(data)
    const accessToken = generateAccessToken(createdUser.id)
    const refreshToken = generateRefreshToken(createdUser.id)

    const hashedRefreshToken = await hash(refreshToken)
    
    await Auth.saveRefreshToken(createdUser.id, hashedRefreshToken)

    const options : CookieOptions= {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
    }

    return res
            .status(201)
            .cookie("accessToken", accessToken,options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(201, createdUser, "User registered successfully"))

})


export const signIn = asyncHandler(async(req:Request, res: Response)=>{

    const {email, password, provider}:SignIn = req.body

    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400, "Email and Password are required")
    }

    const userData: SignIn = {
        email: email.trim().toLowerCase(),
        password: password,
        provider:provider
    }

    if(!email.trim().toLowerCase() || !password.trim()){
        throw new ApiError(400, "Email and Password are required")
    }

    const user = await Auth.findUserbyEmail(userData.email)
    const userAuthDetails = await Auth.getUserAuthAccount(user?.id as string, userData.provider )

    if(!user){
        throw new ApiError(400, "user does not exist")
    }

    const isPasswordValid = await verifyPassword(userData.password, userAuthDetails?.passwordHash as string )
    
})


export const logout = asyncHandler(async(req:Request, res:Response)=>{

    const userId = req.body.userId
    req.cookies.accessToken

    await Auth.deleteRefreshToken(userId, req.cookies.refreshToken)


    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    



})