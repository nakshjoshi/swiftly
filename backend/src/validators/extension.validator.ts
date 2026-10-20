import { z } from "zod"

// Form fields scraped by the extension. Everything is capped so a page with huge labels or thousands of
// inputs can't turn one autofill call into an enormous (and expensive) LLM prompt.
const MAX_FIELDS = 300

const str = (max: number) => z.string().max(max).nullish()

const htmlFieldSchema = z.object({
    key: z.string().min(1).max(300),
    id: str(300),
    name: str(300),
    type: str(50),
    tagName: z.string().max(30),
    placeholder: str(500),
    inputMode: str(50),
    label: str(500),
    value: str(1000),
    meta: z.object({
        parentId: str(300),
        parentText: str(1000),
        siblingIds: str(1000),
        siblingTexts: str(2000),
        uncleIds: str(1000),
        uncleTexts: str(2000),
        sectionHeading: str(500),
        dataset: z.record(z.string().max(100), z.string().max(500)).nullish(),
    }).partial().nullish(),
})

export const autofillRequestSchema = z.object({
    // The resume is loaded server-side for the signed-in user; the client only says which one
    resumeId: z.uuid(),
    htmlObjectData: z.array(htmlFieldSchema).min(1).max(MAX_FIELDS),
})
