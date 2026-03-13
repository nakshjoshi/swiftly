import {Router} from "express"
import resumeRouter from "./resume.routes"
import { authMiddleware } from "../middlewares/auth.middleware"
import { fetchResumeForUser } from "../controllers/profile.controller";
import { updateAchievementsForResume, updateEducationForResume, updateExperienceForResume, updatePorForResume, updateProjectsForResume, updatePublicationsForResume, updateResumeForUser, updateSkillsForResume } from "../controllers/update.controller";



const updateRouter = Router()

resumeRouter.route('/updateResume').post(authMiddleware, updateResumeForUser)
resumeRouter.route('/updateEducation').post(authMiddleware, updateEducationForResume)
resumeRouter.route('/updateExperience').post(authMiddleware, updateExperienceForResume)
resumeRouter.route('/updateProjects').post(authMiddleware, updateProjectsForResume)
resumeRouter.route('/updateSkills').post(authMiddleware, updateSkillsForResume)
resumeRouter.route('/updateAchievements').post(authMiddleware, updateAchievementsForResume)
resumeRouter.route('/updatePor').post(authMiddleware, updatePorForResume)
resumeRouter.route('/updatePublications').post(authMiddleware, updatePublicationsForResume)
    
export default updateRouter
