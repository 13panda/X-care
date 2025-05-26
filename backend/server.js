import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

// ✅ Chỉ gọi sau khi kết nối DB thành công
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Test upload form route
app.get('/test-upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-upload.html'))
})

// api endpoint
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
// localhost:4000/api/admin/add-doctor

app.get('/', (req, res) => {
    res.send('Api working')
})

// ✅ Gọi connectDB chỉ một lần
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch(err => {
    console.error("❌ Failed to connect DB:", err)
})
