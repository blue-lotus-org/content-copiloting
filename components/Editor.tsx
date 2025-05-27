import React from 'react';

interface EditorProps {
  text: string;
  onTextChange: (newText: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ text, onTextChange, isLoading, placeholder }) => {
  return (
    <textarea
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      disabled={isLoading}
      placeholder={placeholder || "Enter your text here..."}
      className="w-full h-96 lg:h-[500px] p-4 border border-slate-600 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y text-gray-200 bg-slate-700 placeholder-slate-400 transition-all duration-150 ease-in-out"
      aria-label="Content Editor"
    />
  );
};

export default Editor;
