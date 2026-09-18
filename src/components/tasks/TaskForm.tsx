import React, { useEffect, useState } from 'react';
import type { Task, TaskCreateInput, TaskStatus } from '../../types/task.types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: TaskCreateInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'TODO');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (title.length > 100) {
      setError('Title cannot exceed 100 characters');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
    } catch {
      // Error handling is handled upstream by toast/parent
    }
  };

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Completed' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Title *"
          placeholder="e.g. Implement authentication flow"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          autoFocus
          maxLength={100}
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-slate-500">{title.length}/100</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-xs font-medium text-slate-300">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details, checklist, or context for this task..."
          className="w-full rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder:text-slate-500 text-sm py-2.5 px-3.5 focus:outline-none transition-all resize-none"
        />
      </div>

      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        options={statusOptions}
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
