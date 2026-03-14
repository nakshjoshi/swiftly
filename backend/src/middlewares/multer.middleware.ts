import multer from "multer"
import fs from "fs"


const uploadPath = "./src/resume-uploads"


const storage = multer.diskStorage({

    destination: function(req, file, cb){

        fs.mkdirSync(uploadPath, { recursive: true })
        return cb(null, uploadPath)
    },
    filename: function(req, file, cb){
        const uniqueName = Date.now() + "-"+ file.originalname
        return cb(null, uniqueName)

    }
})

const upload = multer({storage})

export {upload}