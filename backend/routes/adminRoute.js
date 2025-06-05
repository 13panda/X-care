import express from 'express';
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, confirmPayment, approveWorkingSchedule, getDoctorDetails, deleteDoctor, getAllUsers, getUserDetails, updateUser, deleteUser, updateDoctor, getDiagnosedRecords, getDiagnosisByAppointment } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// POST
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.post('/confirm-payment', authAdmin, confirmPayment)
adminRouter.post('/approve-schedule', authAdmin, approveWorkingSchedule)
adminRouter.post('/doctor-list/:id', authAdmin, upload.single('image'), updateDoctor);

// GET
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.get('/doctor-list/:id', authAdmin, getDoctorDetails);

adminRouter.get('/users', authAdmin, getAllUsers);
adminRouter.get('/users/:id', authAdmin, getUserDetails);
adminRouter.put('/users/:id', authAdmin, updateUser)

adminRouter.get('/diagnosed-records', authAdmin, getDiagnosedRecords)
adminRouter.get('/get-diagnosis/:appointmentId', authAdmin, getDiagnosisByAppointment)



// DELETE
adminRouter.delete('/doctor-list/:id', authAdmin, deleteDoctor);
adminRouter.delete('/users/:id', authAdmin, deleteUser);




export default adminRouter;