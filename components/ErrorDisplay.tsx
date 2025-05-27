import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onClose?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
  return (
    <div 
      className="bg-red-700 border-l-4 border-red-500 text-red-100 p-4 rounded-md shadow-lg mb-6 w-full max-w-3xl flex justify-between items-center" 
      role="alert"
    >
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-4 p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          aria-label="Close error message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
