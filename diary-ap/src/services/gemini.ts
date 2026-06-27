const API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '').replace(/[^\x20-\x7E]/g, '');
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function callGemini(contents: object[]): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({ contents }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export type DiaryInput = {
  date: string;
  location?: string;
  photoCount?: number;
  steps?: number;
  calendarEvents?: string[];
  lineMessages?: { sender: string; body: string }[];
  browserHistory?: { title: string }[];
};

export async function generateDiaryEntry(input: DiaryInput): Promise<string> {
  const sections: string[] = [];

  if (input.location) sections.push(`【場所】${input.location}`);
  if (input.steps != null) sections.push(`【歩数】${input.steps.toLocaleString()}歩`);
  if (input.photoCount != null && input.photoCount > 0) sections.push(`【写真】${input.photoCount}枚撮影`);
  if (input.calendarEvents && input.calendarEvents.length > 0)
    sections.push(`【予定】\n${input.calendarEvents.map(e => `・${e}`).join('\n')}`);
  if (input.lineMessages && input.lineMessages.length > 0)
    sections.push(`【LINEのやりとり】\n${input.lineMessages.map(m => `・${m.sender}と「${m.body.slice(0, 30)}」`).join('\n')}`);
  if (input.browserHistory && input.browserHistory.length > 0)
    sections.push(`【調べたこと】\n${input.browserHistory.map(b => `・${b.title}`).join('\n')}`);

  const dataBlock = sections.join('\n\n');

  const prompt = `あなたは日記執筆アシスタントです。以下の今日の行動データをもとに、本人が書いたような自然な一人称の日記を生成してください。

## ルール
- 「です・ます」調で統一する
- 200〜350文字程度
- データにないことは書かない（推測・創作しない）
- 箇条書きにせず、会話的な文章で書く
- 日付の書き出しは不要

## 今日のデータ（${input.date}）
${dataBlock}

## 日記`;

  return callGemini([{ role: 'user', parts: [{ text: prompt }] }]);
}

export async function chat(history: { role: 'user' | 'model'; text: string }[], userMessage: string): Promise<string> {
  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];
  return callGemini(contents);
}
