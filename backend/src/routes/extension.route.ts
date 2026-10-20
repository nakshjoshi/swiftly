import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getObjectForAutofill } from "../controllers/extension.controller";

import { autofillLimiter } from "../middlewares/rateLimit.middleware";

const extensionRouter = Router()

extensionRouter.route('/getAutofillData').post(authMiddleware, autofillLimiter, getObjectForAutofill)

export default extensionRouter;