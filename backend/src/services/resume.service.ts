import fs from 'node:fs'
import * as pdfParse from "pdf-parse";

export class ResumeService{


    public async parsePDF(resumePath:string){
        const bufferFile = await fs.promises.readFile(resumePath)
        const data = await pdfParse(bufferFile)
        return data.text
    }

    public async parseDocx(resumePath:string){

    }

    public async parseTex(resumePath:string){

    }


    /// write prisme.create services for all tables separately to be called in conroller or somewhere else 




}