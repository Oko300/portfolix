import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-card p-6 rounded-2xl shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;