import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// Middleware for CORS and other configurations
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Ensure upload directory exists in persistent storage
const uploadDir = path.join('/mnt/data', 'uploads');  // Render persistent storage path
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the /mnt/data/uploads directory
app.use('/uploads', express.static(uploadDir));

// Your routes and other configurations...

app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Starting server
const PORT = 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
