import { Router } from "express";
import { googleAuth, logout, signIn, signUp, refreshToken } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserProfile } from "../controllers/profile.controller";


import { loginLimiter, refreshLimiter, signupLimiter } from "../middlewares/rateLimit.middleware";

const authRouter = Router()

authRouter.route('/signup').post(signupLimiter, signUp)
authRouter.route('/signin').post(loginLimiter, signIn)
authRouter.route('/google/callback/').get(signupLimiter, googleAuth)


authRouter.route('/refresh').post(refreshLimiter, refreshToken)
authRouter.route('/logout').post(authMiddleware, logout)
authRouter.route('/userProfile').get(authMiddleware, getUserProfile)
export default authRouter;