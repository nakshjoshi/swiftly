import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadAndParseResume, createResume } from "../controllers/resumeUpload.controller";

import { resumeParseLimiter } from "../middlewares/rateLimit.middleware";

const resumeRouter = Router()


resumeRouter.route('/createResume').post(authMiddleware, createResume)
resumeRouter.route('/uploadAndParse').post(authMiddleware, resumeParseLimiter, upload.single("resume"), uploadAndParseResume)


export default resumeRouter;