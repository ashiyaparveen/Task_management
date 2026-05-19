import React, { useState } from 'react';
import { Calendar, Tag, CheckCircle2, Circle, Clock } from 'lucide-react';

const TaskCard = ({ task, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);

  const statusConfig = {
    'Planned': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeBg: 'bg-indigo-500',
      icon: Clock,
      colorName: 'indigo',
    },
    'In Progress': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-500',
      icon: Circle,
      colorName: 'amber',
    },
    'Complete': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-500',
      icon: CheckCircle2,
      colorName: 'emerald',
    },
  };

  const currentStatus = statusConfig[task.status] || statusConfig['Planned'];
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    setUpdating(true);
    try {
      await onStatusChange(task.id, nextStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Format creation date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="relative group bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 animate-slide-up flex flex-col justify-between">
      {/* Updating overlay */}
      {updating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div>
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentStatus.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.badgeBg}`} />
            {task.status}
          </span>
          
          <span className="text-slate-400 group-hover:text-slate-500 transition-colors">
            <Tag size={14} />
          </span>
        </div>

        {/* Task Title */}
        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug break-words mb-2">
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description ? (
          <p className="text-sm text-slate-600 font-normal leading-relaxed break-words whitespace-pre-wrap mb-4">
            {task.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 font-normal mb-4">
            No description provided.
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Date Meta */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <Calendar size={13} />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        {/* Status Dropdown selector */}
        <div className="relative">
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={updating}
            aria-label="Change task status"
            className="w-full sm:w-auto appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border border-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
