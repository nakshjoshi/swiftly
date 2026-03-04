import { Router } from "express";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware";

const resumeRouter = Router()


resumeRouter.route('/uploadAndParse').post(upload.single("resume"))


export default resumeRouter;