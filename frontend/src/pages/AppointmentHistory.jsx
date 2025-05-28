import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

// ConfirmDialog tái sử dụng cho xác nhận xóa lịch sử
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

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Format tiền Việt Nam
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }

    // Lấy danh sách lịch đã thanh toán
    const getUserAppointments = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            if (data.success) {
                // Lọc lấy các lịch có paymentStatus là 'confirmed' (đã thanh toán)
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

    // Xóa lịch sử cuộc hẹn
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
            toast.error(error.message || "Lỗi khi xóa lịch sử")
        }
    }

    // Mở confirm dialog xóa
    const openConfirm = (appointmentId) => {
        setSelectedAppointmentId(appointmentId)
        setConfirmOpen(true)
    }

    // Xác nhận xóa
    const handleConfirm = () => {
        deleteAppointment(selectedAppointmentId)
        setConfirmOpen(false)
    }

    // Hủy confirm dialog
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
                                <p className="mt-1 text-sm text-gray-700">
                                    <span className="font-semibold">Chi phí:</span>{' '}
                                    {item.docData?.fees != null ? formatPrice(item.docData.fees) : '0₫'}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center gap-2 mt-4 sm:mt-0">
                                <button
                                    onClick={() => openConfirm(item._id)}
                                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Xóa lịch sử
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ConfirmDialog cho xóa lịch sử */}
            <ConfirmDialog
                isOpen={confirmOpen}
                title="Xác nhận"
                message="Bạn có chắc muốn xóa lịch sử cuộc hẹn này không?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default AppointmentHistory
