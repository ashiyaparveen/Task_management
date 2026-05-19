import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

const TaskForm = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is mandatory.');
      return;
    }

    setSubmitting(true);
    try {
      await onCreateTask(title, description);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
        <PlusCircle size={20} className="text-indigo-600" />
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error && e.target.value.trim()) setError('');
            }}
            disabled={submitting}
            className={`w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border ${
              error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
            } text-slate-800 placeholder-slate-400 text-sm font-medium focus:ring-4 focus:outline-none transition-all duration-200`}
          />
          {error && (
            <p className="text-xs font-semibold text-red-500 mt-1.5" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="task-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="task-desc"
            rows="3"
            placeholder="Add details or notes for this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-slate-50/50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all duration-200 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold shadow-md hover:shadow-indigo-600/10 focus:ring-4 focus:ring-indigo-500/25 focus:outline-none disabled:opacity-60 transition-all duration-200 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating task...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Add Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
