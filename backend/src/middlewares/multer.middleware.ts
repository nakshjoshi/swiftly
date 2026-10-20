import multer from "multer"
import path from "path"
import { ApiError } from "../utils/apiError.utils"

// Resumes are a few hundred KB; 5MB leaves room for image-heavy PDFs without letting anyone fill memory.
const MAX_RESUME_BYTES = 5 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set([".pdf", ".docx", ".tex"])

// Kept in memory, never written to disk: the parsers only need a buffer, and there's no
// filename to sanitize, no temp file to clean up on error, and nothing piling up in the container.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_RESUME_BYTES,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        // First-pass check on the claimed extension; the controller verifies the real type from the bytes.
        const ext = path.extname(file.originalname).toLowerCase()
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            return cb(new ApiError(400, "Unsupported file format, upload a PDF, DOCX or TEX file"))
        }
        cb(null, true)
    },
})

export { upload }
