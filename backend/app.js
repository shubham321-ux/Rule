import express from 'express'
import productrouter from './routes/productRoute.js'
import userrouter from './routes/uerRoute.js'
import orderrouter from './routes/orderRoute.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())




app.use("/api/v1", productrouter)
app.use("/api/v1", userrouter)
app.use("/api/v1", orderrouter)
app.get("/", (req, res) => {
    res.send("hello")
})
export default app