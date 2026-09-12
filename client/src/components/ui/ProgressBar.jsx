import React from 'react';

const ProgressBar = ({ progress = 0, className = '', color = 'primary' }) => {
  const progressColorClass = {
    primary: 'bg-primary',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-amber-500',
  }[color];

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`${progressColorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;