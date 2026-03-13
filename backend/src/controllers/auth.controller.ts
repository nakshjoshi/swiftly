import type { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { AuthRequest, createUserInput, SignIn } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse.utils";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { hash, verifyPassword } from "../utils/bcrypt.utils";
import cookieParser from "cookie-parser";


const Auth = new AuthService()

export const signUp = asyncHandler(async (req: Request, res: Response)=>{

    console.log(req.body)

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
    
    await Auth.saveRefreshToken(createdUser.id, refreshToken)

    const options : CookieOptions= {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
    }

    return res
            .status(201)
            .cookie("accessToken", accessToken,options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(201, createdUser.email, "User registered successfully"))

})


export const signIn = asyncHandler(async(req:Request, res: Response)=>{

    // console.log(req.body)

    const {email, hashedPassword, provider}:SignIn = req.body

    if(!email?.trim() || !hashedPassword?.trim()){
        throw new ApiError(400, "Email and Password are required")
    }

    const userData: SignIn = {
        email: email.trim().toLowerCase(),
        hashedPassword: hashedPassword,
        provider:provider
    }

    if(!email.trim().toLowerCase() || !hashedPassword.trim()){
        throw new ApiError(400, "Email and Password are required")
    }

    const user = await Auth.findUserbyEmail(userData.email)
    const userAuthDetails = await Auth.getUserAuthAccount(user?.id as string, userData.provider )

    if(!user){
        throw new ApiError(400, "user does not exist")
    }

    const isPasswordValid = await verifyPassword(userData.hashedPassword, userAuthDetails?.passwordHash as string )

    const options : CookieOptions= {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".swiftly.nakshjoshi.in",
        path: "/"
    }

    if(isPasswordValid){
        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
        await Auth.saveRefreshToken(user.id, refreshToken)

        res
            .cookie("accessToken", accessToken,options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(201,null,"loggedIn"))

    }

    if(!isPasswordValid){
        throw new ApiError(401, "Wrong Password")
    }
    
})


export const logout = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = req.userId


    
    const user = await Auth.deleteRefreshToken(userId, req.cookies.refreshToken)


    res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(`cookies cleared ${user}`)
    



})