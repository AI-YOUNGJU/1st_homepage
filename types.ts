
export enum Priority {
  LOW = '낮음',
  MEDIUM = '보통',
  HIGH = '높음'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  dueDate?: string; // YYYY-MM-DD 형식의 날짜
}

export interface TaskStats {
  total: number;
  completed: number;
  highPriority: number;
}

export type FilterType = 'all' | 'active' | 'completed';
