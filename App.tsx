
import React, { useState, useEffect, useMemo } from 'react';
import { Task, Priority, FilterType } from './types';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import Dashboard from './components/Dashboard';
import { getEmojiForTask } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('todo-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    } else {
      // 처음 방문 시 환영 할 일 추가
      const welcomeTask: Task = {
        id: 'welcome-task',
        title: '👋 앱 사용을 환영합니다!',
        description: '오른쪽 하단의 + 버튼을 눌러 첫 번째 할 일을 등록해 보세요. 제목을 입력하면 AI가 어울리는 이모지와 설명을 추천해 줍니다.',
        priority: Priority.HIGH,
        completed: false,
        createdAt: Date.now(),
        dueDate: new Date().toISOString().split('T')[0]
      };
      setTasks([welcomeTask]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    // 이모지 생성 중에도 사용자 경험을 위해 낙관적으로 상태 업데이트 가능하지만, 
    // 여기서는 AI의 재미를 위해 생성을 기다립니다.
    const emoji = await getEmojiForTask(newTask.title);
    
    const task: Task = {
      ...newTask,
      title: `${emoji} ${newTask.title}`,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    setIsFormOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.completed);
      case 'completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    highPriority: tasks.filter(t => t.priority === Priority.HIGH && !t.completed).length,
  }), [tasks]);

  return (
    <div className="min-h-full bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">To-Do LIST</h1>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 items-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            할 일 추가
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full px-5 py-6 flex-1 pb-32">
        <Dashboard stats={stats} />

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6 mt-8 bg-slate-200/50 p-1 rounded-xl">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filter === f 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'all' ? '전체' : f === 'active' ? '할 일' : '완료'}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={() => toggleTask(task.id)} 
                onDelete={() => deleteTask(task.id)} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold">목록이 비어있습니다</h3>
              <p className="text-slate-500 text-sm mt-1">오늘의 목표를 등록해보세요!</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-400 z-40 active:scale-90 transition-transform ring-4 ring-white"
        aria-label="추가"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal */}
      {isFormOpen && (
        <TaskForm 
          onAdd={addTask} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
