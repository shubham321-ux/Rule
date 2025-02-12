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

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

dotenv.config({ path: "./config/.env" });

const app = express();

app.use(cors({
    origin: [
        "https://elaborate-cendol-c279fb.netlify.app",  // Add your production frontend URL
        "http://localhost:3000"  // Keep local development URL if needed
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));


app.options('*', cors());

const uploadDir = path.join(currentDirPath, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", VerifyEmailrouter);
app.use("/api/v1", categoryrouter);
app.use("/api/v1", favoriteRouter);

app.get("/", (req, res) => {
    res.send("hello from the server");
});

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
