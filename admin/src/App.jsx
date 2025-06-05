import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import { useDoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorSchedule from './pages/Doctor/DoctorSchedule';
import DoctorDetail from './pages/Admin/DoctorDetail';
import UserList from './pages/Admin/UserList';
import UserDetail from './pages/Admin/UserDetail';
import MedicalRecords from './pages/Doctor/MedicalRecords';
import CreateDiagnosis from './pages/Doctor/CreateDiagnosis';
import DiagnosisDetail from './pages/Doctor/DiagnosisDetail';
import RecordMedical from './pages/Admin/RecordMedical';
import RecordDetail from './pages/Admin/RecordDetail';

const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useDoctorContext()

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* { ADMIN ROUTE } */}
          <Route path='/' element={<></>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorList />} />
          <Route path='/doctors-detail/:id' element={<DoctorDetail/>} />

          <Route path='/users' element={<UserList/>} />
          <Route path='/users-detail/:id' element={<UserDetail/>} />
          <Route path='/record-medical' element={<RecordMedical />} />
          <Route path='/record-detail/:appointmentId' element={<RecordDetail />} />


          {/* { DOCTOR ROUTE } */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointment />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-schedule' element={<DoctorSchedule />} />

          <Route path='/medical-records' element={<MedicalRecords />} />
          <Route path="/create-diagnosis/:appointmentId" element={<CreateDiagnosis />} />
          <Route path="/diagnosis-detail/:appointmentId" element={<DiagnosisDetail />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
