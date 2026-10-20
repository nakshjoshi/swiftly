import type { Request, Response } from "express";
import { authCookieOptions } from "../config/cookies";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { AuthRequest, createUserInput, SignIn } from "../types/auth.types";
import { ApiError } from "../utils/apiError.utils";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse.utils";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils";
import { verifyPassword } from "../utils/bcrypt.utils";
import { googleClientId, googleOAuth2Client } from "../utils/googleOauth2";


const Auth = new AuthService()

// bcrypt hash of a random value nobody knows, compared against when the account has no password
const DUMMY_PASSWORD_HASH = "$2b$10$qeRLVs/q1yN41TCcWEcxsuYm2kr41fiHKdnBWqmgRrpcVSoV/Dyfi"

export const signUp = asyncHandler(async (req: Request, res: Response) => {

    console.log(req.body)

    const { email, fullName, phone, provider, providerId, hashedPassword }: createUserInput = req.body

    if (!email?.trim() || !fullName?.trim() || (!hashedPassword?.trim() && !providerId?.trim())) {
        throw new ApiError(400, "Please fill mandatory field")
    }


    const data: createUserInput = {
        email: email.trim().toLowerCase(),
        fullName,
        phone,
        provider,
        providerId,
        hashedPassword,
    } as createUserInput


    const createdUser = await Auth.createUser(data)
    const accessToken = generateAccessToken(createdUser!.id)
    const refreshToken = generateRefreshToken(createdUser!.id)

    await Auth.saveRefreshToken(createdUser!.id, refreshToken)

    return res
        .status(201)
        .cookie("accessToken", accessToken, authCookieOptions)
        .cookie("refreshToken", refreshToken, authCookieOptions)
        .json(new ApiResponse(201, createdUser, "User registered successfully"))

})


export const signIn = asyncHandler(async (req: Request, res: Response) => {

    // console.log(req.body)

    const { email, hashedPassword }: SignIn = req.body

    if (!email?.trim() || !hashedPassword?.trim()) {
        throw new ApiError(400, "Email and Password are required")
    }

    // Password login only ever checks the credentials account; a client-supplied provider would let
    // the caller probe other accounts (e.g. google, which has no passwordHash).
    const { user, credentialAccount } = await Auth.findUserWithCredentialAccount(email.trim().toLowerCase())

    // Always run one bcrypt compare, even when there is no user or no password, so response time
    // doesn't reveal whether the email is registered.
    const isPasswordValid = await verifyPassword(hashedPassword, credentialAccount?.passwordHash ?? DUMMY_PASSWORD_HASH)

    // One message and status for every failure: unknown email, Google-only account, wrong password.
    if (!user || !credentialAccount?.passwordHash || !isPasswordValid) {
        throw new ApiError(401, "Invalid email or password")
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    await Auth.saveRefreshToken(user.id, refreshToken)

    return res
        .status(200)
        .cookie("accessToken", accessToken, authCookieOptions)
        .cookie("refreshToken", refreshToken, authCookieOptions)
        .json(new ApiResponse(200, user, "loggedIn"))

})


export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {

    const userId = req.userId

    if (req.cookies.refreshToken) {
        await Auth.deleteRefreshToken(userId, req.cookies.refreshToken)
    }


    res
        .status(200)
        .clearCookie("accessToken", authCookieOptions)
        .clearCookie("refreshToken", authCookieOptions)
        .json(`cookies cleared for user`)




})


export const googleAuth = asyncHandler(async (req: AuthRequest, res: Response) => {

    const googleCode = req.query.code

    const googleTokens = await googleOAuth2Client.getToken(googleCode as string)

    const ticket = await googleOAuth2Client.verifyIdToken({
        idToken: googleTokens.tokens.id_token!,
        audience: googleClientId

    })

    const payload = ticket.getPayload()

    if (payload?.email_verified) {
        const email = payload.email
        const fullName = payload.name
        const providerId = payload.sub
        const avatar = payload.picture


        const data: createUserInput = {
            email: email,
            fullName: fullName,
            provider: "google",
            providerId: providerId,
            avatar: avatar
        } as createUserInput


        const user = await Auth.createUser(data)

        // log("This is the user returned from google auth",user)

        const accessToken = generateAccessToken(user!.id)
        const refreshToken = generateRefreshToken(user!.id)

        await Auth.saveRefreshToken(user!.id, refreshToken)

        return res
            .status(201)
            .cookie("accessToken", accessToken, authCookieOptions)
            .cookie("refreshToken", refreshToken, authCookieOptions)
            .json(new ApiResponse(201, user, "User registered successfully"))






    } else {
        throw new ApiError(400, "Google account email not verified")
    }



})


export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {

    const refreshTokenFromCookie = req.cookies.refreshToken
    const refreshTokenFromHeader = req.header("Authorization")?.replace("Bearer ", "")

    const refreshToken = refreshTokenFromCookie || refreshTokenFromHeader

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found, please login again")
    }

    const decoded = verifyRefreshToken(refreshToken)

    if (!decoded) {
        throw new ApiError(401, "Invalid refresh token, please login again")
    }

    const userId = decoded.userId

    const matchedSession = await Auth.findSessionByUserIdAndToken(userId, refreshToken)

    if (!matchedSession) {
        throw new ApiError(401, "Session not found, please login again")
    }

    if (matchedSession.expiresAt < new Date()) {
        await Auth.deleteSessionById(matchedSession.id)
        res.clearCookie("refreshToken", authCookieOptions).clearCookie("accessToken", authCookieOptions)
        throw new ApiError(401, "Refresh token expired, please login again")
    }

    const accessToken = generateAccessToken(matchedSession.userId)
    const newRefreshToken = generateRefreshToken(matchedSession.userId)

    await Auth.deleteSessionById(matchedSession.id)
    await Auth.saveRefreshToken(matchedSession.userId, newRefreshToken)

    return res
        .cookie("accessToken", accessToken, authCookieOptions)
        .cookie("refreshToken", newRefreshToken, authCookieOptions)
        .json(new ApiResponse(200, null, "Token refreshed successfully"))

})