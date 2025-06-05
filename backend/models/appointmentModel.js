import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },

    // ✅ Trạng thái thanh toán
    paymentStatus: {
        type: String,
        enum: ['none', 'pending', 'confirmed'],
        default: 'none'
    },

    // Trạng thái cuộc hẹn
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    
    // Thông tin chẩn đoán
    diagnosisId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'diagnosis',
        default: null 
    },
    
    // Ghi chú
    notes: String,
    
    // Thời gian
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// ✅ Tạo model và export mặc định (default)
const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;
