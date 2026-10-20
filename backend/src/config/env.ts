// Validated environment config. Importing this module crashes the process at startup if
// anything security-critical is missing or weak — never fall back to a default secret.

// Old hardcoded fallbacks that lived in the repo. They are in git history, so they are public.
const LEAKED_DEFAULTS = new Set([
    "myaccesstoken",
    "myrefreshtoken",
    "hi-cookie-secret-is-this-for-now-but-will-change-it-soon",
])

const MIN_SECRET_LENGTH = 32

const errors: string[] = []

const required = (name: string): string => {
    const value = process.env[name]?.trim()
    if (!value) {
        errors.push(`${name} is not set`)
        return ""
    }
    return value
}

const requiredSecret = (name: string): string => {
    const value = required(name)
    if (!value) return value
    if (LEAKED_DEFAULTS.has(value)) {
        errors.push(`${name} is set to a value that was hardcoded in the repo — generate a new one`)
    } else if (value.length < MIN_SECRET_LENGTH) {
        errors.push(`${name} must be at least ${MIN_SECRET_LENGTH} characters`)
    }
    return value
}

// Only an explicit NODE_ENV=development (set by `bun run dev`) relaxes cookie security.
// Unset or anything else is treated as production, so a misconfigured deploy fails safe.
const IS_DEV = process.env.NODE_ENV?.trim() === "development"

export const env = {
    IS_DEV,
    // Shared parent domain for auth cookies, e.g. ".swiftly.nakshjoshi.in". Must not be set locally:
    // a cookie for that domain is rejected by the browser on localhost.
    COOKIE_DOMAIN: IS_DEV ? undefined : required("COOKIE_DOMAIN"),
    DATABASE_URL: required("DATABASE_URL"),
    ACCESS_TOKEN_SECRET: requiredSecret("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requiredSecret("REFRESH_TOKEN_SECRET"),
    COOKIE_SECRET: requiredSecret("COOKIE_SECRET"),
}

// If both JWT secrets were equal, an access token would also pass as a refresh token (and vice versa).
if (env.ACCESS_TOKEN_SECRET && env.ACCESS_TOKEN_SECRET === env.REFRESH_TOKEN_SECRET) {
    errors.push("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different")
}

if (errors.length) {
    throw new Error(
        `Invalid environment configuration:\n${errors.map((e) => `  - ${e}`).join("\n")}\n` +
        `Generate a secret with: openssl rand -base64 48`
    )
}
