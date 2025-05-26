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
            <p className="text-gray-700 text-lg font-semibold mb-4">Browse through doctors by specialty</p>
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
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-2 cursor-pointer"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-72 object-cover object-top rounded-t-xl"
                                />
                                <div className="p-4 space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span>Available</span>
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
