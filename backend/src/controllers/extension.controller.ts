import { ExtensionAiService } from "../services/extension.ai.service";
import { requireUserId } from "../middlewares/auth.middleware";
import { ResumeService } from "../services/resume.service";
import type { AuthRequest } from "../types/auth.types";
import type { HTMLObjectAttributes } from "../types/htmlObjectAttributes.types";
import { ApiError } from "../utils/apiError.utils";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { validate } from "../utils/validate.utils";
import { autofillRequestSchema } from "../validators/extension.validator";

const extensionAiService = new ExtensionAiService()
const resumeService = new ResumeService()

export const getObjectForAutofill = asyncHandler(async (req: AuthRequest, res) => {
    const { resumeId, htmlObjectData } = validate(autofillRequestSchema, req.body)

    // Only the caller's own resume ever reaches the LLM. Taking resume data from the request body would make
    // this endpoint a general-purpose proxy to our Gemini key.
    const [resume] = await resumeService.fetchOneFullResumeForUser(requireUserId(req), resumeId)
    if (!resume) {
        throw new ApiError(404, "Resume not found")
    }

    let aiResultText: string
    try {
        aiResultText = await extensionAiService.googleGemini(
            stripInternalFields(resume),
            htmlObjectData as HTMLObjectAttributes[]
        )
    } catch (error) {
        // Upstream outage/overload (Gemini returns 503 "high demand" fairly often): tell the client to retry
        console.warn("[autofill] Gemini request failed:", (error as Error).message)
        throw new ApiError(503, "Autofill service is busy, please try again in a moment")
    }

    let aiResult: unknown
    try {
        aiResult = JSON.parse(aiResultText)
    } catch {
        throw new ApiError(502, "Autofill service returned an invalid response, please try again")
    }
    if (!aiResult || typeof aiResult !== "object" || Array.isArray(aiResult)) {
        throw new ApiError(502, "Autofill service returned an invalid response, please try again")
    }

    res.json({ aiResult })
})

// Drop DB bookkeeping (ids, foreign keys, timestamps) before the resume goes into the prompt:
// it means nothing to the model and only costs tokens.
const INTERNAL_KEYS = new Set(["id", "userId", "resumeId", "createdAt", "updatedAt"])

function stripInternalFields(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(stripInternalFields)
    if (value instanceof Date) return value
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([key]) => !INTERNAL_KEYS.has(key))
                .map(([key, v]) => [key, stripInternalFields(v)])
        )
    }
    return value
}
