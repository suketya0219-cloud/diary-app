// LINEモックデータ
// TODO: 将来的にはバックアップエクスポート / 公式API / 共有シート経由で実データを取得
// 仕様書参照: データ取得可否と代替手段 > LINE会話ログ

export interface LineMockMessage {
  time: string;    // ISO datetime
  sender: string;
  body: string;
}

// 今日の日付ベースでダミーデータを生成
function today(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const LINE_MOCK_MESSAGES: LineMockMessage[] = [
  { time: today(8, 15), sender: '田中', body: '今日の昼、一緒にランチどう？' },
  { time: today(8, 20), sender: 'あなた', body: 'いいね！12時に〇〇で！' },
  { time: today(12, 45), sender: '田中', body: 'ごちそうさまでした〜' },
  { time: today(12, 46), sender: 'あなた', body: 'こちらこそ！またね' },
  { time: today(19, 30), sender: '家族グループ', body: '夕飯できたよ〜' },
];
