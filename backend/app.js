import express from 'express' 
import  productrouter from './routes/productRoute.js'
import userrouter from './routes/uerRoute.js'
import cors from 'cors'
const app=express()
app.use(cors())
app.use(express.json())
app.use("/api/v1", productrouter)
app.use("api/v1",userrouter)
app.get("/",(req,res)=>{
    res.send("hello")
})
export default app