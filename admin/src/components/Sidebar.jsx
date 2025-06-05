import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { useDoctorContext } from '../context/DoctorContext';

import {
    FiHome,
    FiUserPlus,
    FiUsers,
    FiCalendar,
    FiUser,
    FiClipboard,
    FiFileText
} from 'react-icons/fi';

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useDoctorContext();

    return (
        <div className='min-h-screen bg-white border-r'>
            {aToken && (
                <ul className='text-[#333] mt-6'>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/admin-dashboard'}
                    >
                        <FiHome className="w-5 h-5" />
                        <p className='text-sm'>Bảng điều khiển</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/all-appointments'}
                    >
                        <FiClipboard className="w-5 h-5" />
                        <p className='text-sm'>Cuộc hẹn</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/add-doctor'}
                    >
                        <FiUserPlus className="w-5 h-5" />
                        <p className='text-sm'>Thêm bác sĩ</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-list'}
                    >
                        <FiUsers className="w-5 h-5" />
                        <p className='text-sm'>Danh sách bác sĩ</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/users'}
                    >
                        <FiUsers className="w-5 h-5" />
                        <p className='text-sm'>Danh sách người dùng</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/record-medical'}
                    >
                        <FiCalendar className="w-5 h-5" />
                        <p className='text-sm'>Hồ sơ bệnh án</p>
                    </NavLink>
                </ul>
            )}

            {dToken && (
                <ul className='text-[#333] mt-6'>
                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-dashboard'}
                    >
                        <FiHome className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Bảng điều khiển</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-appointments'}
                    >
                        <FiClipboard className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Cuộc hẹn</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-profile'}
                    >
                        <FiUser className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Hồ sơ cá nhân</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/medical-records'}
                    >
                        <FiFileText className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Hồ sơ bệnh án</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3.5 px-8 md:min-w-72 transition-colors duration-200 
                            ${isActive ? 'bg-[#EEF0FF] border-r-4 border-primary text-primary font-medium' : 'hover:bg-gray-100 hover:scale-105 transition-transform duration-200'}`
                        }
                        to={'/doctor-schedule'}
                    >
                        <FiCalendar className="w-5 h-5" />
                        <p className='hidden md:block text-sm'>Lịch làm việc</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
