
import React, { useState } from 'react';
import { Priority, Task } from '../types';
import { enrichTaskDescription } from '../services/geminiService';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onClose }) => {
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [isEnriching, setIsEnriching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;
    
    setIsAdding(true);
    await onAdd({ 
      title, 
      description, 
      priority,
      dueDate: dueDate || undefined 
    });
    setIsAdding(false);
  };

  const handleEnrich = async () => {
    if (!title.trim() || isEnriching) return;
    setIsEnriching(true);
    const suggestion = await enrichTaskDescription(title);
    setDescription(suggestion);
    setIsEnriching(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:p-4">
      {/* Background overlay click handler to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-lg mt-auto md:mt-0 relative overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300">
        {/* 모바일용 상단 드래그 핸들 */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">새 할 일 만들기</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom,24px)]">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">무엇을 해야 하나요? <span className="text-rose-500">*</span></label>
            <input 
              autoFocus
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 주간 업무 보고서 작성"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">상세 설명</label>
              <button
                type="button"
                onClick={handleEnrich}
                disabled={!title.trim() || isEnriching}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                {isEnriching ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                AI 자동완성
              </button>
            </div>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="추가적인 메모를 입력하세요..."
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">마감 기한</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">중요도</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base bg-slate-50 appearance-none"
              >
                {Object.values(Priority).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isAdding || !title.trim()}
              className="w-full px-6 py-4 rounded-2xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.97] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              )}
              할 일 추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
