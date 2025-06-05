import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    address: { type: Object, required: true },
    date: { type: Date, default: Date.now },
    slots_booked: { type: Object, default: {} },
    workingSchedule: {
        type: Object,
        default: {}
    },
    workingScheduleRequest: {
        type: Object,
        default: {}
    },
    diagnosisTemplates: [{
        name: String,
        description: String,
        symptoms: [String],
        treatments: [String],
        medications: [{
            name: String,
            dosage: String,
            duration: String
        }]
    }]
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;
