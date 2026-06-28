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

export type DiaryContext = {
  diary_text: string;
  summary: string;
  places: string[];
  activities: string[];
  mood: string;
  with_people: string[];
};

const MOOD_OPTIONS = '充実・楽しい・穏やか・疲れた・普通・憂鬱';

export async function generateDiaryEntry(input: DiaryInput): Promise<DiaryContext> {
  const sections: string[] = [];

  if (input.location) sections.push(`【場所】${input.location}`);
  if (input.steps != null) sections.push(`【歩数】${input.steps.toLocaleString()}歩`);
  if (input.photoCount != null && input.photoCount > 0) sections.push(`【写真】${input.photoCount}枚撮影`);
  if (input.calendarEvents && input.calendarEvents.length > 0)
    sections.push(`【出来事・予定】\n${input.calendarEvents.map(e => `・${e}`).join('\n')}`);
  if (input.lineMessages && input.lineMessages.length > 0)
    sections.push(`【LINEのやりとり】\n${input.lineMessages.map(m => `・${m.sender}と「${m.body.slice(0, 30)}」`).join('\n')}`);
  if (input.browserHistory && input.browserHistory.length > 0)
    sections.push(`【調べたこと】\n${input.browserHistory.map(b => `・${b.title}`).join('\n')}`);

  const dataBlock = sections.join('\n\n');

  const prompt = `あなたは個人コンテキスト記録AIです。以下の行動データをもとに、日記テキストと構造化コンテキストを生成してください。

## 行動データ（${input.date}）
${dataBlock}

## 出力ルール
- 必ず以下のJSON形式のみで出力する（前後に説明文を入れない）
- diary_text: 本人が書いたような自然な一人称の日記。です・ます調。200〜350文字。データにないことは書かない。箇条書きにしない。
- summary: 今日を一言で表す20文字以内の要約
- places: 今日訪れた・言及された場所の配列
- activities: 今日行った活動カテゴリの配列（例: 運動、食事、仕事、移動、買い物）
- mood: 今日の気分を「${MOOD_OPTIONS}」から1つ選ぶ
- with_people: 今日一緒にいた・やりとりした人の名前の配列（不明な場合は空配列）

## 出力形式
\`\`\`json
{
  "diary_text": "...",
  "summary": "...",
  "places": [],
  "activities": [],
  "mood": "...",
  "with_people": []
}
\`\`\``;

  const raw = await callGemini([{ role: 'user', parts: [{ text: prompt }] }]);

  try {
    const match = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
    const json = match ? match[1] : raw;
    return JSON.parse(json) as DiaryContext;
  } catch {
    return {
      diary_text: raw,
      summary: '',
      places: [],
      activities: [],
      mood: '普通',
      with_people: [],
    };
  }
}

export async function chat(history: { role: 'user' | 'model'; text: string }[], userMessage: string): Promise<string> {
  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];
  return callGemini(contents);
}
