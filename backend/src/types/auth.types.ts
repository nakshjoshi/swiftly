import type { Request } from "express";

type NewUserBase = {
    email: string
    fullName?: string | null
    phone?: string | null
    avatar?: string | null
}

// `password` is the user's plaintext password as typed; createUser hashes it before storing.
export type CredentialUserInput = NewUserBase & {
    provider: "credentials"
    password: string
    providerId?: undefined
}

// Only built from a verified Google ID token (googleAuth), never from request bodies.
export type GoogleUserInput = NewUserBase & {
    provider: "google"
    providerId: string
    password?: undefined
}

export type CreateUserInput = CredentialUserInput | GoogleUserInput

// userId is declared on Express.Request itself (types/express.d.ts); this alias is kept so existing
// handler signatures keep reading as "this route is authenticated".
export type AuthRequest = Request