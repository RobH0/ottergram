const multer = require('multer');
const fs = require('fs');


function checkCorrectFileType(filePath){
    const buffer = Buffer.alloc(8); // Read the first 8 bytes
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0); // Read bytes into the buffer
    fs.closeSync(fd);
    console.log(buffer.toString('hex'));
    if (buffer.slice(0, 4).toString('hex') != '89504e47' || buffer.slice(0, 2).toString('hex') != 'ffd8' || buffer.slice(0, 4).toString('hex') != '47494638') {
        return false
    } else{
        return true;
    }
}

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