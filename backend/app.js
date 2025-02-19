import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

// Route imports
import productrouter from './routes/productRoute.js';
import userrouter from './routes/uerRoute.js';
import orderrouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import VerifyEmailrouter from './routes/verifyemailRoute.js';
import categoryrouter from './routes/categoryRoute.js';
import favoriteRouter from './routes/fevoritebooksRoute.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Load environment variables
dotenv.config({ path: "./config/.env" });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// CORS Configuration
app.use(cors({
    origin: ["https://bokifa.netlify.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie']
}));

app.options('*', cors());

// Headers middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(currentDirPath, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File cleanup utility
const cleanupFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
    });
};

// Middleware setup
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

// File upload error handler
const handleUploadError = (err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'File size too large. Maximum size is 10MB'
        });
    }
    next(err);
};

app.use(handleUploadError);

// API Routes
app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", VerifyEmailrouter);
app.use("/api/v1", categoryrouter);
app.use("/api/v1", favoriteRouter);

// Health check route
app.get("/", (req, res) => {
    res.send("Server is running successfully");
});


// Global error handler
app.use((err, req, res, next) => {
    console.error("Error occurred:", err);
    
    // Cleanup any uploaded files in case of error
    if (req.files) {
        Object.values(req.files).flat().forEach(file => {
            if (file.path) cleanupFile(file.path);
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Server setup
const PORT =  10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`File upload size limit: ${process.env.MAX_FILE_SIZE || '50mb'}`);
    console.log(`Upload directory: ${uploadDir}`);
});

export default app;
