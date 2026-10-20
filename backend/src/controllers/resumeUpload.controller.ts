import { fileTypeFromFile } from "file-type";
import { ResumeService } from "../services/resume.service";
import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { Response } from "express";
import path from "path";
import { AiService } from "../services/ai.service";
import type { AuthRequest } from "../types/auth.types";
import fs from "fs";
import { validate } from "../utils/validate.utils";
import { resumeInputSchema } from "../validators/resume.validator";




const serviceResume = new ResumeService()
const AI = new AiService()

// ─── Create Resume (from form — no file upload, no AI) ────────────────────────
export const createResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId

    if (!userId) {
        throw new ApiError(401, "Unauthorized")
    }

    const data = validate(resumeInputSchema, req.body)
    const result = await serviceResume.createResumeForUser(userId, data)

    res.status(201).json({
        statusCode: 201,
        data: result,
        message: "Resume created successfully",
        success: true,
    })
})

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



    // LLM output is untrusted input too: same schema as the manual form
    let parsed: unknown
    try {
        parsed = JSON.parse(jsonResumeForPrisma)
    } catch {
        throw new ApiError(502, "Resume parser returned invalid data, please try again")
    }
    const data = validate(resumeInputSchema, parsed, 422, "Could not extract a valid resume from this file")

    const log = await serviceResume.createResumeForUser(userId, data)
    

    await fs.promises.unlink(resumePath)

    res.send(log)


 
}
    

)