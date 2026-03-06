import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";


const groq = new Groq({apiKey:process.env.GROQ_API_KEY})
const gemini = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

export class AiService{


    public async groq(resumeData:string){


        const prompt:string = `
        You are a resume parsing system.

Your task is to extract structured information from resume text and return it as a valid JSON object. The JSON will be inserted directly into a Prisma database, so the structure must match the schema exactly.

Return ONLY the JSON object. Do not include explanations, comments, markdown, or any additional text.

OBJECTIVE

Convert the provided resume text into structured JSON following the exact schema below.

IMPORTANT RULES

1. Output must be valid JSON.
2. Return ONLY JSON.
3. Do not include markdown or code block formatting.
4. If a value does not exist in the resume, return null.
5. If a section contains multiple entries, return an array.
6. If a section does not exist in the resume, return an empty array [].
7. Do NOT invent information.
8. Do NOT guess missing values.
9. Do NOT hallucinate any information.
10. Whenever you extract text into the JSON fields, use the exact words from the resume. Do not rewrite, paraphrase, add, or remove words. The extracted text should be a direct copy of the resume content.
11. Preserve URLs exactly as written.
12. Do not duplicate the same URL across unrelated fields.
13. Dates must use YYYY-MM-DD format when possible.
14. If only month and year exist, use the first day of that month.
15. If a date cannot be determined, return null.
16. If a full name exists, split it into firstName, middleName, lastName.
17. If only two names exist, set middleName to null.
18. Identify links correctly (GitHub, LinkedIn, portfolio, coding profiles, project links).
19. GitHub repository links belong in project.githubLink.
20. Live demo or deployed project links belong in project.liveLink.
21. Skills must be extracted individually.
22. If a skill category cannot be determined, set category to null.
23. Field names must match the schema exactly.

JSON STRUCTURE

{
  "title": string | null,
  "firstName": string | null,
  "middleName": string | null,
  "lastName": string | null,
  "country": string | null,
  "phoneNumber": string | null,
  "resumeEmail": string | null,
  "linkedIn": string | null,
  "github": string | null,
  "personalPortfolio": string | null,
  "leetCode": string | null,
  "codingProfile2": string | null,
  "codingProfile3": string | null,

  "summary": string | null,

  "education": [
    {
      "instituteName": string | null,
      "level": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "location": string | null,
      "degree": string | null,
      "branch": string | null
    }
  ],

  "experience": [
    {
      "companyName": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "position": string | null,
      "description": string | null,
      "proofLink": string | null
    }
  ],

  "projects": [
    {
      "projectName": string | null,
      "description": string | null,
      "githubLink": string | null,
      "liveLink": string | null,
      "startDate": string | null,
      "endDate": string | null
    }
  ],

  "skills": [
    {
      "name": string | null,
      "category": string | null
    }
  ],

  "achievements": [
    {
      "title": string | null,
      "org": string | null,
      "date": string | null,
      "description": string | null
    }
  ],

  "pors": [
    {
      "title": string | null,
      "org": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "description": string | null
    }
  ],

  "publications": [
    {
      "authors": string | null,
      "title": string | null,
      "conference": string | null,
      "place": string | null,
      "publicationDate": string | null,
      "description": string | null
    }
  ]
}

Follow all rules strictly.

RESUME TEXT: ${resumeData}
        
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
        You are a resume parsing system.

Your task is to extract structured information from resume text and return it as a valid JSON object. The JSON will be inserted directly into a Prisma database, so the structure must match the schema exactly.

Return ONLY the JSON object. Do not include explanations, comments, markdown, or any additional text.

OBJECTIVE

Convert the provided resume text into structured JSON following the exact schema below.

IMPORTANT RULES

1. Output must be valid JSON.
2. Return ONLY JSON.
3. Do not include markdown or code block formatting.
4. If a value does not exist in the resume, return null.
5. If a section contains multiple entries, return an array.
6. If a section does not exist in the resume, return an empty array [].
7. Do NOT invent information.
8. Do NOT guess missing values.
9. Do NOT hallucinate any information.
10. Whenever you extract text into the JSON fields, use the exact words from the resume. Do not rewrite, paraphrase, add, or remove words. The extracted text should be a direct copy of the resume content.
11. Preserve URLs exactly as written.
12. Do not duplicate the same URL across unrelated fields.
13. Dates must use YYYY-MM-DD format when possible.
14. If only month and year exist, use the first day of that month.
15. If a date cannot be determined, return null.
16. If a full name exists, split it into firstName, middleName, lastName.
17. If only two names exist, set middleName to null.
18. Identify links correctly (GitHub, LinkedIn, portfolio, coding profiles, project links).
19. GitHub repository links belong in project.githubLink.
20. Live demo or deployed project links belong in project.liveLink.
21. Skills must be extracted individually.
22. If a skill category cannot be determined, set category to null.
23. Field names must match the schema exactly.

JSON STRUCTURE

{
  "title": string | null,
  "firstName": string | null,
  "middleName": string | null,
  "lastName": string | null,
  "country": string | null,
  "phoneNumber": string | null,
  "resumeEmail": string | null,
  "linkedIn": string | null,
  "github": string | null,
  "personalPortfolio": string | null,
  "leetCode": string | null,
  "codingProfile2": string | null,
  "codingProfile3": string | null,

  "summary": string | null,

  "education": [
    {
      "instituteName": string | null,
      "level": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "location": string | null,
      "degree": string | null,
      "branch": string | null
    }
  ],

  "experience": [
    {
      "companyName": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "position": string | null,
      "description": string | null,
      "proofLink": string | null
    }
  ],

  "projects": [
    {
      "projectName": string | null,
      "description": string | null,
      "githubLink": string | null,
      "liveLink": string | null,
      "startDate": string | null,
      "endDate": string | null
    }
  ],

  "skills": [
    {
      "name": string | null,
      "category": string | null
    }
  ],

  "achievements": [
    {
      "title": string | null,
      "org": string | null,
      "date": string | null,
      "description": string | null
    }
  ],

  "pors": [
    {
      "title": string | null,
      "org": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "description": string | null
    }
  ],

  "publications": [
    {
      "authors": string | null,
      "title": string | null,
      "conference": string | null,
      "place": string | null,
      "publicationDate": string | null,
      "description": string | null
    }
  ]
}

Follow all rules strictly.

RESUME TEXT: ${resumeData}
        
        `

        const response = await gemini.models.generateContent({
            model:'gemini-3-flash-preview',
            contents: prompt
        })


        return response.text ?? ""
    }
}