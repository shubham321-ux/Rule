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

// Load environment variables from the .env file
dotenv.config({ path: "./config/.env" });

const app = express();

// CORS Setup to allow requests from frontend domain
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",  // Allow frontend URL from environment variable or default to localhost
    credentials: true,  // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Allowed headers
}));

// Handling preflight OPTIONS requests
app.options('*', cors());  // Allow preflight OPTIONS requests

// Create uploads directory if it doesn't exist
const uploadDir = path.join(currentDirPath, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware setup
app.use(express.json());  // Parse incoming JSON requests
app.use(cookieParser());  // Parse cookies
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded data

// Static file serving for uploads
app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

// Routes
app.use("/api/v1", productrouter);  // Product routes
app.use("/api/v1", userrouter);  // User routes
app.use("/api/v1", orderrouter);  // Order routes
app.use("/api/v1", paymentRouter);  // Payment routes
app.use("/api/v1", VerifyEmailrouter);  // Verify email routes
app.use("/api/v1", categoryrouter);  // Category routes
app.use("/api/v1", favoriteRouter);  // Favorite books routes

// Simple route for testing the server
app.get("/", (req, res) => {
    res.send("hello from the server");
});

// Set up the server to listen on the port
const PORT = process.env.PORT || 10000;  // Use Render's dynamic port or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
