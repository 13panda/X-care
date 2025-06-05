import React, { useContext, useEffect, useState } from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const MedicalRecords = () => {
    const { currentDoctor, dToken, backendUrl } = useDoctorContext();
    const { calculateAge } = useContext(AppContext);
    const [confirmedPatients, setConfirmedPatients] = useState([]);

    const navigate = useNavigate();

    // ✅ Hàm check chẩn đoán
    const checkDiagnosis = async (appointmentId) => {
        try {
            const res = await axios.get(`${backendUrl}/api/doctor/check-diagnosis/${appointmentId}`, {
                headers: { dtoken: dToken },
            });
            return res.data.hasDiagnosis;
        } catch (error) {
            console.error(`❌ Lỗi khi kiểm tra chẩn đoán cho ${appointmentId}:`, error);
            return false;
        }
    };

    useEffect(() => {
        const fetchConfirmedAppointments = async () => {
            if (dToken) {
                try {
                    const res = await axios.get(`${backendUrl}/api/doctor/medical-records`, {
                        headers: { dtoken: dToken },
                    });

                    if (res.data.success) {
                        const appointments = res.data.data;

                        // ✅ Kiểm tra từng lịch hẹn có chẩn đoán chưa
                        const updatedAppointments = await Promise.all(
                            appointments.map(async (item) => {
                                const hasDiagnosis = await checkDiagnosis(item._id);
                                return { ...item, hasDiagnosis };
                            })
                        );

                        setConfirmedPatients(updatedAppointments);
                    } else {
                        console.error('API trả về lỗi:', res.data.message);
                    }
                } catch (error) {
                    console.error('❌ Lỗi khi lấy hồ sơ bệnh án:', error.response?.data || error.message);
                }
            }
        };

        fetchConfirmedAppointments();
    }, [dToken]);

    const handleExamine = (appointmentId) => {
        navigate(`/create-diagnosis/${appointmentId}`);
    };

    const handleViewDiagnosis = (appointmentId) => {
        navigate(`/diagnosis-detail/${appointmentId}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Hồ sơ bệnh án</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {confirmedPatients.length > 0 ? (
                    confirmedPatients.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-2xl transition duration-300 ease-in-out"
                        >
                            <img
                                src={item.userData?.image || '/default-avatar.png'}
                                alt={item.userData?.name || 'Bệnh nhân'}
                                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-green-100"
                            />
                            <p className="text-xl font-semibold text-center">{item.userData?.name || 'Không rõ tên'}</p>
                            <p className="text-gray-500 text-base text-center">
                                Tuổi: {item.userData?.dob ? calculateAge(item.userData.dob) : 'Không có dữ liệu'}
                            </p>
                            <p className="text-gray-500 text-base text-center mt-1">
                                Ngày hẹn: {item.slotDate}, Giờ: {item.slotTime}
                            </p>

                            {item.hasDiagnosis ? (
                                <button
                                    onClick={() => handleViewDiagnosis(item._id)}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                                >
                                    Xem chi tiết
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleExamine(item._id)}
                                    className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                                >
                                    Khám
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">Chưa có bệnh nhân nào đã xác nhận lịch hẹn.</p>
                )}
            </div>
        </div>
    );
};

export default MedicalRecords;
