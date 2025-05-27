import React, { useState, useCallback, useEffect } from 'react';
import { AiOperation } from './types';
import { 
  MAIN_TOOLBAR_OPERATIONS, 
  LANGUAGES, 
  TARGET_LANGUAGES,
  LOCAL_STORAGE_SOURCE_LANG_KEY,
  LOCAL_STORAGE_TARGET_LANG_KEY,
  DEFAULT_TARGET_LANGUAGE_CODE,
  DEFAULT_SOURCE_LANGUAGE_CODE
} from './constants';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import MarkdownViewer from './components/MarkdownViewer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Footer from './components/Footer';
import { processTextWithGemini } from './services/geminiService';

const initialEditorText = `Welcome to the AI Content Co-Pilot! 🚀

Type or paste your text here. Then, use the powerful tools above to:

✨ Summarize lengthy documents
🧐 Rewrite text in formal or casual tones
팽 Expand on ideas with more detail
✍️ Check grammar and polish your writing
🌬️ Simplify complex language
💡 Generate new ideas from a topic
🌍 Translate text to various languages using the dedicated translation tools below!

You can also **preview** this content as Markdown and **download** it!

## Example Markdown
- Item 1
- Item 2
  - Sub-item A
  - Sub-item B

\`\`\`javascript
function greet() {
  console.log("Hello, Co-Pilot!");
}
\`\`\`

Enjoy it!
`;

type ViewMode = 'edit' | 'preview';

function App() {
  const [editorText, setEditorText] = useState<string>(initialEditorText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

  const [sourceLanguage, setSourceLanguage] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SOURCE_LANG_KEY) || DEFAULT_SOURCE_LANGUAGE_CODE;
  });
  const [targetLanguage, setTargetLanguage] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_TARGET_LANG_KEY) || DEFAULT_TARGET_LANGUAGE_CODE;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SOURCE_LANG_KEY, sourceLanguage);
  }, [sourceLanguage]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TARGET_LANG_KEY, targetLanguage);
  }, [targetLanguage]);

  const handleOperation = useCallback(async (operation: AiOperation) => {
    if (!editorText.trim() && operation !== AiOperation.GENERATE_IDEAS) {
      setError("Please enter some text in the editor before performing this operation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let result: string;
      if (operation === AiOperation.TRANSLATE) {
        if (!targetLanguage) {
          setError("Please select a target language for translation.");
          setIsLoading(false);
          return;
        }
        const sourceLangName = LANGUAGES.find(l => l.code === sourceLanguage)?.name || 'Auto-detect';
        const targetLangName = TARGET_LANGUAGES.find(l => l.code === targetLanguage)?.name;

        if (!targetLangName) {
            setError("Invalid target language selected for translation.");
            setIsLoading(false);
            return;
        }
        result = await processTextWithGemini(editorText, operation, { 
          sourceLanguageName: sourceLangName, 
          targetLanguageName: targetLangName 
        });
      } else {
        result = await processTextWithGemini(editorText, operation);
      }
      setEditorText(result);
      setViewMode('edit'); // Switch back to edit mode after AI operation
    } catch (e: any) {
      console.error("Operation failed:", e);
      let errorMessage = `Failed to perform operation: ${e.message || 'Unknown error'}.`;
      if (e.message && (e.message.toLowerCase().includes('api key not valid') || e.message.toLowerCase().includes('api key not found') || e.message.toLowerCase().includes('api_key environment variable is not set'))) {
         errorMessage = 'Gemini API Key is invalid or not configured. Please ensure the API_KEY environment variable is correctly set.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [editorText, sourceLanguage, targetLanguage]);

  const handleClearEditor = () => {
    setEditorText("");
    setError(null);
    setViewMode('edit');
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'edit' ? 'preview' : 'edit');
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    if (!content.trim()) {
      setError("There is no content to download.");
      return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setError(null);
  };

  const handleDownloadMD = () => {
    downloadFile(editorText, 'content.md', 'text/markdown;charset=utf-8');
  };

  const handleDownloadTXT = () => {
    downloadFile(editorText, 'content.txt', 'text/plain;charset=utf-8');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center w-full max-w-5xl">
        {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}
        <div className="w-full bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <Toolbar
            mainOperations={MAIN_TOOLBAR_OPERATIONS}
            onOperationSelect={handleOperation}
            isLoading={isLoading}
            onClear={handleClearEditor}
            viewMode={viewMode}
            onToggleView={toggleViewMode}
            onDownloadMD={handleDownloadMD}
            onDownloadTXT={handleDownloadTXT}
            isEditorEmpty={!editorText.trim()}
            sourceLanguage={sourceLanguage}
            onSourceLanguageChange={setSourceLanguage}
            targetLanguage={targetLanguage}
            onTargetLanguageChange={setTargetLanguage}
            availableLanguages={LANGUAGES}
            targetLanguages={TARGET_LANGUAGES}
          />
          <div className="mt-6 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-75 rounded-lg z-10">
                <LoadingSpinner />
              </div>
            )}
            {viewMode === 'edit' ? (
              <Editor
                text={editorText}
                onTextChange={setEditorText}
                isLoading={isLoading}
                placeholder="Enter your text here, or provide a topic for 'Generate Ideas'..."
              />
            ) : (
              <MarkdownViewer markdownContent={editorText} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;