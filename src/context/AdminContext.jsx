const getDoctorDetails = async (doctorId) => {
    try {
        if (!aToken) {
            toast.error('Token is missing!');
            return null;
        }

        const { data } = await axios.get(`${backendUrl}/api/admin/doctor-list/${doctorId}`, {
            headers: {
                Authorization: `Bearer ${aToken}`
            }
        });

        if (data.success) {
            return data; // trả về data chứa doctor và appointments
        } else {
            toast.error(data.message);
            return null;
        }
    } catch (error) {
        toast.error(error.message);
        return null;
    }
}; 