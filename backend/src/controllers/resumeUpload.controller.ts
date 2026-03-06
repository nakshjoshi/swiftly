import { fileTypeFromFile } from "file-type";
import { ResumeService } from "../services/resume.service";
import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import type { Request, Response } from "express";
import path from "path";


const serviceResume = new ResumeService()

export const uploadAndParseResume = asyncHandler( async( req: Request, res:Response)=>{

    const resume = req.file

    if(!resume){
        throw new ApiError(400, "Upload Resume File Failed")
    }

    const resumePath = resume.path
    const type = await fileTypeFromFile(resumePath);
    const resumeFileType =  type?.ext
    const ext = path.extname(resume.originalname).toLowerCase()

    if(resumeFileType === "pdf" || ext === ".pdf"){
        const text = await serviceResume.parsePDF(resumePath)
        res.send(text)


    }
    else if(resumeFileType === 'docx' || ext === ".docx"){
        const text = await serviceResume.parseDocx(resumePath)
        res.send(text)
        

    }
    else if(ext === ".tex" || resumeFileType === "tex"){
        const text = await serviceResume.parseTex(resumePath)
        res.send(text)

    }
    else{
        throw new ApiError(400, "Unsupported File Format")
    }

}
    

)