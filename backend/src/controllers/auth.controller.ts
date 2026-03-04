import type { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { createUserInput } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse.utils";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import { hash } from "../utils/bcrypt.utils";


const Auth = new AuthService()

const signUp = asyncHandler(async (req: Request, res: Response)=>{

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


