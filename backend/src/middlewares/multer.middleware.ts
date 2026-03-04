import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./resume-uploads")
    },
    filename: function(req, file, cb){
        const uniqueName = Date.now + "-"+ file.originalname
        return cb(null, uniqueName)

    }
})

const upload = multer({storage})

export {upload}