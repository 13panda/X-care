import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
    const { speciality } = useParams()
    const [filterDoc, setFilterDoc] = useState([])
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        } else {
            setFilterDoc(doctors)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    const categories = [
        'Đa Khoa',
        'Khoa Phụ Sản',
        'Khoa Da Liễu',
        'Khoa Nhi',
        'Khoa Thần Kinh',
        'Khoa Tiêu Hóa'
    ]

    return (
        <div className="px-4 sm:px-8 py-6">
            <p className="text-gray-700 text-lg font-semibold mb-4">Danh sách bác sĩ theo chuyên Khoa</p>
            <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Filter list */}
                <div className="flex flex-col gap-3 text-sm text-gray-700 min-w-[200px] w-full sm:w-auto">
                    {
                        categories.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (speciality === item) navigate('/doctors')
                                    else navigate(`/doctors/${item}`)
                                }}
                                className={`text-left pl-4 pr-6 py-2 border rounded-md transition-all duration-300 cursor-pointer shadow-sm 
                                    ${speciality === item ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                            >
                                {item}
                            </button>
                        ))
                    }
                </div>

                {/* Doctor cards */}
                <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        filterDoc.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/appointment/${item._id}`)}
                                className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md transition-transform cursor-pointer
                hover:shadow-lg hover:-translate-y-2
                ${item.available ? '' : 'opacity-70 cursor-not-allowed'}`}
                                style={{ pointerEvents: item.available ? 'auto' : 'none' }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-72 object-cover object-top rounded-t-xl"
                                />
                                <div className="p-4 space-y-1.5">
                                    <div
                                        className="flex items-center gap-2 text-sm"
                                        style={{ color: item.available ? '#16a34a' : '#6b7280' }}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}
                                        ></span>
                                        <span>{item.available ? 'Đang hoạt động' : 'Not Available'}</span>
                                    </div>
                                    <p className="text-gray-900 text-lg font-semibold">{item.name}</p>
                                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default Doctors
