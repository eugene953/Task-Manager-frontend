import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckSquare, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ email, password });
      showToast('Welcome back! You are successfully signed in.', 'success', 'Login Successful');
      navigate('/');
    } catch (err: any) {
      showToast(
        err?.message || 'Invalid email or password. Please verify your credentials.',
        'error',
        'Authentication Failed'
      );
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@taskflow.dev');
    setPassword('Password123!');
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 selection:bg-indigo-500/30 selection:text-indigo-300 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo & header */}
      <div className="w-full max-w-md text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/25 mb-4">
          <CheckSquare className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome back to TaskFlow
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Sign in to access your synchronized workspaces and tasks.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={formErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={formErrors.password}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-200 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Credentials Helper for instant testing */}
        {/* <div className="mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 text-xs text-indigo-300 hover:text-indigo-200 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fill Demo Credentials (Quick Test)</span> 
          </button>
        </div> */}

        {/* Footer Redirect */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
