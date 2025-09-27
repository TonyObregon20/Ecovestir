// src/components/EcoVestirLogo.jsx
import React from 'react';

const EcoVestirLogo = ({ width = 150, height = 40, className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`} style={{ width, height }}>
      {/* Círculo verde con hoja blanca */}
      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2ZM7 10C5.34315 10 4 11.3431 4 13C4 14.6569 5.34315 16 7 16H17C18.6569 16 20 14.6569 20 13C20 11.3431 18.6569 10 17 10H7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Texto "EcoVestir" */}
      <span className="text-xl font-bold text-gray-800">EcoVestir</span>
    </div>
  );
};

export default EcoVestirLogo;