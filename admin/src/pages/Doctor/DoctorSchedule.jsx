import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import { useDoctorContext } from '../../context/DoctorContext';

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const generateInitialSchedule = () => {
    const schedule = {};
    for (let i = 0; i < 15; i++) {
        const date = moment().add(i, 'days').format("YYYY-MM-DD");
        schedule[date] = [];
    }
    return schedule;
};

const DoctorSchedule = () => {
    const { docData, requestScheduleUpdate } = useDoctorContext();
    const [newSchedule, setNewSchedule] = useState(generateInitialSchedule());
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const availableDates = Object.keys(newSchedule);

    const toggleSlot = (date, time) => {
        const slots = newSchedule[date] || [];
        const updatedSlots = slots.includes(time)
            ? slots.filter(slot => slot !== time)
            : [...slots, time];

        setNewSchedule(prev => ({
            ...prev,
            [date]: updatedSlots
        }));
    };

    const handleSubmit = () => {
        requestScheduleUpdate(newSchedule);
    };

    const isDateSelectable = (date) => {
        const dateStr = moment(date).format("YYYY-MM-DD");
        return availableDates.includes(dateStr);
    };

    return (
        <div className='p-6 max-w-5xl mx-auto'>
            <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>Work Schedule Management</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {/* Calendar */}
                <div className='bg-white p-6 rounded-xl shadow'>
                    <h3 className='text-lg font-semibold mb-4'>Select working days (next 15 days)</h3>
                    <Calendar
                        locale="en"
                        onChange={(date) => {
                            const dateStr = moment(date).format("YYYY-MM-DD");
                            if (availableDates.includes(dateStr)) {
                                setSelectedDate(dateStr);
                            }
                        }}
                        tileDisabled={({ date }) => !isDateSelectable(date)}
                        tileClassName={({ date }) => {
                            const dateStr = moment(date).format("YYYY-MM-DD");

                            if (!availableDates.includes(dateStr)) return 'pointer-events-none opacity-30';

                            return dateStr === selectedDate
                                ? 'bg-blue-600 text-white font-bold rounded-md'
                                : 'bg-blue-50 text-blue-900 font-medium hover:bg-blue-100 rounded-md';
                        }}
                        className="w-full border-none"
                    />
                </div>

                {/* Time slots */}
                <div className='bg-white p-6 rounded-xl shadow'>
                    <h3 className='text-lg font-semibold mb-4 text-gray-700'>
                        Select time slots for <span className='text-blue-600'>{moment(selectedDate).format("DD/MM/YYYY")}</span>
                    </h3>
                    <div className='flex flex-wrap gap-3'>
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => toggleSlot(selectedDate, time)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
                                    ${newSchedule[selectedDate]?.includes(time)
                                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className='text-center mt-4'>
                <button
                    onClick={handleSubmit}
                    className='px-8 py-3 bg-green-600 text-white font-semibold text-lg rounded-full hover:bg-green-700 transition-all'
                >
                    Submit schedule request
                </button>
            </div>

            {/* Debug */}
            <div className='mt-10'>
                <h3 className='text-xl font-semibold mb-2 text-gray-700'>Current Schedule:</h3>
                <div className='bg-gray-100 p-4 rounded-md text-sm overflow-x-auto max-h-64'>
                    <pre>{JSON.stringify(docData?.workingSchedule, null, 2)}</pre>
                </div>

                <h3 className='text-xl font-semibold mt-6 mb-2 text-gray-700'>Pending Schedule Request:</h3>
                <div className='bg-gray-100 p-4 rounded-md text-sm overflow-x-auto max-h-64'>
                    <pre>{JSON.stringify(docData?.workingScheduleRequest, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;
