import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    Thermometer,
    ClipboardCheck,
    Syringe,
    FileText,
    Pill,
    DollarSign,
    Clock,
    X,
    CreditCard
} from 'lucide-react';
import dayjs from 'dayjs'

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    >
                        Có
                    </button>
                </div>
            </div>
        </div>
    )
}

const AppointmentHistory = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

    const [diagnosisData, setDiagnosisData] = useState(null)
    const [showDiagnosis, setShowDiagnosis] = useState(false)

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return 'Ngày không hợp lệ'

        if (typeof slotDate === 'string' && slotDate.includes('_')) {
            const parts = slotDate.split('_')
            if (parts.length === 3) {
                let [day, month, year] = parts
                if (day.length === 1) day = '0' + day
                if (month.length === 1) month = '0' + month

                const formatted = `${year}-${month}-${day}`
                const date = dayjs(formatted)
                if (!date.isValid()) return 'Ngày không hợp lệ'
                return date.format('ddd, D [tháng] M [năm] YYYY')
            }
        }

        const date = dayjs(slotDate)
        if (!date.isValid()) return 'Ngày không hợp lệ'
        return date.format('ddd, D [tháng] M [năm] YYYY')
    }

    const getUserAppointments = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            if (data.success) {
                const paidAppointments = data.appointments.filter(item => item.paymentStatus === 'confirmed')
                setAppointments(paidAppointments.reverse())
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Lỗi khi tải lịch sử cuộc hẹn")
        } finally {
            setLoading(false)
        }
    }

    const fetchDiagnosis = async (appointmentId) => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/get-diagnosis/${appointmentId}`,
                { headers: { token } }
            )

            if (data.success) {
                setDiagnosisData(data.diagnosis)
                setShowDiagnosis(true)
            } else {
                toast.warn(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Chưa có thông tin chẩn đoán")
        }
    }

    const deleteAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/delete-appointment',
                { appointmentId },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
                getDoctorsData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message || "Lỗi khi xóa lịch sử")
        }
    }

    const openConfirm = (appointmentId) => {
        setSelectedAppointmentId(appointmentId)
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        deleteAppointment(selectedAppointmentId)
        setConfirmOpen(false)
    }

    const handleCancel = () => {
        setConfirmOpen(false)
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Lịch sử cuộc hẹn </h2>

            {loading ? (
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            ) : appointments.length === 0 ? (
                <p className="text-gray-600">Bạn chưa có cuộc hẹn đã thanh toán nào.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {appointments.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={item.docData?.image || 'https://via.placeholder.com/150'}
                                    alt={item.docData?.name || 'Bác sĩ'}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                                />
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{item.docData?.name || 'Không rõ'}</h3>
                                <p className="text-blue-600 font-medium">{item.docData?.speciality || 'Chưa cập nhật'}</p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p className="font-medium">Địa chỉ:</p>
                                    <p>{item.docData?.address?.line1 || ''}</p>
                                    <p>{item.docData?.address?.line2 || ''}</p>
                                </div>
                                <p className="mt-3 text-sm text-gray-700">
                                    <span className="font-semibold">Ngày & Giờ:</span>{' '}
                                    {slotDateFormat(item.slotDate)} || {item.slotTime}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center gap-2 mt-4 sm:mt-0">
                                <button
                                    onClick={() => openConfirm(item._id)}
                                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Xóa lịch sử
                                </button>
                                <button
                                    onClick={() => fetchDiagnosis(item._id)}
                                    className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Xem lịch sử
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmOpen}
                title="Xác nhận"
                message="Bạn có chắc muốn xóa lịch sử cuộc hẹn này không?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            {showDiagnosis && diagnosisData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full overflow-auto max-h-[80vh]">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <ClipboardCheck size={24} /> Thông tin chẩn đoán
                        </h2>

                        <div className="mb-3">
                            <p className="font-semibold flex items-center gap-2">
                                <Thermometer size={18} /> Triệu chứng:
                            </p>
                            <ul className="list-disc list-inside ml-6">
                                {diagnosisData.symptoms?.map((symptom, index) => (
                                    <li key={index}>{symptom}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                            <ClipboardCheck size={18} />
                            <p><span className="font-semibold">Chẩn đoán:</span> {diagnosisData.diagnosis}</p>
                        </div>

                        <div className="mb-3">
                            <p className="font-semibold flex items-center gap-2">
                                <Syringe size={18} /> Chỉ định:
                            </p>

                            <ul className="list-disc list-inside ml-6">
                                {diagnosisData.treatments?.map((treatment, index) => (
                                    <li key={index}>{treatment}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                            <FileText size={18} />
                            <p><span className="font-semibold">Ghi chú:</span> {diagnosisData.notes}</p>
                        </div>

                        <div className="mb-3">
                            <p className="font-semibold flex items-center gap-2">
                                <Pill size={18} /> Thuốc kê đơn:
                            </p>
                            <ul className="list-disc list-inside ml-6">
                                {diagnosisData.medications?.map((med, index) => (
                                    <li key={index}>
                                        {med.name} - {med.dosage} - {med.frequency}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                            <DollarSign size={18} />
                            <p><span className="font-semibold">Tổng tiền:</span> {diagnosisData.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                            <ClipboardCheck size={18} />
                            <p>
                                <span className="font-semibold">Trạng thái thanh toán:</span>{' '}
                                <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                                    ${diagnosisData.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        diagnosisData.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'}`}>
                                    {diagnosisData.paymentStatus}
                                </span>
                            </p>
                        </div>

                        <button
                            disabled
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded mt-2 cursor-not-allowed"
                        >
                            <CreditCard size={18} /> Thanh toán
                        </button>

                        <div className="mb-3 text-sm text-gray-600 flex flex-col gap-1 mt-4">
                            <p className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="font-semibold">Ngày tạo:</span> {dayjs(diagnosisData.createdAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="font-semibold">Cập nhật lần cuối:</span> {dayjs(diagnosisData.updatedAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>

                        <button
                            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
                            onClick={() => setShowDiagnosis(false)}
                        >
                            <X size={18} /> Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppointmentHistory
