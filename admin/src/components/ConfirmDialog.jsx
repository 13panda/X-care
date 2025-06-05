// components/ConfirmDialog.js
import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999]">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>

                {typeof message === 'string' ? (
                    <p className="mb-6 text-gray-700">{message}</p>
                ) : (
                    <div className="mb-6 text-gray-700">{message}</div>
                )}

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel} // ✅ Đã sửa từ onClose → onCancel
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ConfirmDialog;
