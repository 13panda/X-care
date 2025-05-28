import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserList = () => {
    const { aToken, getAllUsers, getUserDetails } = useContext(AdminContext);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAppointments, setUserAppointments] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (aToken) {
                try {
                    const res = await getAllUsers();
                    if (res?.success) {
                        setUsers(res.users);
                    }
                } catch (err) {
                    toast.error('Lấy danh sách người dùng thất bại');
                }
            }
        };
        fetchUsers();
    }, [aToken, getAllUsers]);

    const handleSeeDetails = (doctorId) => {
        navigate(`/users-detail/${doctorId}`);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tất cả người dùng</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-2xl transition duration-300 ease-in-out"
                        >
                            <img
                                src={user.image || '/default-avatar.png'}
                                alt={user.name}
                                className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-blue-100"
                            />
                            <p className="text-xl font-semibold text-center">{user.name}</p>
                            <p className="text-gray-500 text-base text-center">{user.email}</p>

                            <button
                                onClick={() => handleSeeDetails(user._id)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
                                hover:bg-blue-700 hover:shadow-lg transition-colors duration-300 ease-in-out
                                focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Chưa có người dùng nào</p>
                )}
            </div>

            {selectedUser && (
                <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{selectedUser.name}</h2>
                    <img
                        src={selectedUser.image || '/default-avatar.png'}
                        alt={selectedUser.name}
                        className="w-40 h-40 rounded-full mb-4"
                    />
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>SĐT:</strong> {selectedUser.phone || 'Chưa cập nhật'}</p>

                    <h3 className="mt-6 text-xl font-semibold">Lịch hẹn</h3>
                    {userAppointments.length === 0 ? (
                        <p>Chưa có lịch hẹn</p>
                    ) : (
                        <ul className="list-disc ml-6">
                            {userAppointments.map((app) => (
                                <li key={app._id}>
                                    Ngày: {new Date(app.appointmentDate).toLocaleDateString()} - Giờ: {app.slotTime} - Trạng thái: {app.cancelled ? 'Đã hủy' : 'Đang chờ'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserList;
