import { env } from './config/env'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { globalLimiter } from './middlewares/rateLimit.middleware'
import authRouter from './routes/auth.routes'
import resumeRouter from './routes/resume.routes'
import cors from "cors"
import updateRouter from './routes/update.routes'
import fetchRouter from './routes/fetch.routes'
import extensionRouter from './routes/extension.route'
import migrateRouter from './routes/migrate.routes'
import passkeyRouter from './routes/passkey.routes'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'


const port = process.env.PORT || 3001


const app = express()

// In production the API sits behind one reverse proxy that terminates TLS. Trusting exactly one hop makes
// req.ip / req.protocol reflect the real client instead of the proxy. Off locally, where nothing is in front.
// Adjust the hop count if you add another layer (e.g. a CDN in front of the proxy).
if (!env.IS_DEV) app.set('trust proxy', 1)

// Security headers. CORP is relaxed to same-site so the web app on swiftly.nakshjoshi.in can still embed
// API responses (e.g. a compiled PDF) served from the api.* subdomain.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }))

app.use(cors({
    origin: env.CORS_ORIGINS,
    // OPTIONS needn't be listed: cors answers preflight requests itself
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(globalLimiter)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(env.COOKIE_SECRET))


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/passkey', passkeyRouter)
app.use('/api/v1/resume', resumeRouter)
app.use('/api/v1/update', updateRouter)
app.use('/api/v1/fetch', fetchRouter)
app.use('/api/v1/extension', extensionRouter)
app.use('/api/v1/migrate', migrateRouter)

app.get('/health', (req,res)=>{
    res.send('Health Check Ok!')
})

// Must be registered after all routes: 404 for unmatched paths, then the central error handler.
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`App running on http://localhost:${port}`)
})


// console.log(accessTokenSecret, refreshTokenSecret)