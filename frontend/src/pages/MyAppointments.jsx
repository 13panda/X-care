import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'

// Cấu hình hiển thị T2 → T7
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)
dayjs.locale('vi')
dayjs.updateLocale('vi', {
    daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
})

// ConfirmDialog dùng xác nhận thanh toán hoặc hủy
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

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const slotDateFormat = (slotDate) => {
        if (!slotDate) return 'Ngày không hợp lệ'

        // Nếu slotDate là chuỗi dạng "4_6_2025"
        if (typeof slotDate === 'string' && slotDate.includes('_')) {
            const parts = slotDate.split('_')
            if (parts.length === 3) {
                let [day, month, year] = parts
                // Thêm số 0 nếu cần để ngày, tháng có 2 chữ số
                if (day.length === 1) day = '0' + day
                if (month.length === 1) month = '0' + month

                const formatted = `${year}-${month}-${day}` // chuẩn ISO 8601
                const date = dayjs(formatted)
                if (!date.isValid()) return 'Ngày không hợp lệ'
                return date.format('ddd, D [tháng] M [năm] YYYY')
            }
        }

        // Nếu slotDate đã là định dạng chuẩn
        const date = dayjs(slotDate)
        if (!date.isValid()) return 'Ngày không hợp lệ'
        return date.format('ddd, D [tháng] M [năm] YYYY')
    }


    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', {
                headers: { token },
            })
            if (data.success) {
                const filtered = data.appointments.filter(item => item.paymentStatus !== 'confirmed')
                setAppointments(filtered.reverse())
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
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
            console.log(error)
            toast.error(error.message)
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
            console.log(error)
            toast.error(error.message)
        }
    }

    const requestPayment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/request-payment',
                { appointmentId },
                { headers: { token } }
            )
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

    const openConfirm = (appointmentId) => {
        setSelectedAppointmentId(appointmentId)
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        requestPayment(selectedAppointmentId)
        setConfirmOpen(false)
    }

    const handleCancel = () => {
        setConfirmOpen(false)
    }

    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)
    const [cancelAppointmentId, setCancelAppointmentId] = useState(null)

    const openCancelConfirm = (appointmentId) => {
        setCancelAppointmentId(appointmentId)
        setCancelConfirmOpen(true)
    }

    const handleCancelConfirm = () => {
        cancelAppointment(cancelAppointmentId)
        setCancelConfirmOpen(false)
    }

    const handleCancelCancel = () => {
        setCancelConfirmOpen(false)
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Lịch hẹn cá nhân</h2>
            <div className="flex flex-col gap-6">
                {appointments.length === 0 ? (
                    <p className="text-gray-500 text-lg py-8">Chưa có lịch hẹn nào</p>
                ) : (
                    appointments.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={item.docData.image}
                                    alt={item.docData.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{item.docData.name}</h3>
                                <p className="text-blue-600 font-medium">{item.docData.speciality}</p>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p className="font-medium">Địa chỉ:</p>
                                    <p>{item.docData.address.line1}</p>
                                    <p>{item.docData.address.line2}</p>
                                </div>
                                <p className="mt-3 text-sm text-gray-700">
                                    <span className="font-semibold">Ngày & Giờ:</span>{' '}
                                    {slotDateFormat(item.slotDate)} || {item.slotTime}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center gap-2 mt-4 sm:mt-0">
                                {!item.cancelled && (
                                    <>
                                        {item.paymentStatus === 'none' && (
                                            <button
                                                onClick={() => openConfirm(item._id)}
                                                className="w-full sm:w-auto bg-white border border-gray-400 py-2 px-4 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
                                            >
                                                Xác nhận
                                            </button>
                                        )}

                                        {item.paymentStatus === 'pending' && (
                                            <button
                                                disabled
                                                className="w-full sm:w-auto bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
                                            >
                                                Chờ xác nhận...
                                            </button>
                                        )}

                                        {item.paymentStatus === 'confirmed' && (
                                            <button
                                                disabled
                                                className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-lg cursor-not-allowed"
                                            >
                                                Đã thanh toán
                                            </button>
                                        )}

                                        {item.paymentStatus !== 'confirmed' && !item.cancelled && (
                                            <button
                                                onClick={() => openCancelConfirm(item._id)}
                                                className="w-full sm:w-auto bg-white border border-gray-400 py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                                            >
                                                Hủy lịch hẹn
                                            </button>
                                        )}
                                    </>
                                )}
                                {item.cancelled && (
                                    <div className="flex flex-col gap-2">
                                        <button className="sm:min-w-48 py-2 border rounded text-red-500 bg-red-50 cursor-default">
                                            Đã hủy
                                        </button>
                                        <button
                                            onClick={() => deleteAppointment(item._id)}
                                            className="sm:min-w-48 py-2 border rounded text-white bg-red-500 hover:bg-red-600 transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Popup xác nhận thanh toán */}
            <ConfirmDialog
                isOpen={confirmOpen}
                title="Xác nhận"
                message="Bạn có chắc muốn gửi yêu cầu xác nhận lịch hẹn?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            {/* Popup xác nhận hủy */}
            <ConfirmDialog
                isOpen={cancelConfirmOpen}
                title="Xác nhận hủy"
                message="Bạn có chắc muốn hủy lịch hẹn này?"
                onConfirm={handleCancelConfirm}
                onCancel={handleCancelCancel}
            />
        </div>
    )
}

export default MyAppointments
