import React from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useDoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useDoctorContext()
    const navigate = useNavigate()

    const logout = () => {
        // Xóa token admin nếu có
        if (aToken) {
            localStorage.removeItem('aToken')
            setAToken('')
        }
        // Xóa token doctor nếu có
        if (dToken) {
            localStorage.removeItem('dToken')
            setDToken('')
        }

        // Chuyển về trang login (hoặc trang bạn muốn)
        navigate('/login')
    }

    const handleLogoClick = () => {
        if (aToken) {
            navigate('/admin-dashboard')
        } else if (dToken) {
            navigate('/doctor-dashboard')
        } else {
            navigate('/login')
        }
        window.location.reload()
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            {/* Logo + X-Care */}
            <div
                className='flex items-center gap-2 cursor-pointer'
                onClick={handleLogoClick}
                title="Go to Dashboard"
            >
                <img
                    src={assets.admin_logo}
                    alt="X-Care Logo"
                    className='h-14 w-auto object-contain'
                    style={{ maxHeight: '56px' }}
                />
                <span className='text-2xl font-bold text-primary'>X-Care</span>
            </div>

            {/* Vai trò + Logout */}
            <div className='flex items-center gap-4'>
                <p className='border px-3 py-1 rounded-full border-gray-500 text-gray-600 text-sm'>
                    {aToken ? 'Admin' : dToken ? 'Doctor' : 'Guest'}
                </p>
                <button
                    onClick={logout}
                    className='bg-primary text-white text-sm px-10 py-2 rounded-full'>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar
