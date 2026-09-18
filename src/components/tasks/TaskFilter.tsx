import React from 'react';
import type { TaskStatus } from '../../types/task.types';
import { RotateCw, Search, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface TaskFilterProps {
  currentStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  currentStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading = false,
}) => {
  const statusTabs: Array<{ id: TaskStatus | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'DONE', label: 'Completed' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or keyword..."
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Refresh Button */}
      <div className="flex items-center justify-between md:justify-end gap-2 overflow-x-auto pb-1 md:pb-0">
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 shrink-0">
          {statusTabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-50 shrink-0"
          title="Refresh tasks"
          aria-label="Refresh tasks"
        >
          <RotateCw className={cn('w-4 h-4', isLoading && 'animate-spin text-indigo-400')} />
        </button>
      </div>
    </div>
  );
};
