import { fileTypeFromBuffer } from "file-type";
import { requireUserId } from "../middlewares/auth.middleware";
import { ResumeService } from "../services/resume.service";
import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { Response } from "express";
import path from "path";
import { AiService } from "../services/ai.service";
import type { AuthRequest } from "../types/auth.types";
import { validate } from "../utils/validate.utils";
import { resumeInputSchema } from "../validators/resume.validator";




const serviceResume = new ResumeService()
const AI = new AiService()

// ─── Create Resume (from form — no file upload, no AI) ────────────────────────
export const createResume = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = requireUserId(req)

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
    const userId = requireUserId(req)

    if(!resume){
        throw new ApiError(400, "Upload Resume File Failed")
    }

    // Trust the bytes, not the filename: a renamed .exe must not be handed to the PDF parser.
    // .tex is plain text with no magic bytes, so it's the one type that is detected as "nothing".
    const detected = (await fileTypeFromBuffer(resume.buffer))?.ext
    const ext = path.extname(resume.originalname).toLowerCase()

    let resumeText

    if(ext === ".pdf" && detected === "pdf"){
        resumeText = await serviceResume.parsePDF(resume.buffer)
    }
    else if(ext === ".docx" && detected === "docx"){
        resumeText = await serviceResume.parseDocx(resume.buffer)
    }
    else if(ext === ".tex" && detected === undefined){
        resumeText = await serviceResume.parseTex(resume.buffer)
    }
    else{
        throw new ApiError(400, "File content does not match its extension, upload a PDF, DOCX or TEX file")
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

    res.send(log)


 
}
    

)