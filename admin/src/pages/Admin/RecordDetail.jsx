import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext'; 
import dayjs from 'dayjs';
import {
    Stethoscope,
    FileText,
    AlertCircle,
    Pill,
    DollarSign,
    CreditCard,
    CalendarCheck
} from 'lucide-react';

const RecordDetail = () => {
    const { appointmentId } = useParams();
    const { aToken, backendUrl } = useContext(AdminContext);
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/admin/get-diagnosis/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${aToken}` },
                });
                if (res.data.success) {
                    setRecord(res.data.diagnosis);
                } else {
                    console.error('Không tìm thấy chẩn đoán');
                }
            } catch (error) {
                console.error('Lỗi khi lấy chẩn đoán:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        if (appointmentId && aToken && backendUrl) {
            fetchRecord();
        }
    }, [appointmentId, backendUrl, aToken]);

    if (loading) return <div className="p-6 text-center">Đang tải dữ liệu chẩn đoán...</div>;
    if (!record) return <div className="p-6 text-center text-red-500">Không tìm thấy chẩn đoán.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10 space-y-8">
            <h1 className="text-3xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
                <Stethoscope className="w-8 h-8" />
                Chi tiết chẩn đoán (Admin)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title="Chẩn đoán" icon={<Stethoscope />} content={record.diagnosis} />
                <InfoCard title="Ghi chú" icon={<FileText />} content={record.notes} />
                <InfoList title="Triệu chứng" icon={<AlertCircle />} items={record.symptoms} />
                <InfoList title="Phác đồ điều trị" icon={<FileText />} items={record.treatments} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center gap-2">
                    <Pill /> Đơn thuốc
                </h2>

                {record.medications.length > 0 ? (
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
                                {record.medications.map((med) => (
                                    <tr key={med._id || med.name}>
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
                    <span className="text-red-600 font-bold ml-1">{record.totalAmount.toLocaleString()}đ</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Trạng thái thanh toán:</span>
                    <span className={`font-bold ml-1 ${
                        record.paymentStatus === 'pending' ? 'text-yellow-500' :
                        record.paymentStatus === 'paid' ? 'text-green-600' :
                        'text-gray-500'
                    }`}>
                        {record.paymentStatus === 'pending' ? 'Chưa thanh toán' :
                            record.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Không xác định'}
                    </span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5" />
                    <span className="font-medium">Ngày khám:</span>
                    <span>
                        {dayjs(record.appointmentDate).isValid() 
                            ? dayjs(record.appointmentDate).format('DD/MM/YYYY') 
                            : 'Ngày không hợp lệ'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ title, icon, content }) => {
    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                {icon} {title}
            </h3>
            <p className="mt-2 whitespace-pre-wrap">{content || 'Không có dữ liệu'}</p>
        </div>
    );
};

const InfoList = ({ title, icon, items }) => {
    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                {icon} {title}
            </h3>
            {items.length > 0 ? (
                <ul className="mt-2 list-disc list-inside">
                    {items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-gray-500">Không có dữ liệu</p>
            )}
        </div>
    );
};

export default RecordDetail;
