import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";


const groq = new Groq({apiKey:process.env.GROQ_API_KEY})
const gemini = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

export class AiService{


    public async groq(resumeData:string){


        const prompt:string = `
        
        ${resumeData}
        
        `


        const completion = await groq.chat.completions.create({
            model:'compound-beta-mini',
            temperature:0,
            messages:[
                {
                    role:'user',
                    content: prompt
                }
            ]
        })


        return completion.choices[0]?.message.content ?? ""

        
    }



    public async googleGemini(resumeData:string){
        const prompt:string = `
        
        ${resumeData}
        
        `

        const response = await gemini.models.generateContent({
            model:'gemini-3-flash-preview',
            contents: prompt
        })


        return response.text ?? ""
    }
}