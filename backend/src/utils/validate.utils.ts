import type { z } from "zod"
import { ApiError } from "./apiError.utils"

// Parses `data` against `schema`, returning the cleaned value or throwing an ApiError whose
// `errors` list says exactly which field failed, e.g. { path: "experience.0.type", message: "..." }.
const validate = <T extends z.ZodType>(
    schema: T,
    data: unknown,
    statusCode = 400,
    message = "Invalid request data",
): z.infer<T> => {
    const result = schema.safeParse(data)
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }))
        throw new ApiError(statusCode, message, errors)
    }
    return result.data
}

export { validate }
