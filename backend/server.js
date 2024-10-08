import app from  "./app.js"
import dotenv from "dotenv"
import { connectMongo } from "./config/database.js"

//unhandled  Exceptions
process.on("uncaughtException",((err)=>{
    console.log(`error ${err.message}`);
    console.log(`shutting down the server due to unhandeled Exception`)
   process.exit(1)
}))
const PORT=process.env.PORT 
dotenv.config({path:"./config/.env"})
connectMongo()
const serverconnect=app.listen(process.env.PORT,()=>{
    console.log(`running in http://localhost:${process.env.PORT}`)
})

//unhandled promises rejection 
process.on("unhandledRejection",(err)=>{
 console.log(`error:${err.message}`);
 console.log(`shutting down the server due to unhandeled rejection`)

serverconnect.close(()=>{
    process.exit(1)
})
})