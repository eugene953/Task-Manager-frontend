import React from 'react';
import type { Task } from '../../types/task.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Task"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-xs">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <p className="text-sm text-slate-300">
          Are you sure you want to delete task{' '}
          <span className="font-semibold text-white break-words">"{task.title}"</span>?
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};
