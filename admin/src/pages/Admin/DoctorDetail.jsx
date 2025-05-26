import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDoctorDetails, deleteDoctor, adminUpdateDoctor } = useContext(AdminContext);

    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        speciality: '',
        degree: '',
        fees: '',
        email: '',
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const data = await getDoctorDetails(id);
                if (data && data.doctor) {
                    setDoctor(data.doctor);
                    setAppointments(data.appointments || []);
                    setEditForm({
                        name: data.doctor.name || '',
                        speciality: data.doctor.speciality || '',
                        degree: data.doctor.degree || '',
                        fees: data.doctor.fees !== undefined && data.doctor.fees !== null ? String(data.doctor.fees) : '',
                        email: data.doctor.email || '',
                    });
                } else {
                    toast.error('Không tìm thấy bác sĩ.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin bác sĩ:', error);
                toast.error('Lỗi khi lấy thông tin bác sĩ.');
            }
        };

        fetchDoctor();
    }, [id, getDoctorDetails]);

    const handleDelete = async () => {
        try {
            await deleteDoctor(id);
            toast.success('Xoá bác sĩ thành công');
            navigate('/doctor-list');
        } catch (error) {
            console.error('Lỗi khi xoá bác sĩ:', error);
            toast.error('Xoá bác sĩ thất bại');
        }
        setShowDeleteDialog(false);
    };

    const handleConfirmEdit = async () => {
        try {
            const updatedData = {
                ...editForm,
                fees: Number(editForm.fees),
            };
            await adminUpdateDoctor(id, updatedData);
            toast.success('Cập nhật thành công');
            const data = await getDoctorDetails(id);
            if (data && data.doctor) {
                setDoctor(data.doctor);
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật bác sĩ:', error);
            toast.error('Cập nhật thất bại');
        }
        setShowConfirmEdit(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!doctor) return <p className="p-6 text-center text-gray-600">Đang tải thông tin bác sĩ...</p>;

    const InfoRow = ({ label, value }) => (
        <div className="flex gap-2 sm:gap-4">
            <span className="font-medium w-24 sm:w-32 text-gray-500">{label}</span>
            <span className="text-gray-800 break-words">{value}</span>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-xl text-sm space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <img
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        src={doctor.image}
                        alt="avatar"
                    />
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800">{doctor.name}</h2>
                        <p className="text-blue-600 font-medium mt-1">{doctor.speciality}</p>
                        <p className="text-sm text-gray-500 mt-1">{doctor.email}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Chỉnh sửa</button>
                    <button onClick={() => setShowDeleteDialog(true)} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">Xoá</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow label="Phí khám" value={doctor.fees?.toLocaleString() + ' VND'} />
                <InfoRow label="Chuyên khoa" value={doctor.speciality} />
                <InfoRow label="Bằng cấp" value={doctor.degree} />
                <InfoRow label="Email" value={doctor.email} />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b pb-2">Lịch hẹn</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-500">Không có lịch hẹn nào.</p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {appointments.map((app) => (
                            <li key={app._id} className="p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50">
                                <p><strong className="text-gray-600">Ngày:</strong> {new Date(app.appointmentDate).toLocaleDateString()}</p>
                                <p><strong className="text-gray-600">Giờ:</strong> {app.slotTime}</p>
                                <p className="flex items-center gap-2">
                                    <strong className="text-gray-600">Trạng thái:</strong>
                                    {app.cancelled ? (
                                        <span className="text-red-600 font-semibold">Đã huỷ</span>
                                    ) : app.confirmed ? (
                                        <span className="text-green-600 font-semibold">Đã xác nhận</span>
                                    ) : (
                                        <span className="text-yellow-600 font-semibold">Đang chờ</span>
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">Chỉnh sửa bác sĩ</h3>
                        <div className="space-y-4">
                            {['name', 'speciality', 'degree', 'fees', 'email'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-700">{field === 'name' ? 'Tên' : field === 'speciality' ? 'Chuyên khoa' : field === 'degree' ? 'Bằng cấp' : field === 'fees' ? 'Phí khám' : 'Email'}</label>
                                    <input
                                        type={field === 'fees' ? 'number' : field === 'email' ? 'email' : 'text'}
                                        name={field}
                                        value={editForm[field]}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-4 pt-4">
                                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Huỷ</button>
                                <button onClick={() => setShowConfirmEdit(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={showConfirmEdit}
                onClose={() => setShowConfirmEdit(false)}
                onConfirm={handleConfirmEdit}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn cập nhật thông tin bác sĩ này không?"
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Xoá bác sĩ"
                message="Bạn có chắc chắn muốn xoá bác sĩ này không? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default DoctorDetail;
