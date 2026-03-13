import {Router} from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fetchFullDetailsOfOneResume, fetchResumeForUser } from "../controllers/profile.controller";

const fetchRouter = Router()

fetchRouter.route('/fetchResumeForUser').get(authMiddleware, fetchResumeForUser)
fetchRouter.route('/fetchResumeById/:resumeId').get(authMiddleware, fetchFullDetailsOfOneResume);
export default fetchRouter