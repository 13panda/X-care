import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDoctorContext } from '../../context/DoctorContext';
import {
    Stethoscope,
    FileText,
    AlertCircle,
    Pill,
    DollarSign,
    CreditCard,
    CalendarCheck
} from 'lucide-react';

const DiagnosisDetail = () => {
    const { appointmentId } = useParams();
    const { dToken, backendUrl } = useDoctorContext();
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiagnosis = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/doctor/get-diagnosis/${appointmentId}`, {
                    headers: { dtoken: dToken },
                });

                if (res.data.success) {
                    setDiagnosis(res.data.diagnosis);
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
    }, [appointmentId]);

    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu chẩn đoán...</div>;
    if (!diagnosis) return <div className="p-6 text-center text-red-500">Không tìm thấy chẩn đoán.</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 space-y-8">
            <h1 className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
                <Stethoscope className="w-8 h-8" />
                Chi tiết chẩn đoán
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="Chẩn đoán" icon={<Stethoscope />} content={diagnosis.diagnosis} />
                <InfoCard title="Ghi chú" icon={<FileText />} content={diagnosis.notes || 'Không có ghi chú'} />
                <InfoList title="Triệu chứng" icon={<AlertCircle />} items={diagnosis.symptoms} />
                <InfoList title="Phác đồ điều trị" icon={<FileText />} items={diagnosis.treatments} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-2">
                    <Pill /> Đơn thuốc
                </h2>
                {diagnosis.medications.length > 0 ? (
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
                                    <tr key={med._id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{med.name}</td>
                                        <td className="border px-4 py-2">{med.dosage}</td>
                                        <td className="border px-4 py-2">{med.duration}</td>
                                        <td className="border px-4 py-2 text-right">{med.price.toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">Không có thuốc kê đơn</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Tổng tiền:</span>
                    <span className="text-red-600 font-bold ml-1">
                        {diagnosis.totalAmount.toLocaleString()}đ
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span
                        className={`font-bold ml-1 ${
                            diagnosis.paymentStatus === 'pending'
                                ? 'text-yellow-500'
                                : diagnosis.paymentStatus === 'paid'
                                ? 'text-green-600'
                                : 'text-gray-500'
                        }`}
                    >
                        {diagnosis.paymentStatus === 'pending'
                            ? 'Chưa thanh toán'
                            : diagnosis.paymentStatus === 'paid'
                            ? 'Đã thanh toán'
                            : 'Không xác định'}
                    </span>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5" />
                    <span className="font-medium">Ngày tạo chẩn đoán:</span>
                    <span className="ml-1">{new Date(diagnosis.createdAt).toLocaleString('vi-VN')}</span>
                </div>
            </div>
        </div>
    );
};

// Thẻ thông tin 1 dòng
const InfoCard = ({ title, icon, content }) => (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <p className="text-gray-700">{content}</p>
    </div>
);

// Danh sách các mục (triệu chứng, điều trị)
const InfoList = ({ title, icon, items }) => (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);

export default DiagnosisDetail;
