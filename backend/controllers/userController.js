import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import diagnosisModel from '../models/diagnosisModel.js'

// API to register user 
const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        // Trim dữ liệu để tránh user nhập toàn khoảng trắng
        name = name?.trim();
        email = email?.trim().toLowerCase();

        // 1. Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin." });
        }

        // 2. Giới hạn độ dài name và email
        if (name.length > 50) {
            return res.status(400).json({ success: false, message: "Tên không được vượt quá 50 ký tự." });
        }

        if (email.length > 100) {
            return res.status(400).json({ success: false, message: "Email không được vượt quá 100 ký tự." });
        }

        // 3. Kiểm tra tên không chứa ký tự đặc biệt (cho phép dấu tiếng Việt)
        const nameRegex = /^[a-zA-ZÀ-ỹ\s.'-]+$/u;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ success: false, message: "Tên chỉ được chứa chữ cái và khoảng trắng." });
        }

        // 4. Kiểm tra định dạng email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Email không hợp lệ." });
        }

        const allowedDomains = ['.com', '.vn'];
        const emailDomain = email.substring(email.lastIndexOf('.'));
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ success: false, message: "Email phải có đuôi .com hoặc .vn." });
        }

        // 5. Kiểm tra mật khẩu mạnh
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt."
            });
        }

        // 6. Kiểm tra email đã tồn tại chưa
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email đã được sử dụng." });
        }

        // 7. Hash mật khẩu và lưu vào DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        // 8. Tạo token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại." });
        }
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ. Vui lòng thử lại sau." });
    }
};




// API for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to fetch user profile data
const getProfile = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(req.userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url
            await userModel.findByIdAndUpdate(req.userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body
        const userId = req.userId

        const docData = await doctorModel.findById(docId).select('-password')

        if (!slotTime) {
            return res.json({ success: false, message: "Chọn giờ" })
        }

        if (!docData || !docData.available) {
            return res.json({ success: false, message: 'Bác sĩ không có sẵn' })
        }

        let slots_booked = docData.slots_booked || {}

        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.json({ success: false, message: 'Slot not available' })
        }

        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = []
        }
        slots_booked[slotDate].push(slotTime)

        const userData = await userModel.findById(userId).select('-password')

        const docDataForSave = { ...docData.toObject() }
        delete docDataForSave.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataForSave,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Lịch hẹn đã được thêm hãy xác nhận' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user's appointment list
const listAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.userId,
            cancelled: { $ne: true } // bỏ các lịch bị hủy
        })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//  FIXED: API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e != slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized action' })
        }

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        if (!doctorData) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        let slots_booked = doctorData.slots_booked

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate]
            }
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        await appointmentModel.findByIdAndDelete(appointmentId)

        res.json({ success: true, message: 'Đã xóa lịch hẹn' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to send payment request

// controllers/userController.js

const requestPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        if (appointment.userId.toString() !== req.userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        if (appointment.paymentStatus === 'confirmed') {
            return res.json({ success: false, message: 'Payment already confirmed' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { paymentStatus: 'pending' })

        res.json({ success: true, message: 'Payment request sent to admin' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get user's paid appointments
const getPaidAppointments = async (req, res) => {
    try {
        const userId = req.userId

        const appointments = await appointmentModel.find({
            userId,
            paymentStatus: 'confirmed'
        })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Lấy thông tin chẩn đoán
const getDiagnosisByAppointmentForUser = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.userId;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Thiếu appointmentId" });
        }

        // Kiểm tra appointment có thuộc về user này không
        const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });

        if (!appointment) {
            return res.status(403).json({ success: false, message: "Không có quyền truy cập cuộc hẹn này" });
        }

        const diagnosis = await diagnosisModel.findOne({ appointmentId });

        if (!diagnosis) {
            return res.status(404).json({ success: false, message: "Chưa được chẩn đoán" });
        }

        res.status(200).json({ success: true, diagnosis });

    } catch (error) {
        console.error('Lỗi khi lấy chẩn đoán:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    deleteAppointment,
    requestPayment,
    getPaidAppointments,
    getDiagnosisByAppointmentForUser
}
