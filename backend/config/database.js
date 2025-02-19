import mongoose from 'mongoose';

export const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};
