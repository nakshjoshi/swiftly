import crypto from "crypto"

// Refresh tokens are long, high-entropy JWTs, so a fast full-length digest is the right tool.
// (bcrypt is a password KDF and silently ignores everything past byte 72 of its input.)
const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export { hashToken }
