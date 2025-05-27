import { AiOperation } from './types';

export const APP_TITLE = "AI Content Co-Pilot";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export interface LanguageOption {
  code: string;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'fa', name: 'Farsi (Persian)' }, 
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  // You can add more avilable(check gemini doc) languages...
];

export const TARGET_LANGUAGES: LanguageOption[] = LANGUAGES.filter(lang => lang.code !== 'auto'); // Target cannot be auto-detect

interface PromptOptions {
  sourceLang?: string;
  targetLang: string;
}

// these prompts enhanced by another ai, you can change them...
export const OPERATION_PROMPTS: Record<AiOperation, (text: string, options?: PromptOptions) => string> = {
  [AiOperation.SUMMARIZE]: (text) => `Please provide a concise summary of the following text:\n\n---\n${text}\n---`,
  [AiOperation.REWRITE_FORMAL]: (text) => `Rewrite the following text using a more formal and professional tone. Ensure clarity and precision:\n\n---\n${text}\n---`,
  [AiOperation.REWRITE_CASUAL]: (text) => `Rewrite the following text in a more casual, friendly, and conversational tone:\n\n---\n${text}\n---`,
  [AiOperation.EXPAND]: (text) => `Expand on the following text. Add relevant details, examples, or explanations to make it more comprehensive:\n\n---\n${text}\n---`,
  [AiOperation.CHECK_GRAMMAR_POLISH]: (text) => `Review the following text for any grammatical errors, spelling mistakes, punctuation issues, and awkward phrasing. Polish the language for improved clarity, conciseness, and flow. Return only the corrected and polished version of the text:\n\n---\n${text}\n---`,
  [AiOperation.SIMPLIFY]: (text) => `Simplify the language of the following text. Make it easier to understand for a general audience, avoiding jargon and complex sentence structures:\n\n---\n${text}\n---`,
  [AiOperation.GENERATE_IDEAS]: (text) => `Based on the following topic or initial thoughts, generate 3-5 distinct ideas or angles for further exploration. Present them as a bulleted list. If the input is not a topic, ask for a topic.\n\nTopic/Thoughts:\n---\n${text}\n---`,
  [AiOperation.TRANSLATE]: (text, options) => {
    if (!options || !options.targetLang) {
      // Fallback, though UI should prevent this.
      return `Translate the following text to English (target language not specified):\n\n---\n${text}\n---`;
    }
    const { sourceLang, targetLang } = options;
    if (sourceLang && sourceLang.toLowerCase() !== 'auto-detect' && sourceLang.toLowerCase() !== 'auto') {
      return `Translate the following text from ${sourceLang} to ${targetLang}. Provide only the translated text:\n\n---\n${text}\n---`;
    }
    return `Detect the language of the following text and then translate it to ${targetLang}. Provide only the translated text:\n\n---\n${text}\n---`;
  },
};

export const AVAILABLE_OPERATIONS: AiOperation[] = [
  AiOperation.SUMMARIZE,
  AiOperation.REWRITE_FORMAL,
  AiOperation.REWRITE_CASUAL,
  AiOperation.EXPAND,
  AiOperation.CHECK_GRAMMAR_POLISH,
  AiOperation.SIMPLIFY,
  AiOperation.GENERATE_IDEAS,
  // AiOperation.TRANSLATE, // Translate button is now separate in UI
];

// Operations for the main toolbar buttons, excluding the dedicated translate button
export const MAIN_TOOLBAR_OPERATIONS: AiOperation[] = [
  AiOperation.SUMMARIZE,
  AiOperation.REWRITE_FORMAL,
  AiOperation.REWRITE_CASUAL,
  AiOperation.EXPAND,
  AiOperation.CHECK_GRAMMAR_POLISH,
  AiOperation.SIMPLIFY,
  AiOperation.GENERATE_IDEAS,
];


export const LOCAL_STORAGE_SOURCE_LANG_KEY = 'aiCoPilotSourceLanguage';
export const LOCAL_STORAGE_TARGET_LANG_KEY = 'aiCoPilotTargetLanguage';
export const DEFAULT_TARGET_LANGUAGE_CODE = 'en'; // Default to English
export const DEFAULT_SOURCE_LANGUAGE_CODE = 'auto';