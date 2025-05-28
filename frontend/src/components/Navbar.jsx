import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate()

    const {token, setToken, userData} = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false)

    const logout = () =>{
        setToken(false)
        localStorage.removeItem('token')
    }

    return (
        <nav className='flex items-center justify-between px-4 md:px-10 py-4 mb-5 border-b border-gray-300 shadow-sm'>
            
            {/* Logo and X-Care */}
            <div className='flex items-center'>
                <img
                    onClick={() => navigate('/')}
                    className='w-24 md:w-32 cursor-pointer' // Kích thước logo
                    src={assets.logo}
                    alt="Logo"
                    style={{ width: '50px', height: 'auto' }} // Điều chỉnh kích thước tại đây
                />
                <span className='text-xl md:text-2xl font-semibold text-primary cursor-pointer ml-1' onClick={() => navigate('/')}>
                    X-Care
                </span>
            </div>

            {/* Menu Links */}
            <ul className='hidden md:flex items-center gap-8 font-semibold text-gray-700 text-sm'>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? 'text-primary underline underline-offset-4' : 'hover:text-primary transition'
                    }>
                    <li>HOME</li>
                </NavLink>
                <NavLink
                    to="/doctors"
                    className={({ isActive }) =>
                        isActive ? 'text-primary underline underline-offset-4' : 'hover:text-primary transition'
                    }>
                    <li>ALL DOCTORS</li>
                </NavLink>
                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive ? 'text-primary underline underline-offset-4' : 'hover:text-primary transition'
                    }>
                    <li>ABOUT</li>
                </NavLink>
                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        isActive ? 'text-primary underline underline-offset-4' : 'hover:text-primary transition'
                    }>
                    <li>CONTACT</li>
                </NavLink>
            </ul>

            {/* Profile / Login Button */}
            <div className='flex items-center gap-4'>

                {token && userData ? (
                    <div className='relative group cursor-pointer'>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full' src={userData.image} alt="Profile" />
                            <img className='w-3' src={assets.dropdown_icon} alt="Dropdown" />
                        </div>

                        {/* Dropdown */}
                        <div className='absolute right-0 pt-3 z-20 hidden group-hover:block'>
                            <div className="bg-white rounded-xl shadow-lg py-3 px-4 min-w-[160px] space-y-2 text-sm text-gray-600 font-medium">
                                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">
                                    Hồ sơ cá nhân
                                </p>
                                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">
                                    Lịch hẹn
                                </p>
                                <p onClick={() => navigate('/appointment-history')} className="hover:text-black cursor-pointer">
                                    Lịch sử cuộc hẹn
                                </p>
                                <p onClick={() => logout()} className="hover:text-red-500 cursor-pointer">
                                    Đăng xuất
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:brightness-110 transition'>
                        Đăng ký ngay
                    </button>
                )}

            </div>
        </nav>
    )
}

export default Navbar
