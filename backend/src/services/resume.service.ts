import fs from 'node:fs'
import prisma from "../config/prisma";
import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'


export class ResumeService{ 



    public async pushLlmJsonOfResumeToRespectiveDbTables(userId:string, llmJson:string){

        return (
            `${llmJson}`
        )






    }

    public async parsePDF(resumePath:string){
        const bufferFile = await fs.promises.readFile(resumePath)
        const parser = new PDFParse({data: bufferFile})
        const resumeText = (await parser.getText()).text
        const resumeLinks = (await parser.getInfo({ parsePageInfo: true })).pages[0]?.links
        await parser.destroy()


        return `${resumeText} and ${JSON.stringify(resumeLinks)}`


        // return `${typeof(resumeText) } and ${typeof(resumeLinks)}`
        // return resumeText.text
        // return "Hi PDF"
        // return resumeInfo.pages[0]?.links


    }

    public async parseDocx(resumePath:string){

        // const bufferFile = await fs.promises.readFile(resumePath);
        const resumeText = await mammoth.convertToHtml({path: resumePath})



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

    public async parseTex(resumePath:string){


        


        const text = await fs.promises.readFile(resumePath, "utf-8")
        return this.cleanLatex(text)
    }





}