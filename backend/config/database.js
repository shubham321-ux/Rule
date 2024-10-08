import mongoose from "mongoose";

export const connectMongo=async()=>{
 await mongoose.connect(process.env.DB_URI)
 console.log(`database connected with ${process.env.DB_URI}`)
}