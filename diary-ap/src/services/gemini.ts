const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function callGemini(contents: object[]): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function generateDiarySummary(events: string[]): Promise<string> {
  const text = `以下は今日の出来事のリストです。これをもとに、一人称で自然な日記の文章を200字程度で書いてください。\n\n${events.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;
  return callGemini([{ role: 'user', parts: [{ text }] }]);
}

export async function chat(history: { role: 'user' | 'model'; text: string }[], userMessage: string): Promise<string> {
  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];
  return callGemini(contents);
}
