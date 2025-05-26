import React, { useEffect, useContext } from 'react'
import { useDoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
    const { dToken, appointments, getAppointments, cancelAppointment } = useDoctorContext()
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    return (
        <div className='w-full max-w-6xl mx-auto mt-6 px-4'>
            <p className='mb-4 text-xl font-semibold text-gray-800'>All Appointments</p>

            <div className='bg-white border rounded-xl shadow-sm text-sm overflow-hidden'>
                {/* Header */}
                <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center py-3 px-6 border-b bg-gray-100 text-gray-700 font-medium sticky top-0 z-10 text-sm'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {/* Appointment List */}
                <div className='max-h-[75vh] overflow-y-auto divide-y'>
                    {appointments.map((item, index) => (
                        <div
                            key={index}
                            className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center py-4 px-6 text-gray-700 hover:bg-gray-50 transition-all duration-150 text-sm'
                        >
                            <p>{index + 1}</p>

                            {/* Patient */}
                            <div className='flex items-center gap-2'>
                                <img className='w-9 h-9 rounded-full object-cover border shadow-sm' src={item.userData.image} alt="Patient" />
                                <p className='font-medium'>{item.userData.name}</p>
                            </div>

                            {/* Payment */}
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${item.paymentStatus === 'confirmed'
                                    ? ' text-green-600'
                                    : ' text-yellow-700'}`}>
                                {item.paymentStatus === 'confirmed' ? 'Online' : 'Cash'}
                            </span>

                            {/* Age */}
                            <p>{calculateAge(item.userData.dob)}</p>

                            {/* Date & Time */}
                            <p className='text-gray-600'>
                                {slotDateFormat(item.slotDate)}, {item.slotTime}
                            </p>

                            {/* Fees */}
                            <p className='text-gray-800 font-semibold'>
                                {currency} {item.amount}
                            </p>

                            {/* Action */}
                            {/* Action */}
                            <div>
                                {item.cancelled ? (
                                    <span className='text-red-600 text-xs font-semibold'>Cancelled</span>
                                ) : item.paymentStatus === 'confirmed' ? (
                                    <span className='text-green-600 text-xs font-semibold'>Confirmed</span>
                                ) : (
                                    <img
                                        src={assets.cancel_icon}
                                        alt="Cancel"
                                        className='w-6 cursor-pointer hover:scale-110 transition-transform'
                                        onClick={() => cancelAppointment(item._id)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoctorAppointment
