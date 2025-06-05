import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';
import dayjs from 'dayjs';

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getDoctorDetails, deleteDoctor, updateDoctor } = useContext(AdminContext);

    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        speciality: '',
        degree: '',
        email: '',
    });

    const [image, setImage] = useState(null);

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
                        email: data.doctor.email || '',
                    });
                    setImage(null);
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
                name: editForm.name,
                email: editForm.email,
                speciality: editForm.speciality,
                degree: editForm.degree,
            };
            if (image) updatedData.image = image;

            await updateDoctor(id, updatedData);

            const data = await getDoctorDetails(id);
            if (data && data.doctor) {
                toast.success('Cập nhật thông tin thành công');
                setDoctor(data.doctor);
                setShowEditModal(false);
                setImage(null);
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
                        src={image ? URL.createObjectURL(image) : doctor.image}
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
                                <p>
                                    <strong className="text-gray-600">Ngày:</strong>{' '}
                                    {dayjs(app.appointmentDate).isValid()
                                        ? dayjs(app.appointmentDate).format('DD/MM/YYYY')
                                        : 'Không xác định'}
                                </p>
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
                            {['name', 'speciality', 'degree', 'email'].map((field) => (
                                <label key={field} className="block">
                                    <span className="text-gray-700 font-medium capitalize">{field}</span>
                                    <input
                                        type="text"
                                        name={field}
                                        value={editForm[field]}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                            ))}

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 rounded-xl border border-gray-400 hover:bg-gray-100 transition"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={() => setShowConfirmEdit(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={showConfirmEdit}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn cập nhật thông tin bác sĩ không?"
                onConfirm={handleConfirmEdit}
                onCancel={() => setShowConfirmEdit(false)}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Xác nhận xoá"
                message="Bạn có chắc chắn muốn xoá bác sĩ này không? Hành động không thể hoàn tác."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
};

export default DoctorDetail;
