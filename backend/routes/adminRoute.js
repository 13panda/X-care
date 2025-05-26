import express from 'express';
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, confirmPayment, approveWorkingSchedule, getDoctorDetails, deleteDoctor, adminUpdateDoctor } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailablity } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// POST
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/change-availablity', authAdmin, changeAvailablity); 
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.post('/confirm-payment', authAdmin ,confirmPayment)
adminRouter.post('/approve-schedule', authAdmin, approveWorkingSchedule)
adminRouter.put('/doctor-list/:id', authAdmin, adminUpdateDoctor);
// GET
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.get('/doctor-list/:id', authAdmin, getDoctorDetails);

// DELETE
adminRouter.delete('/doctor-list/:id', /*authAdmin*/deleteDoctor);



export default adminRouter;