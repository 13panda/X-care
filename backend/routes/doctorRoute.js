import express from 'express'
import { 
    doctorList, 
    loginDoctor, 
    appointmentsDoctor, 
    getDoctorProfile, 
    updateDoctorProfile, 
    cancelAppointment,
    requestWorkingSchedule,
} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'

const doctorRouter = express.Router()

// Routes cho bác sĩ
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.get('/profile', authDoctor, getDoctorProfile)
doctorRouter.post('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile)
doctorRouter.post('/cancel-appointment', authDoctor, cancelAppointment)
doctorRouter.post('/schedule-request', authDoctor, requestWorkingSchedule)


export default doctorRouter