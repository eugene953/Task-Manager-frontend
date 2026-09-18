export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskUpdateInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskFilterState {
  status: TaskStatus | 'ALL';
  search: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionRate: number;
}
