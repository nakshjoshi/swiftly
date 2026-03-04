import express from 'express'
import { generateOtp } from './utils/otp.utils'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes'


const port = process.env.PORT || 3001


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/auth', authRouter)

app.get('/health', (req,res)=>{
    res.send('Hello...I am under the water, here too much cold.......')
})

app.listen(port, ()=>{
    console.log(`App running on http://localhost:${port}`)
})

// console.log(generateOtp())

// console.log(accessTokenSecret, refreshTokenSecret)