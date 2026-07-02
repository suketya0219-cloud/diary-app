export interface BrowserHistoryMock {
  time: string;
  title: string;
  url: string;
  category: 'テニス' | '料理' | '映画' | '仕事' | 'ショッピング' | 'ニュース' | 'その他';
}

function dt(date: string, h: number, m: number) {
  return `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

export const BROWSER_HISTORY_MOCK: BrowserHistoryMock[] = [
  // 仕事
  { time: dt('2026-07-01', 9, 10), title: 'Notion – プロジェクト管理', url: 'https://notion.so', category: '仕事' },
  { time: dt('2026-07-01', 10, 30), title: 'Figma – UI設計', url: 'https://figma.com', category: '仕事' },
  { time: dt('2026-06-30', 9, 0), title: 'GitHub – コードレビュー', url: 'https://github.com', category: '仕事' },
  { time: dt('2026-06-30', 14, 20), title: 'Zenn – React Native 記事', url: 'https://zenn.dev', category: '仕事' },
  { time: dt('2026-06-27', 11, 0), title: 'Google Analytics – ダッシュボード', url: 'https://analytics.google.com', category: '仕事' },
  { time: dt('2026-06-26', 10, 15), title: 'Slack – チャンネル確認', url: 'https://slack.com', category: '仕事' },
  { time: dt('2026-06-25', 14, 0), title: 'Product Hunt – 新着プロダクト', url: 'https://producthunt.com', category: '仕事' },
  { time: dt('2026-06-20', 10, 30), title: 'Expo SDK 56 ドキュメント', url: 'https://docs.expo.dev', category: '仕事' },
  { time: dt('2026-06-18', 9, 45), title: 'Linear – タスク管理', url: 'https://linear.app', category: '仕事' },

  // テニス
  { time: dt('2026-07-01', 7, 30), title: 'テニス サーブ改善 フォーム 解説 – YouTube', url: 'https://youtube.com', category: 'テニス' },
  { time: dt('2026-06-29', 12, 0), title: '目黒 テニスコート 予約 – スポーツ施設', url: 'https://sportsnavi.com', category: 'テニス' },
  { time: dt('2026-06-27', 20, 0), title: 'バックハンド 両手打ち コツ – YouTube', url: 'https://youtube.com', category: 'テニス' },
  { time: dt('2026-06-24', 21, 0), title: 'テニスラケット 2026 おすすめ – 楽天', url: 'https://rakuten.co.jp', category: 'テニス' },
  { time: dt('2026-06-22', 20, 30), title: 'ウィンブルドン 2026 速報', url: 'https://tennis365.net', category: 'テニス' },
  { time: dt('2026-06-15', 7, 15), title: 'テニス フットワーク トレーニング', url: 'https://youtube.com', category: 'テニス' },
  { time: dt('2026-06-08', 21, 0), title: 'テニスシューズ 比較 2026', url: 'https://amazon.co.jp', category: 'テニス' },

  // 料理
  { time: dt('2026-07-01', 19, 0), title: 'チキンのレモン煮 レシピ – クックパッド', url: 'https://cookpad.com', category: '料理' },
  { time: dt('2026-06-30', 20, 30), title: '豚の角煮 失敗しない作り方 – クラシル', url: 'https://kurashiru.com', category: '料理' },
  { time: dt('2026-06-28', 19, 30), title: '作り置き 一週間 レシピ – Delish Kitchen', url: 'https://delishkitchen.tv', category: '料理' },
  { time: dt('2026-06-25', 18, 0), title: 'スパイスカレー 自作 初心者', url: 'https://cookpad.com', category: '料理' },
  { time: dt('2026-06-21', 20, 0), title: 'パスタ ペペロンチーノ 本格レシピ', url: 'https://kurashiru.com', category: '料理' },
  { time: dt('2026-06-14', 19, 0), title: '鶏むね肉 やわらかくする方法', url: 'https://cookpad.com', category: '料理' },
  { time: dt('2026-06-07', 20, 30), title: '豚汁 具材 組み合わせ', url: 'https://delishkitchen.tv', category: '料理' },

  // 映画
  { time: dt('2026-06-30', 21, 30), title: '映画「インターステラー」レビュー – Filmarks', url: 'https://filmarks.com', category: '映画' },
  { time: dt('2026-06-28', 22, 0), title: 'Netflix 新着映画 2026年7月', url: 'https://netflix.com', category: '映画' },
  { time: dt('2026-06-21', 22, 30), title: '新宿 映画館 上映スケジュール', url: 'https://eigakan.org', category: '映画' },
  { time: dt('2026-06-14', 21, 0), title: '映画「DUNE: Part 3」公開日', url: 'https://eiga.com', category: '映画' },
  { time: dt('2026-06-07', 22, 0), title: 'Amazon Prime Video おすすめ映画', url: 'https://amazon.co.jp', category: '映画' },

  // ショッピング
  { time: dt('2026-06-29', 15, 0), title: 'メカニカルキーボード おすすめ 2026 – Amazon', url: 'https://amazon.co.jp', category: 'ショッピング' },
  { time: dt('2026-06-26', 19, 0), title: 'ユニクロ 夏 新作 メンズ', url: 'https://uniqlo.com', category: 'ショッピング' },
  { time: dt('2026-06-17', 16, 30), title: 'ZARA メンズ 夏コレクション', url: 'https://zara.com', category: 'ショッピング' },
  { time: dt('2026-06-11', 20, 0), title: 'アロマキャンドル おしゃれ – 楽天', url: 'https://rakuten.co.jp', category: 'ショッピング' },

  // ニュース
  { time: dt('2026-07-02', 7, 0), title: 'テックニュース – Techcrunch Japan', url: 'https://jp.techcrunch.com', category: 'ニュース' },
  { time: dt('2026-07-01', 7, 15), title: 'AI最新動向 2026年7月 – ITmedia', url: 'https://itmedia.co.jp', category: 'ニュース' },
  { time: dt('2026-06-30', 7, 10), title: '日経ビジネス – スタートアップ特集', url: 'https://business.nikkei.com', category: 'ニュース' },
  { time: dt('2026-06-25', 7, 0), title: 'Googleの新AI発表 – Gigazine', url: 'https://gigazine.net', category: 'ニュース' },
];
