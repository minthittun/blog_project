// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configure the storage destination and filename
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.originalname.split('.')[0];
    cb(null, `${filename}-${uniqueSuffix}${fileExtension}`);
  }
});

// Create the upload middleware
const upload = multer({ storage });

module.exports = upload;