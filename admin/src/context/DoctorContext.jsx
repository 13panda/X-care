import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();
export const useDoctorContext = () => useContext(DoctorContext);

const DoctorContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [docData, setDocData] = useState(false);

    const [diagnoses, setDiagnoses] = useState([]);


    const getAppointments = async () => {
        if (!dToken) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: { dToken },
            });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message || "Failed to fetch appointments.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error fetching appointments.");
        }
    };

    // GET Doctor Profile
    const getDoctorProfile = async () => {
        if (!dToken) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: { dToken },
            });
            if (data.success) {
                setDocData(data.doctor);
            } else {
                toast.error(data.message || "Failed to fetch doctor profile.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching doctor profile.");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            if (!dToken) {
                toast.error("Token is missing!");
                return;
            }

            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message || "Appointment canceled");
                getAppointments(); // cập nhật lại danh sách sau khi hủy
            } else {
                toast.error(data.message || "Failed to cancel appointment");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error canceling appointment");
        }
    };

    // DoctorContext.js

    const requestScheduleUpdate = async (newSchedule) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/schedule-request`,
                { workingScheduleRequest: newSchedule },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message || "Gửi yêu cầu thành công");
                getDoctorProfile(); // cập nhật lại context
            } else {
                toast.error(data.message || "Không gửi được yêu cầu");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi gửi yêu cầu");
        }
    };

    const createDiagnosis = async (diagnosisData) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/diagnosis`,
                diagnosisData,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success("Tạo chẩn đoán thành công!");
                getAppointments(); // cập nhật lại danh sách lịch hẹn
                return data.diagnosis;
            } else {
                toast.error(data.message || "Tạo chẩn đoán thất bại.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tạo chẩn đoán.");
        }
    };

    // Lấy danh sách chẩn đoán của bác sĩ
    const getDoctorDiagnoses = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/diagnoses`,
                { headers: { dToken } }
            );

            if (data.success) {
                setDiagnoses(data.diagnoses);
            } else {
                toast.error(data.message || "Không lấy được danh sách chẩn đoán.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lấy danh sách chẩn đoán.");
        }
    };

    // Cập nhật trạng thái thanh toán
    const updatePaymentStatus = async (diagnosisId, paymentStatus) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/doctor/diagnosis/${diagnosisId}/payment`,
                { paymentStatus },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success("Cập nhật trạng thái thanh toán thành công!");
                getDoctorDiagnoses(); // cập nhật danh sách chẩn đoán sau khi cập nhật
            } else {
                toast.error(data.message || "Không cập nhật được trạng thái.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật trạng thái thanh toán.");
        }
    };



    useEffect(() => {
        if (dToken) {
            getAppointments();
            getDoctorProfile();
        } else {
            setAppointments([]);
            setDocData(false);
        }
    }, [dToken]);

    const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    setAppointments,
    docData,
    setDocData,
    getAppointments,
    getDoctorProfile,
    cancelAppointment,
    requestScheduleUpdate,

    // new
    diagnoses,
    getDoctorDiagnoses,
    createDiagnosis,
    updatePaymentStatus
};


    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
