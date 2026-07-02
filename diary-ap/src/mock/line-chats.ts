export type ChatMessage = {
  id: string;
  friendId: string;
  sender: 'me' | 'friend';
  body: string;
  time: string;
};

function dt(date: string, h: number, m: number) {
  return `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

export const LINE_CHAT_MESSAGES: ChatMessage[] = [
  // 佐藤 健（テニス仲間）
  { id: 'c1',  friendId: 'f1', sender: 'friend', body: '今度の日曜テニスどう？', time: dt('2026-06-27', 18, 30) },
  { id: 'c2',  friendId: 'f1', sender: 'me',     body: '行けるよ！10時から？', time: dt('2026-06-27', 18, 45) },
  { id: 'c3',  friendId: 'f1', sender: 'friend', body: 'おk！コート取っておく', time: dt('2026-06-27', 19, 0) },
  { id: 'c4',  friendId: 'f1', sender: 'me',     body: 'ありがとう！よろしく', time: dt('2026-06-27', 19, 5) },
  { id: 'c5',  friendId: 'f1', sender: 'friend', body: '日曜のテニス楽しかった！また来週も行こうよ', time: dt('2026-06-29', 10, 30) },
  { id: 'c6',  friendId: 'f1', sender: 'me',     body: 'めちゃ楽しかった！来週もよろしく', time: dt('2026-06-29', 11, 0) },
  { id: 'c7',  friendId: 'f1', sender: 'friend', body: '火曜の夜練習どう？中村さんも来るって', time: dt('2026-07-01', 12, 0) },
  { id: 'c8',  friendId: 'f1', sender: 'me',     body: '行く行く！何時から？', time: dt('2026-07-01', 12, 30) },
  { id: 'c9',  friendId: 'f1', sender: 'friend', body: '19時から目黒コートで', time: dt('2026-07-01', 12, 35) },

  // 山田 彩（職場同僚）
  { id: 'c10', friendId: 'f2', sender: 'friend', body: 'ランチどこ行く？', time: dt('2026-06-30', 11, 50) },
  { id: 'c11', friendId: 'f2', sender: 'me',     body: '渋谷の新しいタイ料理どうかな', time: dt('2026-06-30', 11, 52) },
  { id: 'c12', friendId: 'f2', sender: 'friend', body: 'いいね！行こう行こう', time: dt('2026-06-30', 11, 55) },
  { id: 'c13', friendId: 'f2', sender: 'friend', body: 'あそこ美味しかったね〜また行きたい', time: dt('2026-06-30', 14, 0) },
  { id: 'c14', friendId: 'f2', sender: 'me',     body: 'ほんとに！スパイスが本格的だった', time: dt('2026-06-30', 14, 10) },
  { id: 'c15', friendId: 'f2', sender: 'friend', body: '明日のランチどうする？', time: dt('2026-07-01', 17, 45) },

  // 鈴木 翔（幼馴染）
  { id: 'c16', friendId: 'f3', sender: 'friend', body: 'ゼルダの新作やった？', time: dt('2026-06-26', 21, 0) },
  { id: 'c17', friendId: 'f3', sender: 'me',     body: 'まだ！面白い？', time: dt('2026-06-26', 21, 30) },
  { id: 'c18', friendId: 'f3', sender: 'friend', body: 'めちゃくちゃ面白いよ、買って', time: dt('2026-06-26', 21, 32) },
  { id: 'c19', friendId: 'f3', sender: 'me',     body: '検討するわ笑 最近どう？', time: dt('2026-06-27', 9, 0) },
  { id: 'c20', friendId: 'f3', sender: 'friend', body: '仕事忙しい〜でもなんとか。あのゲームクリアしたわ笑', time: dt('2026-06-28', 22, 10) },

  // 中村 美咲（テニスクラブ）
  { id: 'c21', friendId: 'f4', sender: 'friend', body: '火曜の練習来る？', time: dt('2026-06-30', 19, 0) },
  { id: 'c22', friendId: 'f4', sender: 'me',     body: '行きます！よろしくお願いします', time: dt('2026-06-30', 19, 30) },
  { id: 'c23', friendId: 'f4', sender: 'friend', body: '佐藤さんも来るって言ってたよ', time: dt('2026-06-30', 19, 35) },
  { id: 'c24', friendId: 'f4', sender: 'me',     body: 'じゃあ揃うね！楽しみ', time: dt('2026-06-30', 20, 0) },
  { id: 'c25', friendId: 'f4', sender: 'friend', body: '来週の練習何時から？', time: dt('2026-07-01', 20, 0) },

  // 高橋 大輔（大学友人）
  { id: 'c26', friendId: 'f5', sender: 'friend', body: '久しぶり！元気？', time: dt('2026-06-24', 20, 0) },
  { id: 'c27', friendId: 'f5', sender: 'me',     body: '元気だよ！最近仕事忙しかった', time: dt('2026-06-24', 20, 30) },
  { id: 'c28', friendId: 'f5', sender: 'friend', body: 'そっか〜お互い頑張ろう', time: dt('2026-06-24', 20, 35) },
  { id: 'c29', friendId: 'f5', sender: 'friend', body: '今月飲みいこうよ', time: dt('2026-06-25', 19, 30) },
  { id: 'c30', friendId: 'f5', sender: 'me',     body: 'いいね！週末どう？', time: dt('2026-06-25', 20, 0) },

  // 家族グループ
  { id: 'c31', friendId: 'family', sender: 'friend', body: '今週末帰ってくる？', time: dt('2026-06-28', 18, 0) },
  { id: 'c32', friendId: 'family', sender: 'me',     body: '来週末は帰れると思う！', time: dt('2026-06-28', 18, 30) },
  { id: 'c33', friendId: 'family', sender: 'friend', body: 'じゃあ久しぶりに鍋しよう', time: dt('2026-06-28', 18, 45) },
  { id: 'c34', friendId: 'family', sender: 'friend', body: 'お父さんの誕生日来月だよ〜', time: dt('2026-06-30', 20, 0) },
  { id: 'c35', friendId: 'family', sender: 'friend', body: '何かプレゼントどう？みんなで割り勘', time: dt('2026-07-01', 10, 0) },
];
