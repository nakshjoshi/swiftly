import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.utils';

// Express recognises an error handler only by its 4-arg signature — keep `next` even though it's unused.
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        statusCode: 404,
        data: null,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        success: false,
        errors: [],
    })
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Response already started streaming — hand over to Express so it closes the connection.
    if (res.headersSent) {
        return next(err)
    }

    let statusCode = 500
    let message = "Internal Server Error"
    let errors: any[] = []

    if (err instanceof ApiError) {
        statusCode = err.statusCode
        message = err.message
        errors = err.errors
    } else {
        // Errors from body-parser (bad JSON, payload too large) and multer carry a 4xx status.
        const status = err?.status ?? err?.statusCode
        if (Number.isInteger(status) && status >= 400 && status < 500) {
            statusCode = status
            message = err.type === 'entity.parse.failed' ? "Invalid JSON body" : (err.message || message)
        } else if (err?.name === 'MulterError') {
            statusCode = 400
            message = err.message
        } else if (err?.code === 'P2025') {
            // Prisma: record to update/delete not found (or not owned by the caller — deliberately indistinguishable).
            statusCode = 404
            message = "Record not found"
        } else if (err?.code === 'P2002') {
            statusCode = 409
            message = "Record already exists"
        } else if (err?.name === 'PrismaClientValidationError') {
            statusCode = 400
            message = "Invalid request data"
        }
    }

    // Log full detail server-side; never send stack traces or internal messages for 5xx to the client.
    if (statusCode >= 500) {
        console.error(`[${req.method} ${req.originalUrl}]`, err)
    }

    res.status(statusCode).json({
        statusCode,
        data: null,
        message,
        success: false,
        errors,
    })
}
