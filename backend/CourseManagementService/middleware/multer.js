import multer from 'multer';
import fs from 'fs';

// Define storage for uploaded files
const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/thumbnails/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set unique filename (you can customize this as needed)
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const courseContentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Define the destination folder path
      const folderPath = `uploads/coursecontent/${req.body?.content_id || 'common'}/`;

      // Check if the destination folder exists, if not, create it
      fs.mkdirSync(folderPath, { recursive: true });

      // Call the callback function with the destination folder path
      cb(null, folderPath);
  },
  filename: function (req, file, cb) {
      // Set unique filename (you can customize this as needed)
      cb(null, Date.now() + '-' + file.originalname);
  }
});


// Configure multer
const uploadThumbnail = multer({ storage: thumbnailStorage });
const uploadCourseContent = multer({ storage: courseContentStorage });

export { uploadThumbnail, uploadCourseContent };
