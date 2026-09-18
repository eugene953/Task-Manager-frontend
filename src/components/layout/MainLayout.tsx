import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { TaskStats, TaskStatus } from '../../types/task.types';

interface MainLayoutProps {
  children: React.ReactNode;
  currentStatus: TaskStatus | 'ALL';
  onSelectStatus: (status: TaskStatus | 'ALL') => void;
  stats?: TaskStats;
  onOpenCreateModal: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentStatus,
  onSelectStatus,
  stats,
  onOpenCreateModal,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-300">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentStatus={currentStatus}
          onSelectStatus={onSelectStatus}
          stats={stats}
          onOpenCreateModal={onOpenCreateModal}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
