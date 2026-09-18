import React from 'react';
import { cn, getStatusConfig } from '../../utils/helpers';
import type { TaskStatus } from '../../types/task.types';

interface BadgeProps {
  status: TaskStatus;
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, showDot = true }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors',
        config.badgeClass,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />}
      {config.label}
    </span>
  );
};
