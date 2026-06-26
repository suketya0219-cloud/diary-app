// ブラウザ履歴モックデータ
// TODO: 将来的にはブラウザ拡張 / 共有ボタン経由 / Safari Content Extension で実データを取得
// 仕様書参照: データ取得可否と代替手段 > ブラウザ閲覧履歴

export interface BrowserHistoryMock {
  time: string;  // ISO datetime
  title: string;
  url: string;
}

function today(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const BROWSER_HISTORY_MOCK: BrowserHistoryMock[] = [
  { time: today(9, 10), title: 'React Native ドキュメント', url: 'https://reactnative.dev' },
  { time: today(10, 30), title: 'Expo SDK 56 リリースノート', url: 'https://expo.dev' },
  { time: today(12, 5), title: '近くのランチ - Google マップ', url: 'https://maps.google.com' },
  { time: today(15, 20), title: 'SQLite 暗号化 SQLCipher', url: 'https://www.zetetic.net/sqlcipher/' },
  { time: today(20, 0), title: 'Apple Foundation Models WWDC25', url: 'https://developer.apple.com' },
];
