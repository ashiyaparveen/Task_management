import React from 'react';

const Spinner = ({ size = 'md', color = 'indigo' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    indigo: 'border-indigo-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    violet: 'border-violet-600 border-t-transparent',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.indigo}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Spinner;
