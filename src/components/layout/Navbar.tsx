import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckSquare, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-400" />}
            className="hover:border-rose-500/40 hover:text-rose-400"
          >
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
