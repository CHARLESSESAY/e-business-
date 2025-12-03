import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are "Salone BizBot", the official AI assistant for the Sierra Leone Electronic Business Register. 
Your goal is to help users navigate the business registry, understand legal forms, and explain the annual report process.

CRITICAL LANGUAGE INSTRUCTION:
- You MUST be able to explain concepts in English and Chinese (Simplified).
- If the user asks in English, reply in clear, professional English.
- If the user asks in Chinese, reply in Chinese.
- Keep answers concise and helpful.

Context:
- The platform uses a blockchain ledger for transparency.
- Users can search for companies, view capital, and legal status.
- Admin approval is required for annual reports containing proven transaction numbers.
`;

export const getGeminiResponse = async (userMessage: string, chatHistory: {role: 'user' | 'model', parts: { text: string }[]}[] = []) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, connection error. Please try again later.";
  }
};