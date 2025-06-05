import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getUserDetails, deleteUser, updateUser } = useContext(AdminContext);

    const [user, setUser] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmEdit, setShowConfirmEdit] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        dob: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserDetails(id);
                if (data && data.user) {
                    setUser(data.user);
                    setEditForm({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        dob: data.user.dob || '',
                        phone: data.user.phone || '',
                    });
                } else {
                    toast.error('Không tìm thấy người dùng.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                toast.error('Lỗi khi lấy thông tin người dùng.');
            }
        };

        fetchUser();
    }, [id, getUserDetails]);

    const handleDelete = async () => {
        try {
            await deleteUser(id);
            navigate('/users');
        } catch (error) {
            console.error('Lỗi khi xoá người dùng:', error);
            toast.error('Xoá người dùng thất bại');
        }
        setShowDeleteDialog(false);
    };

    const handleConfirmEdit = async () => {
        try {
            await updateUser(id, editForm);
            toast.success('Cập nhật thành công');
            const data = await getUserDetails(id);
            if (data && data.user) {
                setUser(data.user);
                setShowEditModal(false);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
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

    if (!user) return <p className="p-6 text-center text-gray-600">Đang tải thông tin người dùng...</p>;

    return (
        <div className="w-full max-w-3xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-xl text-sm space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <img
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        src={user.image || '/default-avatar.png'}
                        alt="avatar"
                    />
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">Chỉnh sửa</button>
                    <button onClick={() => setShowDeleteDialog(true)} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">Xoá</button>
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowEditModal(false)} />
                    <div className="relative z-10 bg-white rounded-xl p-6 max-w-lg w-full overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 border-b pb-2">Chỉnh sửa người dùng</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={editForm.dob}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
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
                message="Bạn có chắc chắn muốn cập nhật thông tin người dùng này không?"
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Xoá người dùng"
                message="Bạn có chắc chắn muốn xoá người dùng này không? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default UserDetail;
