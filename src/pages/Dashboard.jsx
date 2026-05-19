import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import Spinner from '../components/Spinner';
import { isMock } from '../firebase/config';
import { LogOut, ClipboardList, CheckCircle2, Circle, Clock, LayoutDashboard, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, loading, error, createTask, updateTaskStatus, isPendingConnection } = useTasks();

  // Task Status counts
  const plannedCount = tasks.filter(t => t.status === 'Planned').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Complete').length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Premium Sticky Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/10">
                <LayoutDashboard className="text-white" size={18} />
              </div>
              <span className="text-lg font-extrabold text-slate-800 tracking-tight">TaskFlow</span>
            </div>

            {/* Right User Meta & Logout */}
            <div className="flex items-center gap-4">
              {/* User Identity Details */}
              <div className="hidden sm:flex items-center gap-3 border-r border-slate-100 pr-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{user?.displayName}</p>
                  <p className="text-xs font-semibold text-slate-400 leading-none">{user?.email}</p>
                </div>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User Profile"}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full ring-2 ring-indigo-50"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center ring-2 ring-indigo-50">
                    <User size={16} />
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                aria-label="Logout"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50/50 active:bg-red-50 font-bold text-sm transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Dynamic Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {user?.displayName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">

          </p>
        </div>

        {/* Real-time Status Counts Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card: Total */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</p>
              <h3 className="text-2xl font-black text-slate-800 mt-0.5">{tasks.length}</h3>
            </div>
          </div>

          {/* Card: Planned */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Planned</p>
              <h3 className="text-2xl font-black text-slate-850 mt-0.5">{plannedCount}</h3>
            </div>
          </div>

          {/* Card: In Progress */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Circle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</p>
              <h3 className="text-2xl font-black text-slate-850 mt-0.5">{inProgressCount}</h3>
            </div>
          </div>

          {/* Card: Complete */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</p>
              <h3 className="text-2xl font-black text-slate-850 mt-0.5">{completedCount}</h3>
            </div>
          </div>
        </div>

        {/* Dashboard Grid (Sidebar + Main Task Area) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar: Form & Mobile Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mobile Profile Card (Visible only on smallest viewports) */}
            <div className="sm:hidden bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User Profile"}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full ring-2 ring-indigo-50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-850">{user?.displayName}</h4>
                <p className="text-xs font-semibold text-slate-400">{user?.email}</p>
              </div>
            </div>

            {/* Task Form Component */}
            <TaskForm onCreateTask={createTask} />
          </div>

          {/* Right Main Task List Area */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-150/40 pb-4">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Your Tasks</h2>
              {isMock ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-150 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Demo Mode Active
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('taskflow_force_mock');
                      window.location.reload();
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline hover:no-underline transition-all cursor-pointer"
                    title="Switch back to real Firebase database connection"
                  >
                    Connect Firebase
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  Real-time updates active
                </span>
              )}
            </div>

            {/* Error Message banner */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2 animate-fade-in" role="alert">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Diagnostic warning for uncreated Firestore Database */}
            {isPendingConnection && !isMock && (
              <div className="p-5 bg-amber-50/70 border border-amber-100 rounded-2xl text-amber-800 text-sm font-medium animate-fade-in space-y-3.5 shadow-sm mb-4" role="alert">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
                  <span>⏳ Database Connection Pending...</span>
                </div>
                <p className="leading-relaxed font-semibold text-slate-650">
                  The application is logged in with your Google ID, but is waiting to connect to your Firebase Firestore Database.
                </p>
                <div className="text-xs text-amber-850 leading-relaxed font-medium bg-amber-100/40 p-3.5 rounded-xl border border-amber-100/60">
                  <strong className="text-amber-900 font-bold block mb-1">Action Required:</strong>
                  Please go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-indigo-600 hover:text-indigo-800">Firebase Console</a>, open <strong>Firestore Database</strong> under the left menu, and click <strong>"Create Database"</strong>. Start in <strong>Test Mode</strong> to enable database operations instantly.
                </div>
                <div className="pt-2 border-t border-amber-250/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-[11px] font-semibold text-amber-700/90 leading-tight">
                    Want to test it instantly without setting up Firebase?
                  </span>
                  <button
                    onClick={() => {
                      localStorage.setItem('taskflow_force_mock', 'true');
                      window.location.reload();
                    }}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    ⚡ Switch to Demo Mode (Local Storage)
                  </button>
                </div>
              </div>
            )}


            {/* Loading / Empty States / Tasks Cards Grid */}
            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : tasks.length === 0 ? (
              /* Beautiful Aesthetic Empty State */
              <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center max-w-xl mx-auto flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <ClipboardList size={30} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1.5">No tasks yet</h3>
                <p className="text-sm font-semibold text-slate-400 max-w-sm leading-relaxed mb-6">
                  Ready to capture your workflow? Create a task in the sidebar on the left and see it cataloged here in real-time.
                </p>
              </div>
            ) : (
              /* Cards Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={updateTaskStatus}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
