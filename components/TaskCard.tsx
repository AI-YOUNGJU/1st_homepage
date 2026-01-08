
import React from 'react';
import { Task, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-rose-600 bg-rose-50 border-rose-200';
      case Priority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-200';
      case Priority.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const formatCreatedAt = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-5 flex items-start gap-4 transition-all active:scale-[0.99] group shadow-sm ${task.completed ? 'opacity-60 bg-slate-50/50' : 'hover:shadow-md hover:border-blue-200'}`}>
      {/* 터치하기 편한 큰 체크 버튼 */}
      <button 
        onClick={onToggle}
        className={`shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed 
            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'border-slate-300 bg-white group-hover:border-blue-400'
        }`}
      >
        {task.completed && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest border shadow-sm ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {task.dueDate && !task.completed && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white uppercase tracking-widest">
              D-DAY
            </span>
          )}
        </div>
        
        <h3 className={`text-lg font-bold text-slate-900 truncate mb-1 ${task.completed ? 'line-through text-slate-400 font-medium' : ''}`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={`text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 ${task.completed ? 'text-slate-400' : ''}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatCreatedAt(task.createdAt)}</span>
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg ${task.completed ? 'text-slate-400 bg-slate-100' : 'text-blue-600 bg-blue-50'}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{task.dueDate} 마감</span>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 p-2 text-slate-300 hover:text-rose-500 active:scale-90 transition-all"
        aria-label="삭제"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskCard;
