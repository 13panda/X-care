import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// React Icons
import { MdDelete, MdAddCircleOutline } from 'react-icons/md';
import { FaPills } from 'react-icons/fa';

const specialMedications = [
    { name: "Paracetamol", price: 40000 },
    { name: "Amoxicillin", price: 60000 },
    { name: "Ibuprofen", price: 40000 },
    { name: "Cefuroxime", price: 50000 },
    { name: "Azithromycin", price: 55000 },
    { name: "Metronidazole", price: 70000 },
    { name: "Prednisolone", price: 80000 }
];

const CreateDiagnosis = () => {
    const { appointmentId } = useParams();
    const { dToken, backendUrl } = useDoctorContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosis: '',
        treatments: '',
        medications: [],
        notes: ''
    });

    const totalPrice = formData.medications.reduce((sum, med) => sum + med.price, 0);

    const [selectedMed, setSelectedMed] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddMedication = () => {
        const med = specialMedications.find(m => m.name === selectedMed);
        if (med && !formData.medications.some(m => m.name === med.name)) {
            // Thêm dosage và duration mặc định rỗng
            setFormData(prev => ({
                ...prev,
                medications: [...prev.medications, { ...med, dosage: '', duration: '' }]
            }));
        }
        setSelectedMed('');
    };

    const handleRemoveMedication = (name) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.filter(m => m.name !== name)
        }));
    };

    // Cập nhật dosage hoặc duration của thuốc trong danh sách
    const handleMedicationChange = (index, field, value) => {
        const newMeds = [...formData.medications];
        newMeds[index][field] = value;
        setFormData(prev => ({
            ...prev,
            medications: newMeds
        }));
    };

    const handleSubmit = async () => {
        for (let med of formData.medications) {
            if (!med.dosage || !med.duration) {
                alert(`Thuốc ${med.name} phải có liều dùng và thời gian dùng!`);
                return;
            }
        }

        try {
            const res = await axios.post(`${backendUrl}/api/doctor/create-diagnosis/${appointmentId}`, {
                appointmentId,
                ...formData
            }, {
                headers: { dtoken: dToken }
            });

            if (res.data.success) {
                toast.success("Tạo chẩn đoán thành công!");
                navigate('/medical-records');
            } else {
                alert("Lỗi khi tạo chẩn đoán!");
            }
        } catch (error) {
            console.error("❌ Error:", error.response?.data || error.message);
        }
    };

    return (
        <div className="bg-white px-8 py-8 border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-scroll shadow-md mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Tạo chẩn đoán và đơn thuốc</h2>

            <div className="space-y-4">
                <div>
                    <label className="font-semibold">Triệu chứng:</label>
                    <textarea
                        name="symptoms"
                        rows={3}
                        className="w-full border rounded-xl p-3 mt-1 focus:outline-blue-500"
                        value={formData.symptoms}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="font-semibold">Chẩn đoán:</label>
                    <input
                        name="diagnosis"
                        className="w-full border rounded-xl p-3 mt-1 focus:outline-blue-500"
                        value={formData.diagnosis}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="font-semibold">Phác đồ điều trị:</label>
                    <textarea
                        name="treatments"
                        rows={3}
                        className="w-full border rounded-xl p-3 mt-1 focus:outline-blue-500"
                        value={formData.treatments}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="font-semibold">Ghi chú:</label>
                    <textarea
                        name="notes"
                        rows={2}
                        className="w-full border rounded-xl p-3 mt-1 focus:outline-blue-500"
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="font-semibold block mb-2 flex items-center gap-2 text-lg">
                        <FaPills className="text-blue-500" />
                        Chọn thuốc điều trị
                    </label>
                    <div className="flex space-x-2">
                        <select
                            value={selectedMed}
                            onChange={(e) => setSelectedMed(e.target.value)}
                            className="flex-1 p-3 border rounded-xl bg-gray-50 focus:outline-blue-500"
                        >
                            <option value="">-- Chọn thuốc --</option>
                            {specialMedications.map((med, index) => (
                                <option key={index} value={med.name}>
                                    {med.name} ({med.price.toLocaleString()}đ)
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddMedication}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-1"
                        >
                            <MdAddCircleOutline className="text-xl" />
                            Thêm
                        </button>
                    </div>

                    {formData.medications.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Danh sách thuốc đã chọn:</h4>
                            <ul className="space-y-4">
                                {formData.medications.map((med, index) => (
                                    <li key={index} className="bg-gray-100 rounded-xl px-4 py-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">{med.name}</span>
                                            <button
                                                onClick={() => handleRemoveMedication(med.name)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <MdDelete className="text-xl" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium mb-1">Liều dùng (Dosage):</label>
                                                <input
                                                    type="text"
                                                    value={med.dosage}
                                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                    placeholder="VD: 2 viên mỗi 8 giờ"
                                                    className="w-full border rounded-xl p-2 focus:outline-blue-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium mb-1">Thời gian dùng (Duration):</label>
                                                <input
                                                    type="text"
                                                    value={med.duration}
                                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                    placeholder="VD: 5 ngày"
                                                    className="w-full border rounded-xl p-2 focus:outline-blue-500"
                                                />
                                            </div>
                                            <div className="flex items-center whitespace-nowrap text-gray-600 text-sm font-semibold mt-auto">
                                                Giá: {med.price.toLocaleString()}đ
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-2 text-right font-semibold text-lg text-green-700">
                                Tổng chi phí: {totalPrice.toLocaleString()}đ
                            </div>
                        </div>
                    )}

                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-semibold"
                >
                    Gửi chẩn đoán
                </button>
            </div>
        </div>
    );
};

export default CreateDiagnosis;
