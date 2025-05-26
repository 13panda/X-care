import React, { useState } from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

const DoctorProfile = () => {
    const {
        docData, setDocData,
        dToken, backendUrl,
        getDoctorProfile
    } = useDoctorContext();

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const updateDoctorProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('name', docData.name);
            formData.append('email', docData.email);
            formData.append('speciality', docData.speciality);
            formData.append('degree', docData.degree);
            formData.append('experience', docData.experience);
            formData.append('about', docData.about);
            formData.append('fees', docData.fees);
            formData.append('address', JSON.stringify(docData.address));
            if (image) formData.append('image', image);

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, formData, {
                headers: { dToken }
            });

            if (data.success) {
                toast.success(data.message || "Profile updated");
                await getDoctorProfile();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleSaveClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmUpdate = () => {
        setShowConfirmDialog(false);
        updateDoctorProfile();
    };

    return docData && (
        <div className="max-w-5xl mx-auto mt-6 p-8 bg-white rounded-xl shadow-sm text-sm space-y-8">
            <div className="flex flex-col items-center gap-4 mb-6">
                {isEdit ? (
                    <label htmlFor="image" className="relative group cursor-pointer w-36 h-36">
                        <img
                            className="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow group-hover:opacity-70 transition"
                            src={image ? URL.createObjectURL(image) : docData.image}
                            alt="avatar"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <img className="w-6 h-6" src={assets.upload_icon} alt="upload" />
                        </div>
                        <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                ) : (
                    <img
                        className="w-36 h-36 rounded-full object-cover border-2 border-blue-500 shadow"
                        src={docData?.image}
                        alt="avatar"
                    />
                )}

                {isEdit ? (
                    <input
                        type="text"
                        className="text-2xl font-semibold bg-gray-50 border border-gray-300 rounded-md px-4 py-2 w-full max-w-md text-center"
                        value={docData.name}
                        onChange={e => setDocData(prev => ({ ...prev, name: e.target.value }))}
                    />
                ) : (
                    <h2 className="text-2xl font-bold text-neutral-800 text-center">{docData.name}</h2>
                )}
            </div>

            <div className="flex gap-12 max-w-4xl mx-auto">
                <div className="flex-1 max-w-[320px] min-w-[320px]">
                    <h3 className="text-base font-semibold text-blue-800 mb-3">Information</h3>
                    <div className="space-y-3">
                        <InfoRow label="Email:" value={docData.email} />
                        <EditableRow label="Specialty:" value={docData.speciality} isEdit={isEdit} onChange={val => setDocData(prev => ({ ...prev, speciality: val }))} fixedWidthInput="260px" />
                        <EditableRow label="Degree:" value={docData.degree} isEdit={isEdit} onChange={val => setDocData(prev => ({ ...prev, degree: val }))} fixedWidthInput="260px" />
                        <EditableRow label="Experience:" value={docData.experience} isEdit={isEdit} onChange={val => setDocData(prev => ({ ...prev, experience: val }))} fixedWidthInput="260px" />
                        <EditableRow label="Fee:" value={docData.fees} isEdit={isEdit} onChange={val => setDocData(prev => ({ ...prev, fees: val }))} fixedWidthInput="260px" />
                    </div>
                </div>

                <div className="flex-1 max-w-[480px] min-w-[480px] flex flex-col gap-8">
                    <div className="h-[180px]">
                        <h3 className="text-base font-semibold text-blue-800 mb-2">About</h3>
                        {isEdit ? (
                            <textarea
                                className="w-full h-full bg-gray-50 border border-gray-300 rounded-md p-3 leading-relaxed text-gray-800 resize-none"
                                value={docData.about}
                                onChange={e => setDocData(prev => ({ ...prev, about: e.target.value }))}
                                style={{ fontSize: '1rem', lineHeight: '1.5rem' }}
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed h-full overflow-auto">{docData.about}</p>
                        )}
                    </div>

                    <div className="h-[100px]">
                        <h3 className="text-base font-semibold text-blue-800 mb-2">Address</h3>
                        {isEdit ? (
                            <div className="flex flex-col gap-2 h-full">
                                <input
                                    className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-gray-800"
                                    placeholder="Line 1"
                                    value={docData?.address?.line1 || ''}
                                    onChange={e => setDocData(prev => ({ ...prev, address: { ...(prev.address || {}), line1: e.target.value } }))}
                                    style={{ fontSize: '1rem', lineHeight: '1.5rem', width: '100%' }}
                                />
                                <input
                                    className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-gray-800"
                                    placeholder="Line 2"
                                    value={docData?.address?.line2 || ''}
                                    onChange={e => setDocData(prev => ({ ...prev, address: { ...(prev.address || {}), line2: e.target.value } }))}
                                    style={{ fontSize: '1rem', lineHeight: '1.5rem', width: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="text-gray-700 space-y-1 h-full overflow-auto">
                                <p>{docData?.address?.line1}</p>
                                <p>{docData?.address?.line2}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                {isEdit ? (
                    <button onClick={handleSaveClick} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                        Save Information
                    </button>
                ) : (
                    <button onClick={() => setIsEdit(true)} className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition">
                        Edit
                    </button>
                )}
            </div>

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmUpdate}
                title="Confirm Update"
                message="Are you sure you want to update your profile information?"
            />
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex gap-4">
        <span className="font-medium w-32 text-gray-500">{label}</span>
        <span className="text-gray-800 break-words">{value}</span>
    </div>
);

const EditableRow = ({ label, value, isEdit, onChange, fixedWidthInput }) => (
    <div className="flex gap-4 items-center">
        <span className="font-medium w-32 text-gray-500">{label}</span>
        {isEdit ? (
            <input
                className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-800"
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ width: fixedWidthInput || '260px', fontSize: '1rem', lineHeight: '1.5rem' }}
            />
        ) : (
            <span className="text-gray-800 break-words" style={{ display: 'inline-block', width: fixedWidthInput || '260px' }}>
                {value}
            </span>
        )}
    </div>
);

export default DoctorProfile;
