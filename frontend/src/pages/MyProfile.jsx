import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            if (image) formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
                headers: { token }
            })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData && (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md text-sm space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
                {
                    isEdit ? (
                        <label htmlFor="image" className="relative cursor-pointer group">
                            <img
                                className="w-36 h-36 rounded-full object-cover opacity-80 group-hover:opacity-60 transition"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="avatar"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition">
                                <img className="w-8 h-8" src={assets.upload_icon} alt="upload" />
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                        </label>
                    ) : (
                        <img className="w-36 h-36 rounded-full object-cover" src={userData?.image || ''} alt="avatar" />
                    )
                }
            </div>

            {/* Tên người dùng */}
            <div className="text-center">
                {
                    isEdit ? (
                        <input
                            type="text"
                            className="text-3xl font-semibold text-center bg-gray-50 border border-gray-300 rounded-md px-4 py-1 w-full max-w-md"
                            value={userData?.name || ''}
                            onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    ) : (
                        <h2 className="text-3xl font-bold text-neutral-800">{userData?.name}</h2>
                    )
                }
            </div>

            <hr className="border-t border-gray-300" />

            {/* Thông tin liên hệ */}
            <div>
                <h3 className="text-neutral-600 font-semibold mb-3">Thông tin liên hệ</h3>
                <div className="space-y-3">
                    <div className="flex gap-4">
                        <span className="font-medium w-24">Email:</span>
                        <span className="text-blue-600">{userData?.email}</span>
                    </div>

                    <div className="flex gap-4">
                        <span className="font-medium w-24">SĐT:</span>
                        {isEdit ? (
                            <input
                                className="bg-gray-100 border px-2 rounded w-52"
                                type="text"
                                value={userData?.phone || ''}
                                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        ) : (
                            <span className="text-blue-500">{userData?.phone}</span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <span className="font-medium w-24">Địa chỉ:</span>
                        {isEdit ? (
                            <div className="flex flex-col gap-1">
                                <input
                                    className="bg-gray-50 border px-2 rounded"
                                    placeholder="Địa chỉ dòng 1"
                                    value={userData?.address?.line1 || ''}
                                    onChange={e => setUserData(prev => ({
                                        ...prev,
                                        address: {
                                            ...(prev?.address || {}),
                                            line1: e.target.value
                                        }
                                    }))}
                                />
                                <input
                                    className="bg-gray-50 border px-2 rounded"
                                    placeholder="Địa chỉ dòng 2"
                                    value={userData?.address?.line2 || ''}
                                    onChange={e => setUserData(prev => ({
                                        ...prev,
                                        address: {
                                            ...(prev?.address || {}),
                                            line2: e.target.value
                                        }
                                    }))}
                                />
                            </div>
                        ) : (
                            <div className="text-gray-500">
                                <p>{userData?.address?.line1}</p>
                                <p>{userData?.address?.line2}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Thông tin cơ bản */}
            <div>
                <h3 className="text-neutral-600 font-semibold mt-4 mb-3">Thông tin cơ bản</h3>
                <div className="space-y-3">
                    <div className="flex gap-4">
                        <span className="font-medium w-24">Giới tính:</span>
                        {isEdit ? (
                            <select
                                className="bg-gray-100 border rounded px-2"
                                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                value={userData?.gender || ''}
                            >
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                            </select>
                        ) : (
                            <span className="text-gray-600">{userData?.gender}</span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <span className="font-medium w-24">Ngày sinh:</span>
                        {isEdit ? (
                            <input
                                className="bg-gray-100 border rounded px-2"
                                type="date"
                                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                value={userData?.dob || ''}
                            />
                        ) : (
                            <span className="text-gray-600">{userData?.dob}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Nút hành động */}
            <div className="text-center mt-6">
                {
                    isEdit ? (
                        <button
                            onClick={updateUserProfileData}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            Lưu thông tin
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEdit(true)}
                            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
                        >
                            Chỉnh sửa
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default MyProfile
