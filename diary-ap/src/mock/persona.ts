export type Friend = {
  id: string;
  name: string;
  relation: string;
  avatarEmoji: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export const PERSONA = {
  name: '田村 颯',
  age: 28,
  occupation: 'ITスタートアップ PM',
  location: '東京・渋谷区',
  hobbies: ['テニス', '料理', '映画鑑賞'],
};

export const FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: '佐藤 健',
    relation: '大学友人・テニス仲間',
    avatarEmoji: '🧑',
    lastMessage: '日曜のテニス楽しかった！また来週も行こうよ',
    lastMessageTime: '2026-06-29T10:30:00',
    unreadCount: 0,
  },
  {
    id: 'f2',
    name: '山田 彩',
    relation: '職場同僚',
    avatarEmoji: '👩',
    lastMessage: '明日のランチどうする？',
    lastMessageTime: '2026-07-01T17:45:00',
    unreadCount: 1,
  },
  {
    id: 'f3',
    name: '鈴木 翔',
    relation: '幼馴染',
    avatarEmoji: '🧑‍💻',
    lastMessage: 'あのゲームクリアしたわ笑',
    lastMessageTime: '2026-06-28T22:10:00',
    unreadCount: 0,
  },
  {
    id: 'f4',
    name: '中村 美咲',
    relation: 'テニスクラブ仲間',
    avatarEmoji: '👩‍🦱',
    lastMessage: '来週の練習何時から？',
    lastMessageTime: '2026-07-01T20:00:00',
    unreadCount: 2,
  },
  {
    id: 'f5',
    name: '高橋 大輔',
    relation: '大学友人',
    avatarEmoji: '👨‍💼',
    lastMessage: '今月飲みいこうよ',
    lastMessageTime: '2026-06-25T19:30:00',
    unreadCount: 0,
  },
  {
    id: 'family',
    name: '家族グループ',
    relation: '家族',
    avatarEmoji: '🏠',
    lastMessage: 'お父さんの誕生日来月だよ〜',
    lastMessageTime: '2026-06-30T20:00:00',
    unreadCount: 3,
  },
];
