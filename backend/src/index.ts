import express from 'express'

const port = process.env.PORT || 3001


const app = express()

app.get('/', (req,res)=>{
    res.send('Hello HTTP')
})

app.listen(port, ()=>{
    console.log(`App running on http://localhost:${port}`)
})



// console.log(accessTokenSecret, refreshTokenSecret)