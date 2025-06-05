import doctorModel from "../models/doctorModel.js"; // Đảm bảo đường dẫn đúng
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import diagnosisModel from "../models/diagnosisModel.js";
import mongoose from 'mongoose';

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body; // Lấy docId từ request body

        // Tìm bác sĩ theo ID
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Thay đổi trạng thái availability
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        return res.json({ success: true, message: 'Đã sửa đổi trạng thái' });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor Login
const loginDoctor = async (req, res) => {
    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointment for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to get Profile Doctor
// GET /api/doctor/profile

const getDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId;

        const doctor = await doctorModel.findById(docId).select('-password');

        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, doctor });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId;

        const {
            name,
            speciality,
            degree,
            experience,
            about,
            fees,
            email,
            address
        } = req.body;

        const updateData = {
            name,
            speciality,
            degree,
            experience,
            about,
            fees,
            email,
        };

        if (address) {
            try {
                updateData.address = JSON.parse(address);
            } catch (err) {
                return res.status(400).json({ success: false, message: 'Invalid address format' });
            }
        }

        if (req.file) {
            const imageUrl = `${process.env.BASE_URL}/uploads/doctors/${req.file.filename}`;
            updateData.image = imageUrl;
        }

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            docId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -__v');

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, message: 'Doctor profile updated successfully', doctor: updatedDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const cancelAppointment = async (req, res) => {
    try {
        const docId = req.docId;
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Missing appointmentId' });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.docId.toString() !== docId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: not your appointment' });
        }

        if (appointment.cancelled) {
            return res.json({ success: false, message: 'Appointment already cancelled' });
        }

        appointment.cancelled = true;
        await appointment.save();

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const { slotDate, slotTime } = appointment;
        if (doctor.slots_booked?.[slotDate]) {
            doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(time => time !== slotTime);

            // Nếu không còn slot nào trong ngày, xóa key
            if (doctor.slots_booked[slotDate].length === 0) {
                delete doctor.slots_booked[slotDate];
            }

            await doctor.save();
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.log('Error in cancelAppointment:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const requestWorkingSchedule = async (req, res) => {
    try {
        const docId = req.docId;
        const { workingScheduleRequest } = req.body;

        if (!workingScheduleRequest || typeof workingScheduleRequest !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid or missing workingScheduleRequest' });
        }

        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 15); // Giới hạn 15 ngày tới

        const allowedTimes = [
            '08:00', '09:00', '10:00', '11:00',
            '13:00', '14:00', '15:00',
            '16:00', '17:00',
        ];

        // Validate ngày và giờ
        for (const [dateStr, times] of Object.entries(workingScheduleRequest)) {
            const date = new Date(dateStr);

            if (isNaN(date.getTime())) {
                return res.status(400).json({ success: false, message: `Invalid date format: ${dateStr}` });
            }
            if (date < today || date > maxDate) {
                return res.status(400).json({ success: false, message: `Date ${dateStr} is out of allowed range (15 days)` });
            }

            for (const time of times) {
                if (!allowedTimes.includes(time)) {
                    return res.status(400).json({ success: false, message: `Invalid time slot: ${time} on ${dateStr}` });
                }
            }
        }

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        doctor.workingScheduleRequest = workingScheduleRequest;
        await doctor.save();

        res.json({ success: true, message: 'Working schedule request submitted successfully' });
    } catch (error) {
        console.log('Error in requestWorkingSchedule:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo chẩn đoán mới
const createDiagnosis = async (req, res) => {
    try {
        console.log('=== Request Body ===');
        console.log(req.body);

        const { appointmentId, symptoms, diagnosis, treatments, medications, notes } = req.body;

        if (!appointmentId || !symptoms || !diagnosis || !treatments || !medications) {
            return res.json({ success: false, message: "Thiếu thông tin bắt buộc để tạo chẩn đoán" });
        }

        if (!Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ success: false, message: "Danh sách thuốc không hợp lệ" });
        }

        // Kiểm tra từng thuốc có đủ trường bắt buộc
        for (const med of medications) {
            if (!med.dosage || !med.duration) {
                return res.status(400).json({ success: false, message: "Mỗi thuốc phải có 'dosage' và 'duration'" });
            }
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc hẹn' });
        }

        const totalAmount = medications.reduce((sum, med) => sum + (med.price || 0), 0);

        const diagnosisData = {
            appointmentId,
            doctorId: appointment.docId,
            patientId: appointment.userId,
            symptoms,
            diagnosis,
            treatments,
            medications,
            notes: notes || '',
            totalAmount,
            dateCreated: Date.now()
        };

        const newDiagnosis = new diagnosisModel(diagnosisData);
        await newDiagnosis.save();

        appointment.status = 'completed';
        appointment.diagnosisId = newDiagnosis._id;
        await appointment.save();

        console.log('Tạo chẩn đoán thành công:', newDiagnosis);
        res.status(201).json({ success: true, message: "Tạo chẩn đoán thành công", diagnosis: newDiagnosis });
    } catch (error) {
        console.error('Lỗi khi tạo chẩn đoán:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const getDiagnosisByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Thiếu appointmentId" });
        }

        const diagnosis = await diagnosisModel.findOne({ appointmentId });

        if (!diagnosis) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chẩn đoán cho cuộc hẹn này" });
        }

        res.status(200).json({ success: true, diagnosis });
    } catch (error) {
        console.error('Lỗi khi lấy chẩn đoán:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkDiagnosis = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Thiếu appointmentId" });
        }

        const diagnosis = await diagnosisModel.findOne({ appointmentId });

        if (!diagnosis) {
            return res.status(200).json({ success: true, hasDiagnosis: false });
        }

        return res.status(200).json({ success: true, hasDiagnosis: true });
    } catch (error) {
        console.error('Lỗi khi kiểm tra chẩn đoán:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateDiagnosis = async (req, res) => {
    try {
        const { diagnosisId } = req.params;
        const { symptoms, diagnosis, treatments, medications, notes } = req.body;

        if (!diagnosisId) {
            return res.status(400).json({ success: false, message: "Thiếu diagnosisId" });
        }

        if (!symptoms || !diagnosis || !treatments || !Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc để cập nhật chẩn đoán" });
        }

        for (const med of medications) {
            if (!med.dosage || !med.duration) {
                return res.status(400).json({ success: false, message: "Mỗi thuốc phải có 'dosage' và 'duration'" });
            }
        }

        const totalAmount = medications.reduce((sum, med) => sum + (med.price || 0), 0);

        const updated = await diagnosisModel.findByIdAndUpdate(
            diagnosisId,
            {
                symptoms,
                diagnosis,
                treatments,
                medications,
                notes: notes || '',
                totalAmount
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chẩn đoán cần cập nhật" });
        }

        res.status(200).json({ success: true, message: "Cập nhật chẩn đoán thành công", diagnosis: updated });
    } catch (error) {
        console.error('Lỗi khi cập nhật chẩn đoán:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteDiagnosis = async (req, res) => {
    try {
        const { diagnosisId } = req.params;

        if (!diagnosisId) {
            return res.status(400).json({ success: false, message: "Thiếu diagnosisId" });
        }

        const diagnosis = await diagnosisModel.findByIdAndDelete(diagnosisId);

        if (!diagnosis) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chẩn đoán để xoá" });
        }

        // Cập nhật trạng thái cuộc hẹn nếu cần thiết
        await appointmentModel.findByIdAndUpdate(diagnosis.appointmentId, {
            $unset: { diagnosisId: "" },
            status: "pending"  // hoặc trạng thái khác tuỳ theo logic hệ thống
        });

        res.status(200).json({ success: true, message: "Xoá chẩn đoán thành công" });
    } catch (error) {
        console.error('Lỗi khi xoá chẩn đoán:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req, res) => {
    try {
        const { diagnosisId } = req.params;
        const { paymentStatus } = req.body;
        const docId = req.docId;

        const diagnosis = await diagnosisModel.findById(diagnosisId);
        if (!diagnosis) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy chẩn đoán' });
        }

        // Kiểm tra quyền
        if (diagnosis.doctorId.toString() !== docId.toString()) {
            return res.status(403).json({ success: false, message: 'Không có quyền cập nhật trạng thái thanh toán' });
        }

        diagnosis.paymentStatus = paymentStatus;
        await diagnosis.save();

        res.status(200).json({ success: true, diagnosis });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getConfirmedAppointmentsByDoctor = async (req, res) => {
    try {
        const doctorId = req.docId; // ✅ lấy từ middleware

        const confirmedAppointments = await appointmentModel.find({
            docId: doctorId,
            paymentStatus: 'confirmed',
            cancelled: false,
        });

        res.status(200).json({
            success: true,
            data: confirmedAppointments,
        });
    } catch (error) {
        console.error('❌ Lỗi lấy lịch hẹn đã xác nhận:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy lịch hẹn đã xác nhận',
        });
    }
};





export {
    changeAvailability,
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
};
