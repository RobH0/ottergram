multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        //to implement
        // if file ext doesn't equal jpg png gif jpeg.
        // cb(null, false);
        
        cb(null, true);
    }
})