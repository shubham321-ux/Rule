import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// ... other imports remain the same

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: ['http://localhost:3002', 'https://your-frontend-domain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files handling
app.use('/uploads', express.static(path.join(currentDirPath, 'uploads')));

// API routes
app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", VerifyEmailrouter);
app.use("/api/v1", categoryrouter);
app.use("/api/v1", favoriteRouter);

// Health check route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
