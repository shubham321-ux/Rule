import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /mnt/data for persistent storage in Render
        const uploadPath = path.join('/mnt/data', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to allow only images and PDF files
const fileFilter = (req, file, cb) => {
    // Allow images for avatar field
    if (file.fieldname === 'avatar') {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed for avatar'));
    } 
    // Allow PDF for product documentation
    else if (file.fieldname === 'productPDF') {
        if (file.mimetype === 'application/pdf') {
            return cb(null, true);
        }
        cb(new Error('Only PDF files are allowed for product documentation'));
    }
    else {
        cb(null, true); // For other types, accept the file
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default upload;
