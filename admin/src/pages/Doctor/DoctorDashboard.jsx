import React, { useContext, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../../../admin/src/assets/assets'

const DoctorDashboard = () => {
    const { dToken, getAppointments, cancelAppointment, appointments } = useContext(DoctorContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    // Đếm số bệnh nhân duy nhất
    const uniquePatientsCount = useMemo(() => {
        const patientsSet = new Set()
        appointments.forEach(item => {
            if (item.userData && item.userData._id) {
                patientsSet.add(item.userData._id)
            }
        })
        return patientsSet.size
    }, [appointments])

    if (!dToken) {
        return <p className="text-center mt-10 text-gray-500">Vui lòng đăng nhập để xem dashboard.</p>
    }

    return (
        <div className='m-5'>

            {/* Thẻ tổng quan */}
            <div className='flex flex-wrap gap-5 mb-10'>
                {[ 
                    { icon: assets.appointments_icon, label: "Cuộc hẹn", count: appointments.length },
                    { icon: assets.patients_icon, label: "Bệnh nhân", count: uniquePatientsCount },
                ].map((card, index) => (
                    <div key={index} className='flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md min-w-[200px] hover:scale-105 transition-transform duration-300'>
                        <img className='w-12' src={card.icon} alt="" />
                        <div>
                            <p className='text-2xl font-bold text-gray-700'>{card.count}</p>
                            <p className='text-gray-500'>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Danh sách cuộc hẹn mới nhất */}
            <div className='bg-white rounded-2xl shadow-md'>
                <div className='flex items-center gap-2 px-6 py-5 border-b'>
                    <img className='w-5' src={assets.list_icon} alt="danh sách" />
                    <p className='font-semibold text-gray-700'>Cuộc hẹn mới nhất</p>
                </div>
                <div className='divide-y max-h-[400px] overflow-y-auto'>
                    {appointments.map((item, index) => (
                        <div className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all' key={index}>
                            <div className='flex items-center gap-4'>
                                <img className='rounded-full w-12 h-12 object-cover border' src={item.userData?.image || ''} alt="Bệnh nhân" />
                                <div>
                                    <p className='font-medium text-gray-800'>{item.userData?.name || 'Không rõ'}</p>
                                    <p className='text-sm text-gray-500'>
                                        {item.slotDate ? dayjs(item.slotDate).format('DD/MM/YYYY') : 'Không rõ ngày'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {item.cancelled ? (
                                    <p className='text-red-500 text-xs font-medium'>Đã hủy</p>
                                ) : (
                                    item.paymentStatus !== 'confirmed' && (
                                        <img
                                            onClick={() => cancelAppointment(item._id)}
                                            className='w-8 cursor-pointer transition-transform hover:scale-110'
                                            src={assets.cancel_icon}
                                            alt="Hủy cuộc hẹn"
                                        />
                                    )
                                )}

                                {item.paymentStatus === 'confirmed' && (
                                    <p className='text-green-500 text-xs font-medium'>Đã xác nhận</p>
                                )}
                            </div>
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

export default DoctorDashboard
