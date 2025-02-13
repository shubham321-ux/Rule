import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Route imports
import productrouter from './routes/productRoute.js';
import userrouter from './routes/uerRoute.js';
import orderrouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import VerifyEmailrouter from './routes/verifyemailRoute.js';
import categoryrouter from './routes/categoryRoute.js';
import favoriteRouter from './routes/fevoritebooksRoute.js';

// Path configuration
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Environment configuration
dotenv.config({ path: "./config/.env" });

const app = express();

// CORS Configuration
app.use(cors({
    origin: ["https://bokifa.netlify.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie']
}));

// Pre-flight requests
app.options('*', cors());

// Security Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Upload directory setup
const uploadDir = path.join(currentDirPath, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

// Routes
app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", VerifyEmailrouter);
app.use("/api/v1", categoryrouter);
app.use("/api/v1", favoriteRouter);

// Root route
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

// Server configuration
const PORT = 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
