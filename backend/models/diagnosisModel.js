import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    
    // Thông tin chẩn đoán
    symptoms: [String],
    diagnosis: { type: String, required: true },
    treatments: [String],
    notes: String,
    
    // Thông tin thuốc
    medications: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    
    // Tổng chi phí
    totalAmount: { type: Number, required: true },
    
    // Trạng thái thanh toán
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    
    // Thời gian
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const diagnosisModel = mongoose.models.diagnosis || mongoose.model('diagnosis', diagnosisSchema);

export default diagnosisModel; 