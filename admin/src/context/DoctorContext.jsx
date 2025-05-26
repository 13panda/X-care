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
        requestScheduleUpdate
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
