import express from 'express' 
import  productrouter from './routes/productRoute.js'
import userrouter from './routes/uerRoute.js'
const app=express()
app.use(express.json())
app.use("/api/v1", productrouter)
app.use("api/v1",userrouter)
export default app