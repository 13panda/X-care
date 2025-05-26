import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
            {/* Tiêu đề */}
            <h1 className='text-3xl font-semibold text-center'>Tìm kiếm chuyên khoa</h1>
            <p className='sm:w-1/3 text-center text-sm fon text-gray-600'>
                Truy cập danh sách bác sĩ chất lượng và đặt lịch khám một cách thuận tiện, nhanh chóng.
            </p>

            {/* Menu chuyên khoa */}
            <div className='flex sm:justify-center gap-6 pt-5 w-full overflow-x-auto scrollbar-hide px-4 scroll-smooth'>
                {specialityData.map((item, index) => (
                    <Link
                        key={index}
                        to={`/doctors/${item.speciality}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className='flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-all duration-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md'
                    >
                        <img className='w-16 sm:w-24 mb-2 object-contain' src={item.image} alt={item.speciality} />
                        <p className='text-xs text-gray-700 text-center'>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
