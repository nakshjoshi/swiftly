// Adds the authenticated user's id to every Express request. It's only set by authMiddleware, so it stays
// optional: handlers on protected routes can rely on it, handlers on public routes must not.
declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export {}
