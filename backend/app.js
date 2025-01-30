import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import productrouter from './routes/productRoute.js';
import userrouter from './routes/uerRoute.js';
import orderrouter from './routes/orderRoute.js';

const app = express();

// Define the CORS options dynamically based on the environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-frontend-url.com' 
    : 'http://localhost:3001',  // Default to localhost in development
  credentials: true,  // Allow cookies/credentials to be sent
};

// Use CORS with the specified dynamic options
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Use the routes
app.use("/api/v1", productrouter);
app.use("/api/v1", userrouter);
app.use("/api/v1", orderrouter);

// Simple route for testing
app.get("/", (req, res) => {
  res.send("hello");
});

export default app;
