import { ProfileUpdate } from "../services/updateData.service";
import { requireUserId } from "../middlewares/auth.middleware";
import type { AuthRequest } from "../types/auth.types";
import type { AchievementsTable, EducationTable, ExperienceTable, PorTable, ProjectsTable, PublicationsTable, ResumeTable, SkillsTable } from "../types/db.types";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { Response } from "express";


const profile = new ProfileUpdate()


export const updateResumeForUser = asyncHandler(async (req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {title, firstName, middleName, lastName, country, phoneNumber, resumeEmail, linkedIn, github, personalPortfolio, leetCode, codingProfile2, codingProfile3, summary, dateOfBirth, yearOfGraduation, address }:ResumeTable = req.body

    const resumeId = req.body.id!

    const result = await profile.updateResumeTable(userId, resumeId, {title, firstName, middleName, lastName, country, phoneNumber, resumeEmail, linkedIn, github, personalPortfolio, leetCode, codingProfile2, codingProfile3, summary, dateOfBirth, yearOfGraduation, address})

    return res
        .status(200)
        .json(result)
})


export const updateEducationForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {instituteName, level, startDate, endDate, location, degree, branch, grade}:EducationTable = req.body
    const resumeId = req.body.resumeId!
    const educationId = req.body.educationId!

    const result = await profile.updateEducationTable(userId, resumeId, educationId, {instituteName, level, startDate, endDate, location, degree, branch, grade})

    return res
        .status(200)
        .json(result)

})  



export const updateExperienceForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {companyName, position, startDate, endDate, location, description}:ExperienceTable = req.body
    const resumeId = req.body.resumeId!
    const experienceId = req.body.experienceId!

    const result = await profile.updateExperienceTable(userId, resumeId, experienceId, {companyName, position, startDate, endDate, location, description})

    return res
        .status(200)
        .json(result)

})  


export const updateProjectsForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {projectName, techStack, description, githubLink, liveLink, startDate, endDate}:ProjectsTable = req.body
    const resumeId = req.body.resumeId!
    const projectId = req.body.projectId!

    const result = await profile.updateProjectsTable(userId, resumeId, projectId, {projectName, techStack, description, githubLink, liveLink, startDate, endDate})

    return res
        .status(200)
        .json(result)

})  

export const updateSkillsForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {name, category}:SkillsTable = req.body
    const resumeId = req.body.resumeId!
    const skillId = req.body.skillId!

    const result = await profile.updateSkillsTable(userId, resumeId, skillId, {name, category})

    return res
        .status(200)
        .json(result)

})


export const updateAchievementsForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {title, org, date, description}:AchievementsTable = req.body
    const resumeId = req.body.resumeId!
    const achievementId = req.body.achievementId!

    const result = await profile.updateAchievementsTable(userId, resumeId, achievementId, {title, org, date, description})

    return res
        .status(200)
        .json(result)

})      


export const updatePorForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {title, org, startDate, endDate, description}:PorTable = req.body
    const resumeId = req.body.resumeId!
    const porId = req.body.porId!

    const result = await profile.updatePorTable(userId, resumeId, porId, {title, org, startDate, endDate, description})

    return res
        .status(200)
        .json(result)

})


export const updatePublicationsForResume = asyncHandler(async(req:AuthRequest, res:Response)=>{

    const userId = requireUserId(req)
    const {authors, title, conference, place, publicationDate, description}:PublicationsTable = req.body
    const resumeId = req.body.resumeId!
    const publicationId = req.body.publicationId!

    const result = await profile.updatePublicationsTable(userId, resumeId, publicationId, {authors, title, conference, place, publicationDate, description})

    return res
        .status(200)
        .json(result)

})
