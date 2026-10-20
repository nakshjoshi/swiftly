import rateLimit, { type Options } from "express-rate-limit"
import type { AuthRequest } from "../types/auth.types"
import { ApiError } from "../utils/apiError.utils"

// In-memory counters: fine for a single backend instance. If the API ever runs as several
// instances behind a load balancer, give each limiter a shared `store` (e.g. rate-limit-redis),
// otherwise every instance counts separately and the effective limit multiplies.

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

const limiter = (windowMs: number, limit: number, message: string, extra: Partial<Options> = {}) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-8", // RateLimit / RateLimit-Policy headers, so clients can back off
        legacyHeaders: false,
        // Route 429s through the central error handler so they have the usual JSON shape
        handler: (req, res, next) => next(new ApiError(429, message)),
        ...extra,
    })

// Expensive endpoints sit behind authMiddleware, so limit per user rather than per IP:
// one abusive account can't hide behind rotating IPs, and users sharing an office/campus NAT
// don't share one budget.
const perUser: Partial<Options> = {
    keyGenerator: (req) => `user:${(req as AuthRequest).userId}`,
}

// ─── Unauthenticated (keyed by IP) ───────────────────────────────────────────

// Broad backstop for every route
export const globalLimiter = limiter(15 * MINUTE, 1000, "Too many requests, please slow down")

// Password and passkey sign-in. Only failures count, so a user who logs in fine is never blocked.
export const loginLimiter = limiter(15 * MINUTE, 10, "Too many failed sign-in attempts, try again in 15 minutes", {
    skipSuccessfulRequests: true,
})

export const signupLimiter = limiter(HOUR, 10, "Too many accounts created from this network, try again later")

// The web client refreshes on every 401, possibly several in parallel, so this one is generous.
export const refreshLimiter = limiter(15 * MINUTE, 100, "Too many session refreshes, please sign in again")

// ─── Authenticated + costly (keyed by user) ──────────────────────────────────

// Each upload = file parse + one Gemini call
export const resumeParseLimiter = limiter(HOUR, 10, "Resume upload limit reached, try again in an hour", perUser)

// One Gemini call per autofill; a user filling forms all day stays well under this
export const autofillLimiter = limiter(HOUR, 100, "Autofill limit reached, try again later", perUser)

// Each compile can hold the latex-service for up to 90 seconds
export const compileLimiter = limiter(HOUR, 30, "PDF compile limit reached, try again later", perUser)
