import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {

    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>LIÊN <span className='text-gray-700 font-semibold'>HỆ</span></p>
            </div>

            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

                <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
                
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-lg text-gray-600'>VĂN PHÒNG CỦA CHÚNG TÔI</p>
                    <p className='text-gray-500'>77 Nguyễn Huệ <br /> Tầng 3, Thành Phố Huế, Quận Thuận Hóa</p>
                    <p className='text-gray-500'>Điện thoại: (84) 843‑305-125 <br />Email: 13dvhung@gmail.com </p>
                    <p className='font-semibold text-lg text-gray-600'>CƠ HỘI NGHỀ NGHIỆP TẠI X-CARE</p>
                    <p className='text-gray-500'>Tìm hiểu thêm về các đội nhóm và cơ hội việc làm hiện có.</p>
                    <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
                        Khám phá việc làm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Contact
