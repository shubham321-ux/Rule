import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import productrouter from './routes/productRoute.js';
import userrouter from './routes/uerRoute.js';
import orderrouter from './routes/orderRoute.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import paymentRouter from './routes/paymentRoute.js';
import VerifyEmailrouter from './routes/verifyemailRoute.js';
import dotenv from 'dotenv'; 
import categoryrouter from './routes/categoryRoute.js';
import favoriteRouter from './routes/fevoritebooksRoute.js';

// ES Module fix for __dirname
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
dotenv.config({path:"./config/.env"});
const app = express();

// Enable CORS with specific options
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000/",  // Allow your frontend
    credentials: true,  // Allow credentials (cookies, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Allowed headers
}));

// Handling OPTIONS requests explicitly if needed
app.options('*', cors());  // Allow preflight OPTIONS requests


// Create uploads directory using the correct path
const uploadDir = path.join(currentDirPath, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files with correct path
app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

// Routes
app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);
app.use("/api/v1",paymentRouter)
app.use("/api/v1",VerifyEmailrouter)
app.use("/api/v1",categoryrouter)
app.use("/api/v1",favoriteRouter)
app.get("/", (req, res) => {
    res.send("hello");
});

export default app;
