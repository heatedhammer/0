"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '../components/TaskForm'; // Import TaskForm
import Calendar from '../components/Calendar'; // Import Calendar

// Helper function to format date to YYYY-MM-DD in local timezone
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [selectedDate, setSelectedDate] = useState(formatDateToYYYYMMDD(new Date())); // Default to today
  const router = useRouter();

  // Load username and tasks on component mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUsername(currentUser);
      const storedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
      setTasks(storedTasks);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    if (username) {
      localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
    }
  }, [tasks, username]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getDailyTaskStats = () => {
    const stats = {};
    tasks.forEach(task => {
      if (!stats[task.dueDate]) {
        stats[task.dueDate] = { total: 0, completed: 0 };
      }
      stats[task.dueDate].total++;
      if (task.completed) {
        stats[task.dueDate].completed++;
      }
    });
    return stats;
  };

  const dailyTaskStats = getDailyTaskStats();
  const filteredTasks = tasks
    .filter(task => task.dueDate === selectedDate)
    .sort((a, b) => { // Sort by startTime, then by completion status
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });

  if (!username) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '30px', border: '1px solid #ccc', borderRadius: '12px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>환영합니다, {username}님!</h1>
      <p style={{ textAlign: 'center', marginBottom: '35px', color: '#555' }}>이곳은 당신의 개인 맞춤형 공부 스케줄러 대시보드입니다.</p>

      <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}> {/* Calendar container */}
          <Calendar onDateSelect={handleDateSelect} tasks={tasks} selectedDate={selectedDate} dailyTaskStats={dailyTaskStats} />
        </div>
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}> {/* Task list container */}
          <div style={{ marginBottom: '30px', padding: '25px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxHeight: '400px', overflowY: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>{selectedDate}의 공부 스케줄</h2>
            {filteredTasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#777' }}>선택된 날짜에 스케줄이 없습니다. 새로운 스케줄을 추가해 보세요!</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '18px',
                      marginBottom: '12px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '10px',
                      backgroundColor: task.completed ? '#e6ffe6' : '#fff',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, color: '#333' }}>{task.title}</h3>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#666' }}>{task.description}</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.8em', color: '#888' }}>{task.startTime} ~ {task.endTime}</p> {/* Display start and end time */}
                    </div>
                    <div>
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        style={{
                          padding: '8px 12px',
                          marginRight: '10px',
                          backgroundColor: task.completed ? '#f0ad4e' : '#5cb85c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                      >
                        {task.completed ? '미완료' : '완료'}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#d9534f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <TaskForm onAddTask={handleAddTask} selectedDate={selectedDate} />
      <button
        onClick={handleLogout}
        style={{ display: 'block', margin: '40px auto 0 auto', padding: '12px 25px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        로그아웃
      </button>
    </div>
  );
}