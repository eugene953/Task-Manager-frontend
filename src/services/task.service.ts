import { request } from './api';
import type { Task, TaskCreateInput, TaskStatus, TaskUpdateInput } from '../types/task.types';

export const taskService = {
  getTasks: async (status?: TaskStatus, search?: string): Promise<Task[]> => {
    return request<Task[]>('/tasks', {
      method: 'GET',
      params: {
        status: status || undefined,
        search: search || undefined,
      },
    });
  },

  getTaskById: async (id: number): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  createTask: async (data: TaskCreateInput): Promise<Task> => {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: async (id: number, data: TaskUpdateInput): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTask: async (id: number): Promise<void> => {
    return request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
