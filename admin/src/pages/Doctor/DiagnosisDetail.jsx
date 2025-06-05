import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs'; // Import dayjs
import { useDoctorContext } from '../../context/DoctorContext';
import {
    Stethoscope,
    FileText,
    AlertCircle,
    Pill,
    DollarSign,
    CreditCard,
    CalendarCheck,
    Pencil,
    Trash,
    PlusCircle,
    XCircle
} from 'lucide-react';

const DiagnosisDetail = () => {
    const { appointmentId } = useParams();
    const { dToken, backendUrl } = useDoctorContext();
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        diagnosis: '',
        notes: '',
        symptoms: [],
        treatments: [],
        medications: [],
    });

    useEffect(() => {
        const fetchDiagnosis = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/doctor/get-diagnosis/${appointmentId}`, {
                    headers: { dtoken: dToken },
                });

                if (res.data.success) {
                    const d = res.data.diagnosis;
                    setDiagnosis(d);
                    setFormData({
                        diagnosis: d.diagnosis || '',
                        notes: d.notes || '',
                        symptoms: d.symptoms || [],
                        treatments: d.treatments || [],
                        medications: d.medications || [],
                    });
                } else {
                    console.error('Không tìm thấy chẩn đoán');
                }
            } catch (error) {
                console.error('Lỗi khi lấy chẩn đoán:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnosis();
    }, [appointmentId, backendUrl, dToken]);

    const handleUpdate = async () => {
        try {
            if (!formData.diagnosis.trim()) {
                alert('Chẩn đoán không được để trống');
                return;
            }
            const res = await axios.post(`${backendUrl}/api/doctor/update-diagnosis/${diagnosis._id}`, formData, {
                headers: { dtoken: dToken },
            });
            if (res.data.success) {
                setDiagnosis({ ...diagnosis, ...formData });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error.response?.data || error.message);
            alert('Cập nhật thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xoá chẩn đoán này?')) return;
        try {
            const res = await axios.delete(`${backendUrl}/api/doctor/delete-diagnosis/${diagnosis._id}`, {
                headers: { dtoken: dToken },
            });
            if (res.data.success) {
                alert('Đã xoá chẩn đoán thành công.');
                window.location.href = '/appointments';
            }
        } catch (error) {
            console.error('Lỗi khi xoá:', error.response?.data || error.message);
        }
    };

    const handleMedicationChange = (index, field, value) => {
        const meds = [...formData.medications];
        meds[index] = { ...meds[index], [field]: value };
        setFormData({ ...formData, medications: meds });
    };

    const handleAddMedication = () => {
        const meds = [...formData.medications];
        meds.push({ name: '', dosage: '', duration: '', price: 0 });
        setFormData({ ...formData, medications: meds });
    };

    const handleRemoveMedication = (index) => {
        const meds = [...formData.medications];
        meds.splice(index, 1);
        setFormData({ ...formData, medications: meds });
    };

    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu chẩn đoán...</div>;
    if (!diagnosis) return <div className="p-6 text-center text-red-500">Không tìm thấy chẩn đoán.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 space-y-8">
            <h1 className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
                <Stethoscope className="w-8 h-8" />
                Chi tiết chẩn đoán
            </h1>

            <div className="flex justify-end gap-4">
                {!isEditing && (
                    <>
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                            <Pencil className="w-4 h-4" /> Sửa chẩn đoán
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            <Trash className="w-4 h-4" /> Xoá chẩn đoán
                        </button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    title="Chẩn đoán"
                    icon={<Stethoscope />}
                    content={formData.diagnosis}
                    editable
                    fieldName="diagnosis"
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                />
                <InfoCard
                    title="Ghi chú"
                    icon={<FileText />}
                    content={formData.notes}
                    editable
                    fieldName="notes"
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                />
                <InfoList
                    title="Triệu chứng"
                    icon={<AlertCircle />}
                    items={formData.symptoms}
                    editable
                    fieldName="symptoms"
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                />
                <InfoList
                    title="Phác đồ điều trị"
                    icon={<FileText />}
                    items={formData.treatments}
                    editable
                    fieldName="treatments"
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-2">
                    <Pill /> Đơn thuốc
                </h2>

                {isEditing ? (
                    <>
                        {formData.medications.map((med, index) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Tên thuốc"
                                    className="border rounded px-2 py-1 flex-grow"
                                    value={med.name}
                                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Liều dùng"
                                    className="border rounded px-2 py-1 w-32"
                                    value={med.dosage}
                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Thời gian"
                                    className="border rounded px-2 py-1 w-32"
                                    value={med.duration}
                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Giá (đ)"
                                    className="border rounded px-2 py-1 w-24"
                                    value={med.price}
                                    onChange={(e) => handleMedicationChange(index, 'price', Number(e.target.value))}
                                />
                                <button
                                    type="button"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleRemoveMedication(index)}
                                    title="Xoá thuốc"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={handleAddMedication}
                        >
                            <PlusCircle size={20} /> Thêm thuốc
                        </button>
                    </>
                ) : diagnosis.medications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm">
                            <thead className="bg-blue-100 text-blue-800">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Tên thuốc</th>
                                    <th className="border px-4 py-2 text-left">Liều dùng</th>
                                    <th className="border px-4 py-2 text-left">Thời gian</th>
                                    <th className="border px-4 py-2 text-right">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diagnosis.medications.map((med) => (
                                    <tr key={med._id}>
                                        <td className="border px-4 py-2">{med.name}</td>
                                        <td className="border px-4 py-2">{med.dosage}</td>
                                        <td className="border px-4 py-2">{med.duration}</td>
                                        <td className="border px-4 py-2 text-right">{med.price.toLocaleString()} đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không có thuốc nào.</p>
                )}
            </div>

            <div className="text-right text-lg font-semibold text-green-700">
                Tổng tiền thuốc: {diagnosis.medications.reduce((sum, med) => sum + (med.price || 0), 0).toLocaleString()} đ
            </div>

            <div className="text-center">
                {isEditing ? (
                    <>
                        <button
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
                            onClick={handleUpdate}
                        >
                            Lưu
                        </button>
                        <button
                            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            onClick={() => setIsEditing(false)}
                        >
                            Huỷ
                        </button>
                    </>
                ) : null}
            </div>

            <div className="mt-6 p-4 border rounded-lg bg-blue-50 text-blue-700 flex items-center gap-2 justify-center">
                <CalendarCheck /> Ngày khám: {dayjs(diagnosis.appointmentDate).format('DD/MM/YYYY')}
            </div>
        </div>
    );
};

// Các component con hỗ trợ
const InfoCard = ({ title, icon, content, editable, fieldName, formData, setFormData, isEditing }) => {
    return (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-3">
                {icon} {title}
            </h3>
            {isEditing && editable ? (
                <textarea
                    className="w-full border rounded p-2 resize-y"
                    rows={4}
                    value={formData[fieldName]}
                    onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
                />
            ) : (
                <p className="whitespace-pre-wrap">{content || 'Chưa có thông tin'}</p>
            )}
        </div>
    );
};

const InfoList = ({ title, icon, items, editable, fieldName, formData, setFormData, isEditing }) => {
    const handleAddItem = () => {
        const newItems = [...formData[fieldName], ''];
        setFormData({ ...formData, [fieldName]: newItems });
    };

    const handleChangeItem = (index, value) => {
        const newItems = [...formData[fieldName]];
        newItems[index] = value;
        setFormData({ ...formData, [fieldName]: newItems });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...formData[fieldName]];
        newItems.splice(index, 1);
        setFormData({ ...formData, [fieldName]: newItems });
    };

    return (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-3">
                {icon} {title}
            </h3>
            {isEditing && editable ? (
                <>
                    {items.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center mb-2">
                            <input
                                type="text"
                                className="border rounded px-2 py-1 flex-grow"
                                value={item}
                                onChange={(e) => handleChangeItem(i, e.target.value)}
                            />
                            <button
                                type="button"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleRemoveItem(i)}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        onClick={handleAddItem}
                    >
                        <PlusCircle size={20} /> Thêm
                    </button>
                </>
            ) : items.length > 0 ? (
                <ul className="list-disc list-inside">
                    {items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p>Chưa có thông tin.</p>
            )}
        </div>
    );
};

export default DiagnosisDetail;
