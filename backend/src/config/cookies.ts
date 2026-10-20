import type { CookieOptions } from "express"
import { env } from "./env"

// Single source of truth for every cookie the API sets or clears.
//
// Production: frontend and API live on different subdomains, so the cookie must be Secure,
//   SameSite=None and scoped to the shared parent domain (COOKIE_DOMAIN).
// Development (NODE_ENV=development): localhost:3000 -> localhost:3001 is same-site, and plain http
//   can't carry Secure cookies, so use SameSite=Lax with no Domain (a host-only cookie).
const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: !env.IS_DEV,
    sameSite: env.IS_DEV ? "lax" : "none",
    path: "/",
    ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
}

// accessToken / refreshToken
export const authCookieOptions: CookieOptions = baseCookieOptions

// Short-lived, signed WebAuthn challenge cookies. Also pass this to clearCookie — browsers only
// clear a cookie when the attributes match (Express ignores maxAge when clearing).
export const challengeCookieOptions: CookieOptions = {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 5,
    signed: true,
}
