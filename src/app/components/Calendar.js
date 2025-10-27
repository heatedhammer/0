"use client";

import { useState, useEffect } from 'react';

// Helper function to format date to YYYY-MM-DD in local timezone
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Calendar({ onDateSelect, tasks, selectedDate, dailyTaskStats }) { // Add dailyTaskStats prop
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null); // Placeholder for days before the 1st
    }
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const hasTaskOnDate = (date) => {
    if (!date || !tasks) return false;
    const dateString = formatDateToYYYYMMDD(date);
    return tasks.some(task => task.dueDate === dateString);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 40px auto', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', backgroundColor: '#fdfdfd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={goToPreviousMonth} style={{ padding: '8px 15px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>이전 달</button>
        <h3 style={{ margin: 0, color: '#333' }}>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h3>
        <button onClick={goToNextMonth} style={{ padding: '8px 15px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>다음 달</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' }}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} style={{ fontWeight: 'bold', color: '#888', padding: '8px' }}>{day}</div>
        ))}
        {days.map((day, index) => {
          const dayString = day ? formatDateToYYYYMMDD(day) : null;
          const isSelected = day && dayString === selectedDate; // Check if this day is selected
          const dayStats = dailyTaskStats[dayString];
          const completionPercentage = dayStats && dayStats.total > 0 ? Math.round((dayStats.completed / dayStats.total) * 100) : 0;

          let completionColor = 'transparent';
          if (dayStats && dayStats.total > 0) {
            if (completionPercentage === 100) {
              completionColor = '#28a745'; // Green for 100%
            } else if (completionPercentage > 0) {
              completionColor = '#ffc107'; // Orange for partial
            } else {
              completionColor = '#dc3545'; // Red for 0% but has tasks
            }
          }

          return (
            <div
              key={index}
              style={{
                padding: '10px',
                border: day ? (isSelected ? '2px solid #4a90e2' : '1px solid #eee') : 'none', // Thicker border for selected
                borderRadius: '6px',
                backgroundColor: day ? (isSelected ? '#e0f2f7' : '#fff') : 'transparent', // Different background for selected
                cursor: day ? 'pointer' : 'default',
                color: day ? (isSelected ? '#2c3e50' : '#333') : '#ccc',
                fontWeight: isSelected ? 'bold' : 'normal',
                boxShadow: day ? (isSelected ? '0 2px 5px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)') : 'none',
                transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
                position: 'relative', // For positioning the completion indicator
              }}
              onClick={() => day && onDateSelect(dayString)} // Use helper function
            >
              {day ? day.getDate() : ''}
              {dayStats && dayStats.total > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: completionColor,
                    border: '1px solid #fff',
                  }}
                  title={`${completionPercentage}% 완료`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
