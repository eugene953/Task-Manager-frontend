import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { MainLayout } from '../components/layout/MainLayout';
import { TaskFilter } from '../components/tasks/TaskFilter';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { DeleteTaskModal } from '../components/tasks/DeleteTaskModal';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type { Task, TaskCreateInput, TaskStatus } from '../types/task.types';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  TrendingUp,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const {
    tasks,
    isLoading,
    filter,
    stats,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
    refreshTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
  } = useTasks();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers for Task CRUD
  const handleCreateTask = async (data: TaskCreateInput) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      showToast('Task created successfully!', 'success', 'Task Created');
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Failed to create task', 'error', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskCreateInput) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, data);
      showToast('Task updated successfully!', 'success', 'Task Updated');
      setEditingTask(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update task', 'error', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: TaskStatus) => {
    try {
      await toggleTaskStatus(id, newStatus);
      showToast(`Task status updated to ${newStatus.replace('_', ' ')}`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update task status', 'error', 'Error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setIsSubmitting(true);
    try {
      await deleteTask(deletingTask.id);
      showToast('Task deleted successfully', 'success', 'Task Deleted');
      setDeletingTask(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete task', 'error', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getViewTitle = () => {
    switch (filter.status) {
      case 'TODO':
        return 'To Do Tasks';
      case 'IN_PROGRESS':
        return 'In Progress Tasks';
      case 'DONE':
        return 'Completed Tasks';
      case 'ALL':
      default:
        return 'All Tasks';
    }
  };

  const hasActiveFilters = filter.status !== 'ALL' || filter.search.trim() !== '';

  return (
    <MainLayout
      currentStatus={filter.status}
      onSelectStatus={setStatusFilter}
      stats={stats}
      onOpenCreateModal={() => setIsCreateModalOpen(true)}
    >
      <div className="space-y-6 pb-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0">
              Welcome back, {user?.name || 'Developer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Here is an overview of your active tasks and workflow productivity.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-lg shadow-indigo-600/25 self-start sm:self-auto"
          >
            New Task
          </Button>
        </div>

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total */}
          <div
            onClick={() => setStatusFilter('ALL')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Total Tasks</span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                <ListTodo className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats.total}
            </div>
          </div>

          {/* Card 2: To Do */}
          <div
            onClick={() => setStatusFilter('TODO')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">To Do</span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-slate-700 group-hover:text-slate-200 transition-colors">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats.todo}
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">
              {stats.inProgress}
            </div>
          </div>

          {/* Card 4: Done */}
          <div
            onClick={() => setStatusFilter('DONE')}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                {stats.done}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3 h-3" />
                {stats.completionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <TaskFilter
          currentStatus={filter.status}
          onStatusChange={setStatusFilter}
          searchQuery={filter.search}
          onSearchChange={setSearchQuery}
          onRefresh={refreshTasks}
          isLoading={isLoading}
        />

        {/* Active View Label & Item Count */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight m-0">
              {getViewTitle()}
            </h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
              {tasks.length}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Task Cards Grid */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onEdit={(task: Task) => setEditingTask(task)}
          onDelete={(task: Task) => setDeletingTask(task)}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Modal: Create Task */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        description="Add a task with a title, description, and status."
        maxWidth="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal: Edit Task */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        description="Update your task's title, description, or status."
        maxWidth="md"
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal: Delete Confirmation */}
      <DeleteTaskModal
        task={deletingTask}
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
      />
    </MainLayout>
  );
};
