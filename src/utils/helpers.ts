import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TaskStatus } from '../types/task.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export const formatRelativeTime = formatRelativeDate;

export interface StatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
}

export function getStatusConfig(status: TaskStatus): StatusConfig {
  switch (status) {
    case 'TODO':
      return {
        label: 'To Do',
        badgeClass: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        dotClass: 'bg-slate-400',
        borderClass: 'border-l-slate-500',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        dotClass: 'bg-amber-400 animate-pulse',
        borderClass: 'border-l-amber-500',
      };
    case 'DONE':
      return {
        label: 'Completed',
        badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        dotClass: 'bg-emerald-400',
        borderClass: 'border-l-emerald-500',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
        dotClass: 'bg-slate-400',
        borderClass: 'border-l-slate-500',
      };
  }
}
