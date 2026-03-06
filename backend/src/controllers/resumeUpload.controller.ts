import { fileTypeFromFile } from "file-type";
import { ResumeService } from "../services/resume.service";
import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { Request, Response } from "express";
import path from "path";
import { AiService } from "../services/ai.service";
import type { AuthRequest } from "../types/auth.types";




const serviceResume = new ResumeService()
const AI = new AiService()

export const uploadAndParseResume = asyncHandler( async( req: AuthRequest, res:Response)=>{

    const resume = req.file
    const userId = req.userId

    if(!resume){
        throw new ApiError(400, "Upload Resume File Failed")
    }

    const resumePath = resume.path
    const type = await fileTypeFromFile(resumePath);
    const resumeFileType =  type?.ext
    const ext = path.extname(resume.originalname).toLowerCase()


    let resumeText

    if(resumeFileType === "pdf" || ext === ".pdf"){
        resumeText = await serviceResume.parsePDF(resumePath)


    }
    else if(resumeFileType === 'docx' || ext === ".docx"){
        resumeText = await serviceResume.parseDocx(resumePath)        

    }
    else if(ext === ".tex" || resumeFileType === "tex"){
        resumeText = await serviceResume.parseTex(resumePath)
    }
    else{
        throw new ApiError(400, "Unsupported File Format")
    }

    const jsonResumeForPrisma = await AI.googleGemini(resumeText);



    const log = await serviceResume.pushLlmJsonOfResumeToRespectiveDbTables(userId, jsonResumeForPrisma)

    const jsonLog = JSON.parse(log)
    res.send(jsonLog)


 
}
    

)