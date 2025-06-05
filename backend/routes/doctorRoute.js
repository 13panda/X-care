import express from 'express'
import { 
    doctorList, 
    loginDoctor, 
    appointmentsDoctor, 
    getDoctorProfile, 
    updateDoctorProfile, 
    cancelAppointment,
    requestWorkingSchedule,
    createDiagnosis,
    getDiagnosisByAppointment,
    checkDiagnosis,
    updatePaymentStatus,
    getConfirmedAppointmentsByDoctor,
    updateDiagnosis,
    deleteDiagnosis
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

doctorRouter.get('/medical-records', authDoctor, getConfirmedAppointmentsByDoctor)

doctorRouter.post('/create-diagnosis/:id', authDoctor ,createDiagnosis);
doctorRouter.get('/get-diagnosis/:appointmentId', authDoctor, getDiagnosisByAppointment)
doctorRouter.get('/check-diagnosis/:appointmentId', authDoctor, checkDiagnosis)

doctorRouter.post('/update-diagnosis/:diagnosisId', authDoctor, updateDiagnosis)
doctorRouter.delete('/delete-diagnosis/:diagnosisId', authDoctor, deleteDiagnosis)




export default doctorRouter