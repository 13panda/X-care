import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const RecordMedical = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const { calculateAge } = useContext(AppContext);
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!aToken) {
            return;
        }

        const fetchDiagnosedRecords = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/admin/diagnosed-records`, {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.data.success) {
                    setRecords(res.data.data);
                }
            } catch (err) {
                // Có thể thêm xử lý lỗi ở đây nếu cần
            }
        };

        fetchDiagnosedRecords();
    }, [aToken, backendUrl]);

    const handleViewDiagnosis = (appointmentId) => {
        navigate(`/record-detail/${appointmentId}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Hồ sơ bệnh án đã chẩn đoán</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {records.length > 0 ? (
                    records.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-2xl transition duration-300 ease-in-out"
                        >
                            <img
                                src={item.userData?.image || '/default-avatar.png'}
                                alt={item.userData?.name || 'Bệnh nhân'}
                                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-100"
                            />
                            <p className="text-xl font-semibold text-center">{item.userData?.name || 'Không rõ tên'}</p>
                            <p className="text-gray-500 text-base text-center">
                                Tuổi: {item.userData?.dob ? calculateAge(item.userData.dob) : 'Không rõ'}
                            </p>
                            <p className="text-gray-500 text-base text-center mt-1">
                                Ngày hẹn: {item.slotDate}, Giờ: {item.slotTime}
                            </p>

                            <button
                                onClick={() => handleViewDiagnosis(item._id)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">Chưa có lịch hẹn nào có chẩn đoán.</p>
                )}
            </div>
        </div>
    );
};

export default RecordMedical;
