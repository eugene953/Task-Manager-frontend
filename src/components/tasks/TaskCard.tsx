import React from 'react';
import type { Task, TaskStatus } from '../../types/task.types';
import { Badge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/helpers';
import { Calendar, CheckCircle2, Circle, Clock, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: number, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isDone = task.status === 'DONE';

  const nextStatusMap: Record<TaskStatus, TaskStatus> = {
    TODO: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: 'TODO',
  };

  const handleQuickAdvance = () => {
    onStatusChange(task.id, nextStatusMap[task.status]);
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200',
        'bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-xs',
        isDone
          ? 'border-slate-800/60 opacity-80 hover:opacity-100'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5'
      )}
    >
      {/* Top Header: Quick status toggle checkbox + Title & Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Quick Completion Checkbox / Status cycler */}
            <button
              onClick={handleQuickAdvance}
              title={`Status: ${task.status}. Click to cycle status`}
              className="mt-0.5 shrink-0 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
            >
              {task.status === 'DONE' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              )}
              {task.status === 'IN_PROGRESS' && (
                <Clock className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              )}
              {task.status === 'TODO' && (
                <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
              )}
            </button>

            <h3
              className={cn(
                'text-base font-semibold leading-snug break-words tracking-tight transition-colors',
                isDone ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'
              )}
            >
              {task.title}
            </h3>
          </div>

          <Badge status={task.status} />
        </div>

        {/* Task Description */}
        {task.description ? (
          <p
            className={cn(
              'text-xs leading-relaxed line-clamp-3 text-slate-400 pl-8',
              isDone && 'text-slate-500'
            )}
          >
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic pl-8">No description provided</p>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 pl-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatRelativeTime(task.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Quick status dropdown / buttons */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-[11px] bg-slate-800 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>

          {/* Edit button */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
