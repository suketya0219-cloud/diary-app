import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '' });

export async function generateDiarySummary(events: string[]): Promise<string> {
  const prompt = `以下は今日の出来事のリストです。これをもとに、一人称で自然な日記の文章を200字程度で書いてください。\n\n${events.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text ?? '';
}

export async function chat(history: { role: 'user' | 'model'; text: string }[], userMessage: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: userMessage }] },
    ],
  });
  return response.text ?? '';
}
