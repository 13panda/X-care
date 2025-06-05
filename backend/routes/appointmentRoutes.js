import express from 'express';
import {
    createAppointment,
    confirmAppointment,
    cancelAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    getPendingAppointments
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Tạo cuộc hẹn mới
router.post('/', authMiddleware, createAppointment);

// Xác nhận cuộc hẹn (Admin)
router.patch('/:appointmentId/confirm', authMiddleware, adminMiddleware, confirmAppointment);

// Hủy cuộc hẹn
router.patch('/:appointmentId/cancel', authMiddleware, cancelAppointment);

// Lấy danh sách cuộc hẹn của bác sĩ
router.get('/doctor/:doctorId', authMiddleware, getDoctorAppointments);

// Lấy danh sách cuộc hẹn của bệnh nhân
router.get('/patient/:patientId', authMiddleware, getPatientAppointments);

// Lấy danh sách cuộc hẹn đang chờ xác nhận (Admin)
router.get('/pending', authMiddleware, adminMiddleware, getPendingAppointments);

export default router; 