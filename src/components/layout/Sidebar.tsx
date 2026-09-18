import React from 'react';
import { CheckCircle2, Clock, Inbox, ListTodo, Plus, X } from 'lucide-react';
import type { TaskStatus, TaskStats } from '../../types/task.types';
import { cn } from '../../utils/helpers';
import { Button } from '../ui/Button';

interface SidebarProps {
  currentStatus: TaskStatus | 'ALL';
  onSelectStatus: (status: TaskStatus | 'ALL') => void;
  stats?: TaskStats;
  onOpenCreateModal: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStatus,
  onSelectStatus,
  stats,
  onOpenCreateModal,
  isOpen,
  onClose,
}) => {
  const navItems = [
    {
      id: 'ALL' as const,
      label: 'All Tasks',
      icon: Inbox,
      count: stats?.total ?? 0,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'TODO' as const,
      label: 'To Do',
      icon: ListTodo,
      count: stats?.todo ?? 0,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'IN_PROGRESS' as const,
      label: 'In Progress',
      icon: Clock,
      count: stats?.inProgress ?? 0,
      badgeColor: 'bg-amber-500/10 text-amber-400',
    },
    {
      id: 'DONE' as const,
      label: 'Completed',
      icon: CheckCircle2,
      count: stats?.done ?? 0,
      badgeColor: 'bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-6">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <span className="font-semibold text-white text-sm">Navigation</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add Button */}
          <Button
            onClick={() => {
              onOpenCreateModal();
              onClose();
            }}
            variant="primary"
            size="md"
            className="w-full shadow-lg shadow-indigo-600/20"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Views
            </p>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentStatus === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectStatus(item.id);
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-md font-semibold transition-colors',
                        item.badgeColor
                      )}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Productivity Widget */}
        {stats && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Completion Rate</span>
              <span className="text-indigo-400 font-bold">{stats.completionRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {stats.done} of {stats.total} tasks completed
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
