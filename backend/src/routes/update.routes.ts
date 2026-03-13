import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { fetchResumeForUser } from "../controllers/profile.controller";
import { updateAchievementsForResume, updateEducationForResume, updateExperienceForResume, updatePorForResume, updateProjectsForResume, updatePublicationsForResume, updateResumeForUser, updateSkillsForResume } from "../controllers/update.controller";



const updateRouter = Router()

updateRouter.route('/updateResume').post(authMiddleware, updateResumeForUser)
updateRouter.route('/updateEducation').post(authMiddleware, updateEducationForResume)
updateRouter.route('/updateExperience').post(authMiddleware, updateExperienceForResume)
updateRouter.route('/updateProjects').post(authMiddleware, updateProjectsForResume)
updateRouter.route('/updateSkills').post(authMiddleware, updateSkillsForResume)
updateRouter.route('/updateAchievements').post(authMiddleware, updateAchievementsForResume)
updateRouter.route('/updatePor').post(authMiddleware, updatePorForResume)
updateRouter.route('/updatePublications').post(authMiddleware, updatePublicationsForResume)
    
export default updateRouter
