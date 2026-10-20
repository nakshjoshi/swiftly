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
// Two refreshes with the same token inside this window (e.g. two tabs waking up together) are treated as a
// race, not as theft. After it, presenting an already-rotated token revokes every session of the user.
const REFRESH_REUSE_GRACE_MS = 30 * 1000

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


    return res
        .status(200)
        .clearCookie("accessToken", authCookieOptions)
        .clearCookie("refreshToken", authCookieOptions)
        .json(new ApiResponse(200, null, "Logged out successfully"))




})


// POST /api/v1/auth/google/callback  body: { code }
// The web app uses Google's popup "auth-code" flow, so the code arrives in JS and is posted here.
export const googleAuth = asyncHandler(async (req: AuthRequest, res: Response) => {

    // Login-CSRF defence for the popup flow (Google's recommendation): require a custom header.
    // A cross-site page can't set it without a CORS preflight, which only our own origins pass, so an
    // attacker can't make a victim's browser redeem the attacker's code and get logged into their account.
    if (req.header("X-Requested-With") !== "XmlHttpRequest") {
        throw new ApiError(403, "Missing X-Requested-With header")
    }

    const code = typeof req.body?.code === "string" ? req.body.code.trim() : ""
    if (!code) {
        throw new ApiError(400, "Google authorization code is required")
    }

    let payload
    try {
        const { tokens } = await googleOAuth2Client.getToken(code)
        if (!tokens.id_token) {
            throw new Error("Google token response had no id_token")
        }
        const ticket = await googleOAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: googleClientId
        })
        payload = ticket.getPayload()
    } catch (error) {
        // Expired/reused/forged codes land here (Google returns invalid_grant). Log the detail, keep the response generic.
        console.warn("[auth] Google code exchange failed:", (error as Error).message)
        throw new ApiError(401, "Google sign-in failed, please try again")
    }

    if (!payload?.email || !payload.email_verified) {
        throw new ApiError(400, "Google account email not verified")
    }

    const data: createUserInput = {
        email: payload.email.toLowerCase(),
        fullName: payload.name,
        provider: "google",
        providerId: payload.sub,
        avatar: payload.picture
    } as createUserInput

    const user = await Auth.createUser(data)

    const accessToken = generateAccessToken(user!.id)
    const refreshToken = generateRefreshToken(user!.id)

    await Auth.saveRefreshToken(user!.id, refreshToken)

    // This endpoint signs in returning Google users as well as creating new ones, so it's a 200, not a 201
    return res
        .status(200)
        .cookie("accessToken", accessToken, authCookieOptions)
        .cookie("refreshToken", refreshToken, authCookieOptions)
        .json(new ApiResponse(200, user, "Signed in with Google"))
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

    if (matchedSession.revokedAt) {
        // This refresh token was already exchanged for a new one.
        if (Date.now() - matchedSession.revokedAt.getTime() <= REFRESH_REUSE_GRACE_MS) {
            // Benign: another tab/request refreshed with the same token a moment ago and already got the
            // new cookies. Don't clear cookies here, that would wipe the fresh ones the winner just set.
            throw new ApiError(401, "Session was just refreshed, please retry")
        }
        // A rotated token showing up later means two parties hold it: the user and whoever copied it.
        // We can't tell which is which, so end every session and make the real user sign in again.
        console.warn(`[auth] refresh token reuse detected for user ${userId}; revoking all sessions`)
        await Auth.revokeAllSessions(userId)
        res.clearCookie("refreshToken", authCookieOptions).clearCookie("accessToken", authCookieOptions)
        throw new ApiError(401, "Session expired, please sign in again")
    }

    if (matchedSession.expiresAt < new Date()) {
        await Auth.deleteSessionById(matchedSession.id)
        res.clearCookie("refreshToken", authCookieOptions).clearCookie("accessToken", authCookieOptions)
        throw new ApiError(401, "Refresh token expired, please login again")
    }

    const accessToken = generateAccessToken(matchedSession.userId)
    const newRefreshToken = generateRefreshToken(matchedSession.userId)

    const newSession = await Auth.rotateSession(matchedSession.id, matchedSession.userId, newRefreshToken)
    if (!newSession) {
        // Lost a race with a concurrent refresh of the same token; that request has the new cookies
        throw new ApiError(401, "Session was just refreshed, please retry")
    }

    return res
        .cookie("accessToken", accessToken, authCookieOptions)
        .cookie("refreshToken", newRefreshToken, authCookieOptions)
        .json(new ApiResponse(200, null, "Token refreshed successfully"))

})