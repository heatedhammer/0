"use client";

import { useState, useEffect } from 'react'; // Import useEffect

export default function TaskForm({ onAddTask, selectedDate }) { // Accept selectedDate prop
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(selectedDate || ''); // Initialize with selectedDate
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Update dueDate when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate || !startTime || !endTime) {
      alert('제목, 마감일, 시작 시간, 종료 시간은 필수입니다!');
      return;
    }
    onAddTask({
      id: Date.now(),
      title,
      description,
      dueDate,
      startTime,
      endTime,
      completed: false,
    });
    setTitle('');
    setDescription('');
    // dueDate is updated by useEffect, so no need to clear here
    setStartTime('');
    setEndTime('');
  };

  return (
    <div style={{ marginBottom: '30px', padding: '25px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fdfdfd', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>새로운 공부 스케줄 추가</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="taskTitle" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>제목:</label>
          <input
            type="text"
            id="taskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="taskDescription" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>설명 (선택 사항):</label>
          <textarea
            id="taskDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="taskDueDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>마감일:</label>
          <input
            type="date"
            id="taskDueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="taskStartTime" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>시작 시간:</label>
          <input
            type="time"
            id="taskStartTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', WebkitAppearance: 'none' }}
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="taskEndTime" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>종료 시간:</label>
          <input
            type="time"
            id="taskEndTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', WebkitAppearance: 'none' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>스케줄 추가</button>
      </form>
    </div>
  );
}
