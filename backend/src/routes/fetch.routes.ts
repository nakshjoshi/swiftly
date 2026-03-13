import {Router} from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fetchResumeForUser } from "../controllers/profile.controller";

const fetchRouter = Router()

fetchRouter.route('/fetchResumeForUser').get(authMiddleware, fetchResumeForUser)

export default fetchRouter