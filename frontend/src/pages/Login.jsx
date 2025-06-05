import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { backendUrl, token, setToken } = useContext(AppContext)
    const navigate = useNavigate()

    const [state, setState] = useState('Đăng ký')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (state === 'Đăng ký') {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                    toast.success('Đăng ký thành công!')
                } else {
                    // Trường hợp API trả về success = false
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                    toast.success('Đăng nhập thành công!')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            // Trường hợp lỗi do mạng hoặc lỗi server
            if (error.response && error.response.data && error.response.data.message) {
                // Lấy thông báo lỗi cụ thể từ backend
                toast.error('Lỗi: ' + error.response.data.message)
            } else {
                // Lỗi không xác định hoặc lỗi ngoài mong đợi
                toast.error('Đã xảy ra lỗi: ' + error.message)
            }
        }
    }


    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token])

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800">
                    {state === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập'}
                </h2>
                <p className="text-gray-500">
                    Vui lòng {state === 'Đăng ký' ? 'đăng ký' : 'đăng nhập'} để đặt lịch hẹn
                </p>

                {state === 'Đăng ký' && (
                    <div>
                        <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                        <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark transition text-white w-full py-2 rounded-md text-base font-medium"
                >
                    {state === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập'}
                </button>

                <p className="text-sm text-gray-500">
                    {state === 'Đăng ký' ? (
                        <>
                            Đã có tài khoản?{' '}
                            <span
                                onClick={() => setState('Đăng nhập')}
                                className="text-primary hover:underline cursor-pointer">
                                Đăng nhập
                            </span>
                        </>
                    ) : (
                        <>
                            Chưa có tài khoản?{' '}
                            <span
                                onClick={() => setState('Đăng ký')}
                                className="text-primary hover:underline cursor-pointer"
                            >
                                Đăng ký
                            </span>
                        </>
                    )}
                </p>
            </div>
        </form>
    )
}

export default Login
