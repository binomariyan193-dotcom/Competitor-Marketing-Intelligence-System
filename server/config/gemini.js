import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ WARNING: GEMINI_API_KEY is not set in process.env. Gemini API features will use synthesized intelligence fallback.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
export const GEMINI_MODEL = 'gemini-2.5-flash';
