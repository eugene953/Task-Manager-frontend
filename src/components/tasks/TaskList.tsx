import React from 'react';
import type { Task, TaskStatus } from '../../types/task.types';
import { TaskCard } from './TaskCard';
import { CheckCircle2, Plus, SearchX } from 'lucide-react';
import { Button } from '../ui/Button';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: number, newStatus: TaskStatus) => void;
  onOpenCreateModal: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
  onClearFilters,
  hasActiveFilters,
}) => {
  // Skeleton Loading Grid
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-5 h-5 rounded-full bg-slate-800" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
              </div>
              <div className="w-16 h-5 rounded-full bg-slate-800" />
            </div>
            <div className="space-y-2 pl-8">
              <div className="h-3 bg-slate-800 rounded w-5/6" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <div className="h-3 bg-slate-800 rounded w-20" />
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded bg-slate-800" />
                <div className="w-6 h-6 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State - Filter produced 0 results
  if (tasks.length === 0 && hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No tasks found</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
          No tasks match your current status filter or search query. Try adjusting or clearing your filters.
        </p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  // Empty State - Zero tasks in account
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-white">All caught up!</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
          You don't have any tasks right now. Create your first task to boost your productivity today.
        </p>
        <Button
          variant="primary"
          onClick={onOpenCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create First Task
        </Button>
      </div>
    );
  }

  // Task Cards Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};
