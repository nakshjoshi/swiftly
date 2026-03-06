import { Router } from "express";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadAndParseResume } from "../controllers/resumeUpload.controller";

const resumeRouter = Router()


resumeRouter.route('/uploadAndParse').post(authMiddleware, upload.single("resume"), uploadAndParseResume)


export default resumeRouter;