import React from 'react'
import { Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import AdminDoctors from '../pages/AdminDoctors'
import AdminAppointments from '../pages/AdminAppointments'
import AdminScheduleManagement from '../components/AdminScheduleManagement'

const AdminRoute = () => {
    const admin = localStorage.getItem('token')
    if (!admin) {
        return <Navigate to="/admin/login" />
    }
    return (
        <div>
            <AdminDashboard />
            <div className="p-4">
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/doctors" element={<AdminDoctors />} />
                    <Route path="/appointments" element={<AdminAppointments />} />
                    <Route path="/schedule-management" element={<AdminScheduleManagement />} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminRoute 