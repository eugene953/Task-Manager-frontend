import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Task, TaskCreateInput, TaskFilterState, TaskStats, TaskStatus, TaskUpdateInput } from '../types/task.types';
import { taskService } from '../services/task.service';
import { ApiError } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasksForStats, setAllTasksForStats] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilterState>({
    status: 'ALL',
    search: '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 300);
    return () => clearTimeout(handler);
  }, [filter.search]);

  // Fetch full list for stats calculation
  const fetchStatsTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasks();
      setAllTasksForStats(data);
    } catch {
      // Ignore background stats fetch errors
    }
  }, []);

  // Fetch filtered tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const statusParam = filter.status === 'ALL' ? undefined : (filter.status as TaskStatus);
      const data = await taskService.getTasks(statusParam, debouncedSearch);
      setTasks(data);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to load tasks';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filter.status, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
    fetchStatsTasks();
  }, [fetchTasks, fetchStatsTasks]);

  // Compute live statistics
  const stats: TaskStats = useMemo(() => {
    const total = allTasksForStats.length;
    const todo = allTasksForStats.filter((t) => t.status === 'TODO').length;
    const inProgress = allTasksForStats.filter((t) => t.status === 'IN_PROGRESS').length;
    const done = allTasksForStats.filter((t) => t.status === 'DONE').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, todo, inProgress, done, completionRate };
  }, [allTasksForStats]);

  const setStatusFilter = (status: TaskStatus | 'ALL') => {
    setFilter((prev) => ({ ...prev, status }));
  };

  const setSearchQuery = (search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilter({ status: 'ALL', search: '' });
  };

  const createTask = async (data: TaskCreateInput): Promise<Task> => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      setAllTasksForStats((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create task';
      setError(msg);
      throw err;
    }
  };

  const updateTask = async (id: number, data: TaskUpdateInput): Promise<Task> => {
    try {
      const updated = await taskService.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setAllTasksForStats((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update task';
      setError(msg);
      throw err;
    }
  };

  const toggleTaskStatus = async (id: number, newStatus: TaskStatus): Promise<Task> => {
    const currentTask = tasks.find((t) => t.id === id);
    return updateTask(id, {
      title: currentTask ? currentTask.title : '',
      description: currentTask?.description || undefined,
      status: newStatus,
    });
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setAllTasksForStats((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to delete task';
      setError(msg);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    filter,
    stats,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    refreshTasks: fetchTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    clearError: () => setError(null),
  };
}
