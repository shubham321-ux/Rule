import multer from 'multer';
import path from 'path';

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the directory exists
    cb(null, 'uploads/avatars'); // Folder for avatar images
  },
  filename: (req, file, cb) => {
    // Define a unique filename for each uploaded file
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Create multer instance with storage config
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed!'));
    }
  }
});

export default upload;
