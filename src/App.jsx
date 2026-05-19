import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Spinner from './components/Spinner';

const AppContent = () => {
  const { user, loading } = useAuth();

  // Full-screen loading state when verifying Firebase Auth sessions on mount
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <Spinner size="lg" />
        <p className="text-sm font-bold text-slate-400 mt-4 animate-pulse">
          Securing session...
        </p>
      </div>
    );
  }

  // Auth Guard: Redirect unauthenticated users to login, others to dashboard
  return user ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
