import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './config/db.js'
import authRoutes from './routes/authRoute.js'
//cors-> Cross Origin Resource Sharing middleware is used in web applications to enable cross-origin HTTP requests.
import cors from 'cors'
import categoryRoutes from './routes/categoryRoute.js'
import productRoutes from './routes/productRoute.js'
import path from 'path'
// import {fileURLToPath} from 'url'


//config env
dotenv.config()

//database connect
ConnectDB();

// const __filename=fileURLToPath(import.meta.url)
// const __dirname=path.dirname(__filename)

const app=express();

app.use(express.json())
// app.use(express.static(path.join(__dirname,'./client/build')))

//middleware for handling routes
app.use(cors())

//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)

// app.use('*',function(req,res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })
app.get("/", (req, res) => {
    res.send("<h1>Welcome to ecommerce app</h1>");
  });
const PORT=process.env.PORT || 9950;
app.listen(PORT,()=>{
    // console.log(`Server started on ${process.env.DEV_MODE} on ${PORT}`)
})