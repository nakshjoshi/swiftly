import express from 'express'
import { generateOtp } from './utils/otp.utils'
import cookieParser from 'cookie-parser'



const port = process.env.PORT || 3001


const app = express()

app.use(cookieParser())

app.get('/', (req,res)=>{
    res.send('Hello HTTP')
})

app.listen(port, ()=>{
    console.log(`App running on http://localhost:${port}`)
})

console.log(generateOtp())

// console.log(accessTokenSecret, refreshTokenSecret)