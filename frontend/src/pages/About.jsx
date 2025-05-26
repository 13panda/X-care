import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>

            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>GIỚI THIỆU <span className='text-gray-700 font-medium'>CHÚNG TÔI</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12 '>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>Chào mừng bạn đến với X-Care, đối tác đáng tin cậy của bạn trong việc quản lý các nhu cầu chăm sóc sức khỏe một cách thuận tiện và hiệu quả. Tại X-Care, chúng tôi thấu hiểu những khó khăn mà người dùng gặp phải khi đặt lịch hẹn bác sĩ và quản lý hồ sơ sức khỏe.</p>
                    <p>X-Care cam kết mang đến sự xuất sắc trong công nghệ chăm sóc sức khỏe. Chúng tôi không ngừng cải tiến nền tảng của mình, tích hợp những tiến bộ mới nhất nhằm nâng cao trải nghiệm người dùng và cung cấp dịch vụ vượt trội. Dù bạn đang đặt lịch hẹn đầu tiên hay quản lý việc chăm sóc sức khỏe lâu dài, X-Care luôn đồng hành cùng bạn.</p>
                    <b className='text-gray-800'>Tầm nhìn của chúng tôi</b>
                    <p>Tầm nhìn của X-Care là tạo ra một trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người dùng. Chúng tôi mong muốn thu hẹp khoảng cách giữa bệnh nhân và nhà cung cấp dịch vụ y tế, giúp bạn dễ dàng tiếp cận với sự chăm sóc cần thiết, vào đúng thời điểm.</p>
                </div>
            </div>

            <div className='text-xl my-4'>
                <p>TẠI SAO <span className='text-gray-700 font-semibold'>CHỌN CHÚNG TÔI</span> </p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Hiệu quả:</b>
                    <p>Đặt lịch hẹn nhanh chóng, phù hợp với cuộc sống bận rộn của bạn.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Tiện lợi:</b>
                    <p>Tiếp cận mạng lưới các chuyên gia y tế đáng tin cậy gần bạn.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>Cá nhân hóa:</b>
                    <p>Đề xuất và nhắc nhở được cá nhân hóa giúp bạn chăm sóc sức khỏe tốt hơn.</p>
                </div>
            </div>
        </div>
    )
}

export default About
