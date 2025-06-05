import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Lấy danh sách bác sĩ
    const getAllDoctors = async () => {
        try {
            if (!aToken) {
                toast.error('Token is missing!');
                return;
            }
            const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    // Lấy danh sách người dùng 
    const getAllUsers = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            return res.data; // 🔥 PHẢI có dòng này để component nhận được
        } catch (err) {
            console.error('Lỗi getAllUsers:', err.response?.data || err.message);
            return { success: false };
        }
    };



    // Thay đổi trạng thái availability bác sĩ (POST /change-availability)
    const changeAvailability = async (docId) => {
        try {
            if (!aToken) {
                toast.error('Token is missing!');
                return;
            }
            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Lấy danh sách cuộc hẹn
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });

            if (data.success) {
                // Lọc ra các cuộc hẹn có cả userData và docData hợp lệ
                const validAppointments = data.appointments.filter(item =>
                    item.userData && item.userData.name && item.docData && item.docData.name
                );
                setAppointments(validAppointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Hủy cuộc hẹn
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Lấy dữ liệu dashboard
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Xác nhận thanh toán (POST /confirm-payment có authAdmin)
    const confirmPayment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/confirm-payment`,
                { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (data.success) {
                setAppointments((prev) =>
                    prev.map((app) =>
                        app._id === appointmentId ? { ...app, paymentStatus: 'confirmed' } : app
                    )
                );
                toast.success('Lịch hẹn đã được xác nhận');
            } else {
                toast.error(data.message || 'Error confirming payment');
            }
        } catch (error) {
            toast.error('Error confirming payment');
        }
    };

    // Lấy chi tiết bác sĩ (GET /doctor-list/:id)
    const getDoctorDetails = async (doctorId) => {
        try {
            if (!aToken) {
                toast.error('Token is missing!');
                return null;
            }
            const { data } = await axios.get(`${backendUrl}/api/admin/doctor-list/${doctorId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                return data; // chứa doctor và appointments
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Lấy chi tiết user(GET /user/:id)
    const getUserDetails = async (userId) => {
        try {
            if (!aToken) {
                toast.error('Token is missing!');
                return null;
            }
            const { data } = await axios.get(`${backendUrl}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                return data;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Xóa bác sĩ (DELETE /doctor-list/:id)
    const deleteDoctor = async (doctorId) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/doctor-list/${doctorId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.message === 'Xóa bác sĩ thành công') {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message || 'Không thể xóa bác sĩ');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi server khi xóa bác sĩ');
        }
    };

    // Xóa user (DELETE /user/:id)
    const deleteUser = async (userId) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.message === 'Xóa người dùng thành công') {
                toast.success(data.message);
                getAllUsers();
            } else {
                toast.error(data.message || 'Không thể xóa người dùng');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi server khi xóa người dùng');
        }
    };

    // Cập nhật bác sĩ (PUT /doctor-list/:id)
    const updateDoctor = async (doctorId, updatedData) => {
        try {
            const formData = new FormData();

            // Nếu có ảnh là file, thêm vào formData
            if (updatedData.image && updatedData.image instanceof File) {
                formData.append('image', updatedData.image);
                delete updatedData.image;
            }

            // Thêm các trường khác
            for (const key in updatedData) {
                if (key === 'address' && typeof updatedData[key] === 'object') {
                    formData.append(key, JSON.stringify(updatedData[key]));
                } else {
                    formData.append(key, updatedData[key]);
                }
            }

            const { data } = await axios.post( 
                `${backendUrl}/api/admin/doctor-list/${doctorId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (data.message === 'Cập nhật thông tin bác sĩ thành công') {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi server khi cập nhật bác sĩ');
        }
    };


    // Cập nhật user (PUT /users/:id)
    const updateUser = async (userId, updatedData) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/users/${userId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${aToken}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (data.success) {
                return true;
            } else {
                toast.error(data.message || 'Cập nhật thất bại');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi server khi cập nhật người dùng');
            return false;
        }
    };



    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, getDashData,
        confirmPayment,
        getDoctorDetails,
        deleteDoctor,
        updateDoctor,
        getAllUsers,
        getUserDetails,
        deleteUser,
        updateUser
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
