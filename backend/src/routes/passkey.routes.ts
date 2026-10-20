import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { setupPasskey, verifyPasskey, getPasskeyLoginOptions, verifyPasskeyLogin } from "../controllers/passkey.controller";

import { loginLimiter } from "../middlewares/rateLimit.middleware"

const passkeyRouter = Router()

// Registration (requires auth — user must be logged in to add a passkey)
passkeyRouter.route('/generate-passkey-options').get(authMiddleware, setupPasskey)
passkeyRouter.route('/verify-passkey').post(authMiddleware, verifyPasskey)

// Login (no auth — user is authenticating via passkey)
passkeyRouter.route('/generate-login-options').get(getPasskeyLoginOptions)
passkeyRouter.route('/verify-login').post(loginLimiter, verifyPasskeyLogin)

export default passkeyRouter