import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
// Initialize Cloudinary with direct configuration
// const cloudname=process.env.CLOUDINARY_NAME
const cloudinaryConfig = {
    cloud_name: "dtfb7vu1f",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Set the configuration globally
cloudinary.config(cloudinaryConfig);

// Export both the configured instance and the configuration
export { cloudinary as default, cloudinaryConfig };
