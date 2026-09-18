import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-center selection:bg-indigo-500/30 selection:text-indigo-300">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-500/10">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-semibold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-8">
        The page you are looking for does not exist or has been relocated to another workspace.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
