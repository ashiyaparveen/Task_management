import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  const handleLogin = async () => {
    setError('');
    setAuthenticating(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Failed to authenticate. Please select a valid Google Account.');
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 overflow-hidden font-sans">
      {/* Decorative Blur Spheres for Aesthetic Premium Look */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-3xl p-8 sm:p-10 animate-fade-in z-10 flex flex-col justify-between">

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25 mb-4 border border-indigo-400/20">
            <LogIn className="text-white" size={26} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
            TaskManage
          </h1>
          <p className="text-indigo-200/60 text-sm font-medium">
            Manage your daily workflows with clarity.
          </p>
        </div>

        {/* Action Button Section */}
        <div className="space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs font-semibold" role="alert">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={authenticating}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-sm font-bold rounded-2xl shadow-lg border border-slate-200 hover:border-slate-300 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none disabled:opacity-75 transition-all duration-200 cursor-pointer"
          >
            {authenticating ? (
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{authenticating ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>
        </div>

        {/* Bottom Credits Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-indigo-200/30 text-xs font-semibold">
            Task Management Assessment App
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
