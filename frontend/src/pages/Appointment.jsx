import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const { doctors, formatPrice, backendUrl, token, getDoctorsData } = useContext(AppContext);

    const daysOfWeek = ['CN', 'THU', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    // Lấy thông tin bác sĩ từ danh sách đã tải
    const fetchDocInfo = () => {
        const info = doctors.find(doc => doc._id === docId);
        setDocInfo(info);
    };

    // Tạo lịch mặc định (10h-21h mỗi 30 phút)
    const getAvailableSlotsFallback = () => {
        const today = new Date();
        const allSlots = [];

        for (let i = 0; i < 7; i++) {
            const current = new Date(today);
            current.setDate(today.getDate() + i);

            let startTime = new Date(current);
            let endTime = new Date(current);

            if (i === 0) {
                startTime.setHours(Math.max(10, today.getHours() + 1));
                startTime.setMinutes(today.getMinutes() > 30 ? 30 : 0);
            } else {
                startTime.setHours(10, 0, 0, 0);
            }

            endTime.setHours(21, 0, 0, 0);

            const timeSlots = [];
            while (startTime < endTime) {
                const formatted = startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                const slotDate = `${startTime.getDate()}_${startTime.getMonth() + 1}_${startTime.getFullYear()}`;
                const isAvailable = !(docInfo.slots_booked?.[slotDate]?.includes(formatted));

                if (isAvailable) {
                    timeSlots.push({ datetime: new Date(startTime), time: formatted });
                }

                startTime.setMinutes(startTime.getMinutes() + 30);
            }

            allSlots.push(timeSlots);
        }

        setDocSlots(allSlots);
    };

    // Tạo lịch từ workingSchedule của bác sĩ
    const getAvailableSlotsFromSchedule = () => {
        const schedule = docInfo.workingSchedule; // { "YYYY-MM-DD": ["09:00", "10:00", ...] }
        const today = new Date();
        const allSlots = [];

        for (let i = 0; i < 7; i++) {
            const current = new Date(today);
            current.setDate(today.getDate() + i);
            const dateKey = current.toISOString().split("T")[0];

            const timeList = schedule?.[dateKey] || [];
            const daySlots = [];

            timeList.forEach(timeStr => {
                const [hour, minute] = timeStr.split(":").map(Number);
                const slotDateTime = new Date(current);
                slotDateTime.setHours(hour, minute, 0, 0);

                const slotDate = `${slotDateTime.getDate()}_${slotDateTime.getMonth() + 1}_${slotDateTime.getFullYear()}`;
                const isAvailable = !(docInfo.slots_booked?.[slotDate]?.includes(timeStr));

                if (isAvailable) {
                    daySlots.push({ datetime: slotDateTime, time: timeStr });
                }
            });

            allSlots.push(daySlots);
        }

        setDocSlots(allSlots);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Bạn cần đăng nhập để đặt lịch!');
            return navigate('/login');
        }

        try {
            const date = docSlots[slotIndex][0].datetime;
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Lấy thông tin bác sĩ
    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    // Sau khi có docInfo thì tạo lịch
    useEffect(() => {
        if (docInfo) {
            const hasSchedule = docInfo.workingSchedule && Object.keys(docInfo.workingSchedule).length > 0;

            if (hasSchedule) {
                getAvailableSlotsFromSchedule();
            } else {
                getAvailableSlotsFallback();
            }
        }
    }, [docInfo]);

    return docInfo && (
        <div>
            {/* Doctor details */}
            {/* Doctor details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            Giới thiệu <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        {/* Sử dụng hàm formatPrice để hiển thị giá chuẩn */}
                        Phí dịch vụ: <span className='text-gray-600'>{formatPrice(docInfo.fees)}</span>
                    </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Lịch khám</p>

                {/* Date selection */}
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length > 0 && docSlots.map((item, index) => (
                            item.length > 0 && (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSlotIndex(index);
                                        setSlotTime('');
                                    }}
                                    className={`text-center py-6 min-w-[64px] flex-shrink-0 rounded-full cursor-pointer 
                                        ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                                >
                                    <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p>{item[0].datetime.getDate()}</p>
                                </div>
                            )
                        ))
                    }
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                    {
                        docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setSlotTime(item.time)}
                                className={`py-2 px-4 rounded-md border text-sm 
                                    ${slotTime === item.time ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            >
                                {item.time}
                            </button>
                        ))
                    }
                </div>

                {/* Selected time */}
                {slotTime && (
                    <p className='mt-4 text-gray-600'>
                        Thời gian: <span className='font-medium'>{slotTime}</span>
                    </p>
                )}
                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                    Đặt lịch hẹn
                </button>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;
