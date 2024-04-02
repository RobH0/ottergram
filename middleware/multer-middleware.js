const multer = require('multer');
const fs = require('fs');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype);
        if(file.mimetype.includes('image/') == false){
            console.log(`Incorrect file type: ${req.file.path}`);
            cb(null, false);
        } else{
            console.log('correct file type');
            return cb(null, true);
        }        
    }
})