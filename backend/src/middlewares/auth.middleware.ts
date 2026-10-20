import type { Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.utils';
import { verifyAccessToken } from '../utils/jwt.utils';
import type { AuthRequest } from '../types/auth.types';

// Synchronous, so there is no asyncHandler: Express 5 forwards a sync throw to the error handler.
// No try/catch on purpose — a catch-all that rewrites every failure to a 401 would hide real bugs
// (they should surface as a logged 500) and discard the specific reason for a rejection.
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const tokenFromCookie = req.cookies?.accessToken
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "")

    const token = tokenFromCookie || tokenFromHeader
    if (!token) {
        throw new ApiError(401, "Unauthorized request: no token provided")
    }

    // verifyAccessToken returns null for a bad signature, malformed or expired token
    const decoded = verifyAccessToken(token)
    if (!decoded) {
        throw new ApiError(401, "Unauthorized request: invalid or expired token")
    }

    req.userId = decoded.userId
    next()
}
