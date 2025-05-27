import React from 'react';
import { AiOperation } from '../types';
import { LanguageOption } from '../constants';
import OperationButton from './OperationButton';

interface ToolbarProps {
  mainOperations: AiOperation[];
  onOperationSelect: (operation: AiOperation) => void;
  isLoading: boolean;
  onClear: () => void;
  viewMode: 'edit' | 'preview';
  onToggleView: () => void;
  onDownloadMD: () => void;
  onDownloadTXT: () => void;
  isEditorEmpty: boolean;
  sourceLanguage: string;
  onSourceLanguageChange: (langCode: string) => void;
  targetLanguage: string;
  onTargetLanguageChange: (langCode: string) => void;
  availableLanguages: LanguageOption[];
  targetLanguages: LanguageOption[];
}

const Toolbar: React.FC<ToolbarProps> = ({
  mainOperations,
  onOperationSelect,
  isLoading,
  onClear,
  viewMode,
  onToggleView,
  onDownloadMD,
  onDownloadTXT,
  isEditorEmpty,
  sourceLanguage,
  onSourceLanguageChange,
  targetLanguage,
  onTargetLanguageChange,
  availableLanguages,
  targetLanguages,
}) => {

  const commonSelectClasses = "bg-slate-600 border border-slate-500 text-gray-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="mb-6 p-3 bg-slate-750 rounded-lg shadow-md border border-slate-600">
      {/* AI Operations Section */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {mainOperations.map((op) => (
          <OperationButton
            key={op}
            operation={op}
            onClick={onOperationSelect}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Translation Tools Section */}
      <hr className="my-4 border-slate-600" />
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 text-center">TRANSLATION TOOLS</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label htmlFor="source-language" className="block mb-1 text-xs font-medium text-gray-300">From:</label>
          <select
            id="source-language"
            value={sourceLanguage}
            onChange={(e) => onSourceLanguageChange(e.target.value)}
            disabled={isLoading}
            className={commonSelectClasses}
            aria-label="Source language for translation"
          >
            {availableLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="target-language" className="block mb-1 text-xs font-medium text-gray-300">To:</label>
          <select
            id="target-language"
            value={targetLanguage}
            onChange={(e) => onTargetLanguageChange(e.target.value)}
            disabled={isLoading}
            className={commonSelectClasses}
            aria-label="Target language for translation"
          >
            <option value="" disabled={targetLanguage !== ""}>Select target...</option>
            {targetLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <OperationButton
            operation={AiOperation.TRANSLATE}
            onClick={onOperationSelect}
            isLoading={isLoading}
            isDisabled={!targetLanguage || isLoading} // Disable if no target language or already loading
            className="w-full sm:w-auto" // Ensure button takes full width on small screens or auto on larger
         />
      </div>

      {/* Editor Controls Section */}
      <hr className="my-4 border-slate-600" />
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <button
          type="button"
          onClick={onToggleView}
          disabled={isLoading}
          className={`
            px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm 
            text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500
            disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:opacity-70
            transition-all ease-in-out duration-150 transform hover:scale-105 active:scale-95
          `}
        >
          {viewMode === 'edit' ? 'Preview Markdown' : 'Edit Content'}
        </button>
        <button
          type="button"
          onClick={onDownloadMD}
          disabled={isLoading || isEditorEmpty}
          className="px-4 py-2 border border-green-500 text-sm font-medium rounded-md shadow-sm text-green-400 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
        >
          Download .md
        </button>
        <button
          type="button"
          onClick={onDownloadTXT}
          disabled={isLoading || isEditorEmpty}
          className="px-4 py-2 border border-sky-500 text-sm font-medium rounded-md shadow-sm text-sky-400 hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
        >
          Download .txt
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="px-4 py-2 border border-red-500 text-sm font-medium rounded-md shadow-sm text-red-400 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
        >
          Clear Editor
        </button>
      </div>
    </div>
  );
};

export default Toolbar;