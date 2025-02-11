import app from  "./app.js"
import dotenv from "dotenv"
import { connectMongo } from "./config/database.js"
import cloudinary from "cloudinary"
//unhandled  Exceptions
process.on("uncaughtException",((err)=>{
    console.log(`error ${err.message}`);
    console.log(`shutting down the server due to unhandeled Exception`)
   process.exit(1)
}))
const PORT=process.env.PORT 
dotenv.config({path:"./config/.env"})
connectMongo()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const serverconnect=app.listen(process.env.PORT,()=>{
    console.log(`running in http://192.168.1.10:${process.env.PORT}`)
})

//unhandled promises rejection 
process.on("unhandledRejection",(err)=>{
 console.log(`error:${err.message}`);
 console.log(`shutting down the server due to unhandeled rejection`)

serverconnect.close(()=>{
    process.exit(1)
})
})