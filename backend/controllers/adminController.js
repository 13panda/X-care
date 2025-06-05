import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import diagnosisModel from "../models/diagnosisModel.js";
import userModel from "../models/userModel.js"

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        console.log('=== Request Body ===');
        console.log(req.body);

        console.log('\n=== File Data ===');
        console.log(req.file);

        const { name, email, password, speciality, degree, experience, about, address } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Kiểm tra định dạng email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Kiểm tra độ mạnh của mật khẩu
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload ảnh lên Cloudinary
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            folder: "doctors",
            resource_type: "image"
        });
        console.log('Image uploaded to Cloudinary:', imageUpload.secure_url);

        const doctorData = {
            name,
            email,
            image: imageUpload.secure_url,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        console.log('Doctor added successfully:', newDoctor);
        res.json({ success: true, message: "Thêm bác sĩ thành công !!!" });

    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, message: error.message });
    }
};


// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Create token with admin data
            const tokenData = {
                email: email,
                isAdmin: true
            }
            const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctor list
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointment list
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e != slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Lịch hẹn đã được hủy' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin pannel
const adminDashboard = async (req, res) => {

    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// controllers/adminController.js
const confirmPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Missing appointmentId" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // ✅ Đồng bộ với frontend: cập nhật paymentStatus
        appointment.paymentStatus = 'confirmed';
        await appointment.save();
        res.json({ success: true, message: "Lịch hẹn đã được xác nhận" });
    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin duyệt lịch làm việc
const approveWorkingSchedule = async (req, res) => {
    try {
        const { doctorId } = req.body;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        if (!doctor.workingScheduleRequest || Object.keys(doctor.workingScheduleRequest).length === 0) {
            return res.status(400).json({ success: false, message: 'No schedule request to approve' });
        }

        // Duyệt lịch làm việc mới
        doctor.workingSchedule = doctor.workingScheduleRequest;
        doctor.workingScheduleRequest = {}; // Xóa yêu cầu sau khi duyệt
        await doctor.save();

        res.json({ success: true, message: 'Schedule approved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get detaildoctor
const getDoctorDetails = async (req, res) => {
    const doctorId = req.params.id;

    try {
        // Tìm bác sĩ theo ID, chọn các trường cần thiết
        const doctor = await doctorModel.findById(doctorId).select('name email speciality fees image degree');

        if (!doctor) {
            // Không tìm thấy bác sĩ trả về 404
            return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
        }

        // Lấy danh sách lịch hẹn liên quan tới bác sĩ, sắp xếp theo ngày
        const appointments = await appointmentModel.find({ docId: doctorId }).sort({ appointmentDate: 1 });

        // Trả dữ liệu về client
        return res.status(200).json({ success: true, doctor, appointments });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin bác sĩ:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Admin: Xóa bác sĩ
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;  // Theo route của bạn là :id, nên dùng id thay vì doctorId

        // Kiểm tra bác sĩ tồn tại
        const doctor = await doctorModel.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
        }

        // Xóa bác sĩ
        await doctorModel.findByIdAndDelete(id);

        // Xóa user liên kết nếu có
        if (doctor.userId) {
            await userModel.findByIdAndDelete(doctor.userId);
        }

        res.status(200).json({ success: true, message: 'Xóa bác sĩ thành công' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa bác sĩ' });
    }
};

// Admin: Cập nhật thông tin bác sĩ
const updateDoctor = async (req, res) => {
    try {
        const docId = req.params.id;

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
            address
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

        res.json({ success: true, doctor: updatedDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API get all user
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách người dùng' });
    }
};

// API to get User detail
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin người dùng' });
    }
};

// API to update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, gender, address } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { name, email, phone, gender, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.json({ success: true, message: 'Cập nhật người dùng thành công', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật người dùng' });
    }
};


// API to delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        await userModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa người dùng' });
    }
};

const getDiagnosedRecords = async (req, res) => {
    try {
        const diagnosedList = await diagnosisModel.find().populate("appointmentId");

        // Chuyển sang danh sách đã hợp nhất thông tin người dùng
        const results = await Promise.all(diagnosedList.map(async (diag) => {
            const appointment = diag.appointmentId;
            const user = await userModel.findById(appointment.userId);

            return {
                _id: appointment._id,
                slotDate: appointment.slotDate,
                slotTime: appointment.slotTime,
                userData: {
                    name: user?.name || "Không rõ",
                    image: user?.image || null,
                    dob: user?.dob || null
                }
            };
        }));

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hồ sơ đã chẩn đoán:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xem chi tiết chẩn đoán

const getDiagnosisByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Thiếu appointmentId" });
        }

        // Tìm bản ghi chẩn đoán theo appointmentId
        const diagnosis = await diagnosisModel.findOne({ appointmentId });

        if (!diagnosis) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chẩn đoán cho cuộc hẹn này" });
        }

        // Trả về kết quả
        return res.status(200).json({ success: true, diagnosis });
    } catch (error) {
        console.error('Lỗi khi lấy chẩn đoán:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard,
    confirmPayment,
    approveWorkingSchedule,
    getDoctorDetails,
    deleteDoctor,
    updateDoctor,
    getAllUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    getDiagnosedRecords,
    getDiagnosisByAppointment
}