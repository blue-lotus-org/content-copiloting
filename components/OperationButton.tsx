import React from 'react';
import { AiOperation } from '../types';

interface OperationButtonProps {
  operation: AiOperation;
  onClick: (operation: AiOperation) => void;
  isLoading?: boolean;
  isDisabled?: boolean; // Optional explicit disable
  className?: string; // Optional additional classes
}

const OperationButton: React.FC<OperationButtonProps> = ({ operation, onClick, isLoading, isDisabled, className }) => {
  const disabled = isLoading || isDisabled;
  return (
    <button
      type="button"
      onClick={() => onClick(operation)}
      disabled={disabled}
      className={`
        px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm 
        text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500
        disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:opacity-70
        transition-all ease-in-out duration-150 transform hover:scale-105 active:scale-95
        ${className || ''}
      `}
      aria-label={`Perform ${operation} operation`}
    >
      {operation}
    </button>
  );
};

export default OperationButton;