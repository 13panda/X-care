import React, { useEffect, useContext } from 'react'
import { useDoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorAppointment = () => {
    const { dToken, appointments, getAppointments } = useDoctorContext()
    const { calculateAge, slotDateFormat } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    // Hàm hiển thị trạng thái cuộc hẹn theo logic của trang AllAppointments
    const renderStatus = (item) => {
        if (item.cancelled) {
            return <span className="text-red-600 font-semibold">Đã hủy</span>
        }
        if (item.paymentStatus === 'pending') {
            return <span className="text-blue-600 font-semibold">Đang chờ</span>
        }
        if (item.paymentStatus === 'confirmed') {
            return <span className="text-green-600 font-semibold">Đã xác nhận</span>
        }
        // Trạng thái mặc định (pending, completed, ...)
        return <span className="text-gray-600 font-semibold">Chờ xử lý</span>
    }

    return (
        <div className='w-full max-w-6xl mx-auto mt-6 px-4'>
            <p className='mb-4 text-xl font-semibold text-gray-800'>Tất cả cuộc hẹn</p>

            <div className='bg-white border rounded-xl shadow-sm text-sm overflow-hidden'>
                {/* Header */}
                <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr] items-center py-3 px-6 border-b bg-gray-100 text-gray-700 font-medium sticky top-0 z-10 text-sm'>
                    <p>#</p>
                    <p>Bệnh nhân</p>
                    <p>Tuổi</p>
                    <p>Trạng thái</p>
                    <p>Ngày & Giờ</p>
                </div>

                {/* Danh sách cuộc hẹn */}
                <div className='max-h-[75vh] overflow-y-auto divide-y'>
                    {appointments.map((item, index) => (
                        <div
                            key={index}
                            className='grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr] items-center py-4 px-6 text-gray-700 hover:bg-gray-50 transition-all duration-150 text-sm'
                        >
                            <p>{index + 1}</p>

                            {/* Bệnh nhân */}
                            <div className='flex items-center gap-2'>
                                <img className='w-9 h-9 rounded-full object-cover border shadow-sm' src={item.userData.image} alt="Bệnh nhân" />
                                <p className='font-medium'>{item.userData.name}</p>
                            </div>

                            {/* Tuổi */}
                            <p>{calculateAge(item.userData.dob)}</p>

                            {/* Trạng thái */}
                            <p>{renderStatus(item)}</p>

                            {/* Ngày & Giờ */}
                            <p className='text-gray-600'>
                                {slotDateFormat(item.slotDate)}, {item.slotTime}
                            </p>
                        </div>
                    ))}
                    {appointments.length === 0 && (
                        <p className="text-center py-10 text-gray-500">Không có cuộc hẹn nào.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorAppointment
