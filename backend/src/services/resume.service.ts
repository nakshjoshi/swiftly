import prisma from "../config/prisma";
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'
import type { ResumeInput } from '../validators/resume.validator';


export class ResumeService{ 



    // `data` must already be validated by resumeInputSchema: only whitelisted fields reach Prisma.
    public async createResumeForUser(userId:string, data:ResumeInput){
        const { education, experience, projects, skills, achievements, pors, publications, ...resumeFields } = data

        const result = await prisma.resume.create({
            data:{
                ...resumeFields,
                userId: userId,
                title: resumeFields.title || "Resume 1",

                education: education.length ? { create: education } : undefined,
                experience: experience.length ? { create: experience } : undefined,
                projects: projects.length ? { create: projects } : undefined,
                skills: skills.length ? { create: skills } : undefined,
                achievements: achievements.length ? { create: achievements } : undefined,
                pors: pors.length ? { create: pors } : undefined,
                publications: publications.length ? { create: publications } : undefined,
            }
        })
        return result
    }

    public async parsePDF(file:Buffer){
        const parser = new PDFParse({data: file})
        const resumeText = (await parser.getText()).text
        const resumeLinks = (await parser.getInfo({ parsePageInfo: true })).pages[0]?.links
        await parser.destroy()


        return `${resumeText} and ${JSON.stringify(resumeLinks)}`


        // return `${typeof(resumeText) } and ${typeof(resumeLinks)}`
        // return resumeText.text
        // return "Hi PDF"
        // return resumeInfo.pages[0]?.links


    }

    public async parseDocx(file:Buffer){

        const resumeText = await mammoth.convertToHtml({buffer: file})



        return resumeText.value

    }


    public cleanLatex(text: string) {

        const start = text.indexOf("\\begin{document}")
        if (start !== -1) {
            text = text.slice(start)
        }

        return text
            .replace(/\\href\{(.*?)\}\{(.*?)\}/g, "$2: $1")
            .replace(/\\section\{(.*?)\}/g, "\n$1\n")
            .replace(/\\textbf\{(.*?)\}/g, "$1")
            .replace(/\\emph\{(.*?)\}/g, "$1")
}

    public async parseTex(file:Buffer){
        return this.cleanLatex(file.toString("utf-8"))
    }


    public async fetchResumeForUser(userId:string){

    
        const result = await prisma.resume.findMany({
            where:{
                userId: userId
            }
        }
        )

        return result

    }

    public async fetchOneFullResumeForUser(userId:string, resumeId:string){

    
        const result = await prisma.resume.findMany({
            where:{
                userId: userId,
                id: resumeId
            },
            include:{
                education: true,
                experience: true,
                projects: true,
                skills: true,
                achievements: true,
                pors: true,
                publications: true
            }
        }
        )

        return result

    }
    

    public async deleteResumeForUser(userId:string, resumeId:string){

    
        const result = await prisma.resume.delete({
            where:{
                userId: userId,
                id: resumeId
            }
        }
        )

        return result

    }

    




}