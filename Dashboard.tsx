
import React from 'react';
import { TaskStats } from '../types';

interface DashboardProps {
  stats: TaskStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-sm font-medium">전체 할 일</span>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-sm font-medium">완료됨</span>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-sm font-medium">높은 우선순위</span>
          <div className="p-2 bg-rose-50 rounded-lg">
            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900">{stats.highPriority}</p>
      </div>
    </div>
  );
};

export default Dashboard;
