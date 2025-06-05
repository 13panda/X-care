import React, { useState } from 'react'
import { useDoctorContext } from '../../context/DoctorContext'

const DiagnosisForm = ({ appointmentId, onClose }) => {
    const { createDiagnosis } = useDoctorContext()

    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosis: '',
        treatments: '',
        medications: [], // [{name, dosage, price}]
        notes: ''
    })

    const [medication, setMedication] = useState({ name: '', dosage: '', price: 0 })

    const handleAddMedication = () => {
        if (!medication.name || !medication.dosage) return;
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, medication]
        }))
        setMedication({ name: '', dosage: '', price: 0 })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createDiagnosis({
            appointmentId,
            ...formData
        })
        onClose()
    }

    return (
        <div className='p-4 bg-white rounded-xl border shadow-md w-full max-w-2xl'>
            <h2 className='text-lg font-semibold mb-4'>Chẩn đoán & Kê đơn</h2>
            <form onSubmit={handleSubmit} className='space-y-3'>
                <div>
                    <label className='font-medium'>Triệu chứng:</label>
                    <textarea value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} className='input' />
                </div>
                <div>
                    <label className='font-medium'>Chẩn đoán:</label>
                    <textarea value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} className='input' />
                </div>
                <div>
                    <label className='font-medium'>Phác đồ điều trị:</label>
                    <textarea value={formData.treatments} onChange={(e) => setFormData({ ...formData, treatments: e.target.value })} className='input' />
                </div>
                <div>
                    <label className='font-medium'>Ghi chú thêm:</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className='input' />
                </div>

                <div className='bg-gray-50 p-3 rounded-md'>
                    <label className='font-medium'>Thuốc & Chi phí:</label>
                    <div className='grid grid-cols-3 gap-2 mb-2'>
                        <input type="text" placeholder="Tên thuốc" value={medication.name} onChange={(e) => setMedication({ ...medication, name: e.target.value })} className='input' />
                        <input type="text" placeholder="Liều dùng" value={medication.dosage} onChange={(e) => setMedication({ ...medication, dosage: e.target.value })} className='input' />
                        <input type="number" placeholder="Giá (VNĐ)" value={medication.price} onChange={(e) => setMedication({ ...medication, price: +e.target.value })} className='input' />
                    </div>
                    <button type="button" className='btn btn-sm btn-blue' onClick={handleAddMedication}>+ Thêm thuốc</button>

                    {/* Danh sách thuốc */}
                    {formData.medications.length > 0 && (
                        <ul className='mt-2 text-sm text-gray-700'>
                            {formData.medications.map((med, i) => (
                                <li key={i}>• {med.name} - {med.dosage} - {med.price.toLocaleString()}đ</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='flex justify-end gap-2'>
                    <button type="button" onClick={onClose} className='btn btn-gray'>Hủy</button>
                    <button type="submit" className='btn btn-blue'>Lưu chẩn đoán</button>
                </div>
            </form>
        </div>
    )
}

export default DiagnosisForm
