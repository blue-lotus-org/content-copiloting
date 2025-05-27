import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiOperation } from '../types';
import { GEMINI_TEXT_MODEL, OPERATION_PROMPTS } from '../constants';

let ai: GoogleGenAI | null = null;
let apiKeyChecked = false;

function getAiInstance(): GoogleGenAI {
  if (!apiKeyChecked) {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable is not set.");
      throw new Error("API_KEY environment variable is not set. Gemini API functionality is disabled.");
    }
    apiKeyChecked = true; 
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }
  return ai;
}

interface GeminiOptions {
  sourceLanguageName?: string;
  targetLanguageName?: string;
}

export async function processTextWithGemini(
  text: string, 
  operation: AiOperation,
  options?: GeminiOptions // Renamed for clarity within this service
): Promise<string> {
  try {
    const geminiAI = getAiInstance();
    const promptGenerator = OPERATION_PROMPTS[operation];
    if (!promptGenerator) {
      throw new Error(`Unsupported operation: ${operation}`);
    }

    let prompt: string;
    if (operation === AiOperation.TRANSLATE) {
        if (!options || !options.targetLanguageName) {
            throw new Error("Target language name not provided for translation.");
        }
        // Cast to the correct type for TRANSLATE prompt generator
        const translatePromptFn = promptGenerator as (text: string, opts: { sourceLang?: string, targetLang: string }) => string;
        prompt = translatePromptFn(text, { sourceLang: options.sourceLanguageName, targetLang: options.targetLanguageName });
    } else {
        // Cast for other operations that only take text
        const standardPromptFn = promptGenerator as (text: string) => string;
        prompt = standardPromptFn(text);
    }

    const response: GenerateContentResponse = await geminiAI.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
    });
    
    const generatedText = response.text;

    if (typeof generatedText === 'string') {
        return generatedText.trim();
    } else {
        console.error("Unexpected response format from Gemini API:", response);
        throw new Error("Received an unexpected response format from the AI. The 'text' property was not found or not a string.");
    }

  } catch (error: any) {
    console.error(`Error calling Gemini API for operation ${operation}:`, error);
    throw new Error(error.message || "An unknown error occurred while communicating with the AI service.");
  }
}