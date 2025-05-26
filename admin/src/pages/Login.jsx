import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { useDoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAToken, backendUrl } = useContext(AdminContext);
    const { setDToken } = useDoctorContext();

    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl+'/api/admin/login', { email, password });

                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success('Welcome Admin!');
                    setTimeout(() => navigate('/admin-dashboard'), 100); 
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl+'/api/doctor/login', { email, password });

                if (data.success) {
                    localStorage.setItem('dToken', data.token);
                    setDToken(data.token);
                    toast.success('Welcome Doctor!');
                    setTimeout(() => navigate('/doctor-dashboard'), 100); 
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again later.');
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className='min-h-screen flex items-center bg-gradient-to-r from-blue-400 to-purple-600'
        >
            <div className='flex flex-col gap-6 m-auto items-center p-10 bg-white shadow-lg rounded-xl w-full sm:w-96'>
                <p className='text-3xl font-semibold text-gray-800 mb-6'>
                    <span className='text-primary'>{state}</span> Login
                </p>

                {/* Email */}
                <div className='w-full'>
                    <p className='text-gray-600'>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border border-[#DADADA] rounded-xl w-full p-3 mt-1 focus:ring-2 focus:ring-primary'
                        type='email'
                        placeholder='Enter your email'
                        required
                    />
                </div>

                {/* Password */}
                <div className='w-full'>
                    <p className='text-gray-600'>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border border-[#DADADA] rounded-xl w-full p-3 mt-1 focus:ring-2 focus:ring-primary'
                        type='password'
                        placeholder='Enter your password'
                        required
                    />
                </div>

                <button className='bg-primary text-white w-full py-3 rounded-md text-lg transition-all transform hover:scale-105'>
                    Login
                </button>

                {/* Switch */}
                <p className='text-center text-sm text-gray-600 mt-4'>
                    {state === 'Admin' ? 'Doctor Login?' : 'Admin Login?'}
                    <span
                        className='text-primary underline cursor-pointer ml-1'
                        onClick={() => setState(state === 'Admin' ? 'Doctor' : 'Admin')}
                    >
                        Click here
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Login;
