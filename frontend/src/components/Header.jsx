import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <header className='flex flex-col md:flex-row bg-white rounded-3xl px-6 md:px-12 lg:px-24 overflow-hidden items-center md:gap-x-12'>
            {/* ---------- Hình bên trái ---------- */}
            <div className='md:w-1/2 flex justify-center items-center mt-0'>
                <img
                    className='w-[320px] md:w-[420px] lg:w-[520px] object-cover rounded-xl'
                    src={assets.header_img}
                    alt="Minh họa bác sĩ"
                />
            </div>

            {/* ---------- Nội dung bên phải ---------- */}
            <div className='md:w-1/2 flex flex-col justify-center gap-6 py-10 md:py-[8vw]'>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-blue-950 leading-tight tracking-tight'>
                    Đặt lịch khám <br /> với bác sĩ uy tín
                </h1>

                <div className='flex items-center gap-4 text-gray-700 text-base font-light'>
                    <img className='w-16 md:w-20' src={assets.group_profiles} alt="Nhóm bác sĩ" />
                    <p>
                        Dễ dàng tìm kiếm và chọn lựa bác sĩ phù hợp, đặt lịch khám nhanh chóng – không cần chờ đợi.
                    </p>
                </div>

                <a href="#speciality"
                    className='flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 w-max self-start'>
                    Đặt lịch ngay
                    <span className='flex items-center justify-center w-7 h-7 rounded-full '>
                        <img className='w-4' src={assets.arrow_icon} alt="Biểu tượng mũi tên" style={{filter: 'invert(1)'}} />
                    </span>
                </a>

                <blockquote className="text-lg font-semibold text-primary mt-2">
                    "Đặt nhanh – Khám yên tâm"
                </blockquote>
                <p className="text-gray-700">
                    Bác sĩ đáng tin cậy. Dịch vụ chất lượng. 
                    <br />
                    Sức khỏe của bạn là ưu tiên hàng đầu.
                </p>
            </div>
        </header>
    )
}

export default Header
