import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useDoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useDoctorContext()

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken && <ul className='text-[#333] mt-6'>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/admin-dashboard'}
                    >
                        <img src={assets.home_icon} alt="Bảng điều khiển" className="w-5 h-5" />
                        <p className='text-sm'>Bảng điều khiển</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/all-appointments'}
                    >
                        <img src={assets.appointment_icon} alt="Cuộc hẹn" className="w-5 h-5" />
                        <p className='text-sm'>Cuộc hẹn</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/add-doctor'}
                    >
                        <img src={assets.add_icon} alt="Thêm bác sĩ" className="w-5 h-5" />
                        <p className='text-sm'>Thêm bác sĩ</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-list'}
                    >
                        <img src={assets.people_icon} alt="Danh sách bác sĩ" className="w-5 h-5" />
                        <p className='text-sm'>Danh sách bác sĩ</p>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/calendar-doctors'}
                    >
                        <img src={assets.people_icon} alt="Lịch bác sĩ" className="w-5 h-5" />
                        <p className='text-sm'>Lịch bác sĩ</p>
                    </NavLink>
                </ul>
            }

            {
                dToken && <ul className='text-[#333] mt-6'>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-dashboard'}
                    >
                        <img src={assets.home_icon} alt="Bảng điều khiển" className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Bảng điều khiển</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-appointments'}
                    >
                        <img src={assets.appointment_icon} alt="Cuộc hẹn" className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Cuộc hẹn</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-profile'}
                    >
                        <img src={assets.people_icon} alt="Hồ sơ bác sĩ" className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Hồ sơ</p>
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-schedule'}
                    >
                        <img src={assets.people_icon} alt="Lịch làm việc" className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Lịch làm việc</p>
                    </NavLink>
                </ul>
            }
        </div>
    )
}

export default Sidebar
