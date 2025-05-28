import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../../../admin/src/assets/assets'

const Dashboard = () => {
    const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
    const { slotDateFormat } = useContext(AppContext)

    useEffect(() => {
        if (aToken) {
            getDashData()
        }
    }, [aToken])

    return dashData && (
        <div className='m-5'>

            {/* Các thẻ tổng quan */}
            <div className='flex flex-wrap gap-5 mb-10'>
                {[ 
                    { icon: assets.doctor_icon, label: "Bác sĩ", count: dashData.doctors },
                    { icon: assets.appointments_icon, label: "Cuộc hẹn", count: dashData.appointments },
                    { icon: assets.patients_icon, label: "Người dùng", count: dashData.patients },
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
                <div className='divide-y'>
                    {dashData.latestAppointments.map((item, index) => (
                        <div className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all' key={index}>
                            <div className='flex items-center gap-4'>
                                <img className='rounded-full w-12 h-12 object-cover border' src={item.docData.image} alt="Bác sĩ" />
                                <div>
                                    <p className='font-medium text-gray-800'>{item.docData.name}</p>
                                    <p className='text-sm text-gray-500'>{slotDateFormat(item.slotDate)}</p>
                                </div>
                            </div>
                            <div>
                                {/* Nếu đã hủy */}
                                {item.cancelled ? (
                                    <p className='text-red-500 text-xs font-medium'>Đã hủy</p>
                                ) : (
                                    // Nếu chưa hủy, hiển thị nút hủy
                                    item.paymentStatus !== 'confirmed' && (
                                        <img
                                            onClick={() => cancelAppointment(item._id)}
                                            className='w-8 cursor-pointer transition-transform hover:scale-110'
                                            src={assets.cancel_icon}
                                            alt="Hủy cuộc hẹn"
                                        />
                                    )
                                )}

                                {/* Nếu paymentStatus là 'confirmed', hiển thị Đã xác nhận */}
                                {item.paymentStatus === 'confirmed' && (
                                    <p className='text-green-500 text-xs font-medium'>Đã xác nhận</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
