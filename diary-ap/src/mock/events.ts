import type {
  Activity,
  AppUser,
  EventBelonging,
  EventMessage,
  EventPhoto,
  EventResponse,
  EventRole,
  Place,
  SharedEvent,
  UserMemory,
  WeatherForecast,
} from '@/types/events';

export const TODAY = new Date().toISOString().slice(0, 10);

export const MOCK_USERS: AppUser[] = [
  { id: 'u-me', displayName: '自分', avatar: '私' },
  { id: 'u-tanaka', displayName: '田中さん', avatar: '田' },
  { id: 'u-sato', displayName: '佐藤さん', avatar: '佐' },
  { id: 'u-yamamoto', displayName: '山本さん', avatar: '山' },
];

export const CURRENT_USER_ID = 'u-me';

export const MOCK_PLACES: Place[] = [
  {
    id: 'place-nakanoshima-tennis',
    name: '中之島テニスコート',
    address: '大阪府大阪市北区中之島',
    lat: 34.6921,
    lng: 135.4966,
  },
  {
    id: 'place-umeda-chayamachi',
    name: '梅田 茶屋町',
    address: '大阪府大阪市北区茶屋町',
    lat: 34.7054,
    lng: 135.4998,
  },
  {
    id: 'place-osaka-station',
    name: '大阪駅',
    address: '大阪府大阪市北区梅田3丁目',
    lat: 34.7025,
    lng: 135.4959,
  },
];

export const MOCK_EVENTS: SharedEvent[] = [
  {
    id: 'event-tennis',
    title: 'テニス練習',
    startAt: `${TODAY}T10:00`,
    endAt: `${TODAY}T11:30`,
    location: '中之島テニスコート',
    place: MOCK_PLACES[0],
    description: '田中さんと軽く練習。終わったら近くでコーヒー。',
    creatorUserId: 'u-me',
    participantIds: ['u-me', 'u-tanaka'],
    status: 'shared',
    diaryEnabled: true,
    sharedVia: ['LINE'],
    calendarAddedUserIds: ['u-me'],
    history: ['予定を作成', 'LINEで共有済み'],
    roles: [
      { id: 'role-1', userId: 'u-me', title: 'コート予約確認', source: 'event_detail', done: false },
      { id: 'role-2', userId: 'u-tanaka', title: 'ボールを持ってくる', source: 'message', done: false },
    ],
    belongings: [
      { id: 'belonging-1', label: 'ラケット', ownerUserId: 'u-me', source: 'event_detail', checked: false },
      { id: 'belonging-2', label: 'タオル', ownerUserId: 'u-me', source: 'weather', checked: false },
      { id: 'belonging-3', label: '飲み物', ownerUserId: null, source: 'weather', checked: false },
    ],
  },
  {
    id: 'event-dinner',
    title: '梅田で夕食',
    startAt: `${TODAY}T18:30`,
    endAt: `${TODAY}T20:00`,
    location: '梅田 茶屋町',
    place: MOCK_PLACES[1],
    description: '佐藤さんと近況共有。',
    creatorUserId: 'u-sato',
    participantIds: ['u-me', 'u-sato'],
    status: 'confirmed',
    diaryEnabled: true,
    sharedVia: ['アプリ招待'],
    calendarAddedUserIds: [],
    history: ['佐藤さんから招待', '参加済み'],
    roles: [
      { id: 'role-3', userId: 'u-sato', title: 'お店の候補を送る', source: 'message', done: true },
      { id: 'role-4', userId: 'u-me', title: '駅からの行き方を確認', source: 'place', done: false },
    ],
    belongings: [
      { id: 'belonging-4', label: 'モバイルバッテリー', ownerUserId: 'u-me', source: 'suggested', checked: false },
    ],
  },
  {
    id: 'event-meeting',
    title: '定例ミーティング',
    startAt: `${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}T09:30`,
    endAt: `${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}T10:00`,
    location: 'オンライン',
    place: null,
    description: '週次の確認。',
    creatorUserId: 'u-me',
    participantIds: ['u-me', 'u-yamamoto'],
    status: 'draft',
    diaryEnabled: false,
    sharedVia: [],
    calendarAddedUserIds: [],
    history: ['下書き作成'],
    roles: [],
    belongings: [],
  },
];

export const MOCK_RESPONSES: EventResponse[] = [
  { eventId: 'event-tennis', userId: 'u-me', status: 'accepted' },
  { eventId: 'event-tennis', userId: 'u-tanaka', status: 'pending' },
  { eventId: 'event-dinner', userId: 'u-me', status: 'accepted' },
  { eventId: 'event-dinner', userId: 'u-sato', status: 'accepted' },
  { eventId: 'event-meeting', userId: 'u-me', status: 'accepted' },
  { eventId: 'event-meeting', userId: 'u-yamamoto', status: 'pending' },
];

export const MOCK_MESSAGES: EventMessage[] = [
  { id: 'msg-1', eventId: 'event-tennis', userId: 'u-me', text: '10時にコート前で集合で大丈夫？', sentAt: `${TODAY}T08:20` },
  { id: 'msg-2', eventId: 'event-tennis', userId: 'u-tanaka', text: 'OK！少し早めに着くと思う。', sentAt: `${TODAY}T08:31` },
];

export const MOCK_PHOTOS: EventPhoto[] = [
  { id: 'photo-1', eventId: 'event-tennis', userId: 'u-me', label: 'コート', sharedAt: `${TODAY}T11:45` },
  { id: 'photo-2', eventId: 'event-dinner', userId: 'u-sato', label: '夕食', sharedAt: `${TODAY}T19:28` },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-calendar',
    type: 'calendar',
    title: '午前：テニス練習',
    occurredAt: `${TODAY}T10:00`,
    includedInDiary: true,
    confidence: 0.95,
    personId: 'u-tanaka',
    location: '中之島テニスコート',
    category: '運動',
  },
  {
    id: 'act-shared',
    type: 'shared_event',
    title: '梅田で夕食',
    occurredAt: `${TODAY}T18:30`,
    includedInDiary: true,
    confidence: 0.9,
    personId: 'u-sato',
    location: '梅田 茶屋町',
    category: '食事',
  },
  {
    id: 'act-photo-1',
    type: 'photo',
    title: 'テニスコートの写真',
    occurredAt: `${TODAY}T11:42`,
    includedInDiary: true,
    confidence: 0.82,
    location: '中之島',
    category: '写真',
  },
  {
    id: 'act-health',
    type: 'health',
    title: '8,420歩・運動45分',
    occurredAt: `${TODAY}T21:00`,
    includedInDiary: true,
    confidence: 1,
    category: '健康',
  },
  {
    id: 'act-note',
    type: 'note',
    title: 'メモ：夕方は少し疲れていた',
    occurredAt: `${TODAY}T20:40`,
    includedInDiary: true,
    confidence: 1,
    category: 'メモ',
  },
  {
    id: 'act-location',
    type: 'location',
    title: '訪問場所候補：梅田',
    occurredAt: `${TODAY}T18:15`,
    includedInDiary: false,
    confidence: 0.64,
    location: '梅田',
    category: '場所',
  },
];

export const MOCK_WEATHER: WeatherForecast[] = [
  {
    date: TODAY,
    area: '大阪市',
    summary: 'くもり時々晴れ',
    highC: 30,
    lowC: 24,
    rainProbability: 30,
    wind: '南西の風 3m',
    suggestion: '屋外予定は飲み物とタオルがあると安心です。',
  },
  {
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    area: '大阪市',
    summary: '晴れ',
    highC: 31,
    lowC: 23,
    rainProbability: 10,
    wind: '弱い風',
    suggestion: '移動が多い場合は日差し対策を入れておくと良さそうです。',
  },
];

export const MOCK_MEMORIES: UserMemory[] = [
  {
    id: 'memory-1',
    userIds: ['u-me', 'u-tanaka'],
    title: '先月のテニス練習',
    date: '2026-05-18',
    summary: '中之島で練習。次はサーブを重点的にやる話をした。',
  },
  {
    id: 'memory-2',
    userIds: ['u-me', 'u-sato'],
    title: '春の梅田ランチ',
    date: '2026-04-12',
    summary: '茶屋町でランチ。仕事の近況と旅行の話をした。',
  },
];

export function getUserById(id: string): AppUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getEventById(id: string): SharedEvent | undefined {
  return MOCK_EVENTS.find((e) => e.id === id);
}

export function getResponseFor(eventId: string, userId: string): EventResponse | undefined {
  return MOCK_RESPONSES.find((r) => r.eventId === eventId && r.userId === userId);
}

export function getWeatherForDate(date: string): WeatherForecast | undefined {
  return MOCK_WEATHER.find((w) => w.date === date) ?? MOCK_WEATHER[0];
}
