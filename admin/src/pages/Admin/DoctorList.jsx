import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const { doctors, aToken, getAllDoctors, changeAvailability, getDoctorDetails } = useContext(AdminContext);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            if (aToken) {
                try {
                    await getAllDoctors();
                } catch (error) {
                    toast.error('Lấy danh sách bác sĩ thất bại');
                }
            }
        };
        fetchDoctors();
    }, [aToken, getAllDoctors]);

    const handleSeeDetails = (doctorId) => {
        navigate(`/doctors-detail/${doctorId}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tất cả bác sĩ</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors && doctors.length > 0 ? (
                    doctors.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-2xl transition duration-300 ease-in-out"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-100"
                            />
                            <p className="text-xl font-semibold text-center">{item.name}</p>
                            <p className="text-gray-500 text-base text-center">{item.speciality}</p>

                            <div className="flex items-center gap-2 mt-3">
                                <input
                                    type="checkbox"
                                    checked={item.available}
                                    onChange={() => changeAvailability(item._id)} 
                                    className="w-4 h-4 rounded-full accent-blue-500 border-2 border-gray-300"
                                />
                                <span className="text-base text-gray-600">Sẵn Sàng</span>
                            </div>

                            <button
                                onClick={() => handleSeeDetails(item._id)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                                    hover:bg-blue-700 hover:shadow-lg transition-colors duration-300 ease-in-out
                                    focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Chưa có bác sĩ nào</p>
                )}
            </div>

            {selectedDoctor && (
                <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{selectedDoctor.name}</h2>
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-48 h-48 rounded-full mb-4" />
                    <p><strong>Email:</strong> {selectedDoctor.email}</p>
                    <p><strong>Chuyên khoa:</strong> {selectedDoctor.speciality}</p>
                    <p><strong>Phí khám:</strong> {selectedDoctor.fees?.toLocaleString()} VND</p>

                    <h3 className="mt-6 text-xl font-semibold">Lịch hẹn</h3>
                    {appointments.length === 0 ? (
                        <p>Chưa có lịch hẹn</p>
                    ) : (
                        <ul className="list-disc ml-6">
                            {appointments.map((app) => (
                                <li key={app._id}>
                                    Ngày: {new Date(app.appointmentDate).toLocaleDateString()} - Giờ: {app.slotTime} - Trạng thái: {' '}
                                    {app.cancelled ? 'Đã hủy' : 'Đang chờ'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorList;
