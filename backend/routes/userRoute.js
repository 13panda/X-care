import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, deleteAppointment, requestPayment, getPaidAppointments, getDiagnosisByAppointmentForUser } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'


const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/delete-appointment', authUser, deleteAppointment)
userRouter.post('/request-payment', authUser, requestPayment)
userRouter.get('/appointment-history', authUser, getPaidAppointments)


userRouter.get('/get-diagnosis/:appointmentId', authUser, getDiagnosisByAppointmentForUser)

export default userRouter