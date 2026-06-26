// ─── カレンダーサービス ───────────────────────────────────────────────────────
//
// TODO: インストールが必要
//   npx expo install expo-calendar
//
// 仕様:
//   - 今日のカレンダー予定を取得して日記に反映する
//   - iOSはカレンダーアクセス権限が必要
//
// インストール後にコメントアウトを外すだけで動く。

// import * as Calendar from 'expo-calendar';

export interface CalendarEvent {
  title: string;
  startTime: string; // ISO8601
  endTime: string;   // ISO8601
  location?: string;
  notes?: string;
}

export const CalendarService = {
  // 今日の予定一覧を取得する
  async getTodayEvents(): Promise<CalendarEvent[]> {
    // TODO: expo-calendar導入後に差し替える
    // const { status } = await Calendar.requestCalendarPermissionsAsync();
    // if (status !== 'granted') return [];
    //
    // const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    // const calendarIds = calendars.map(c => c.id);
    //
    // const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    //
    // const events = await Calendar.getEventsAsync(calendarIds, startOfDay, endOfDay);
    // return events.map(e => ({
    //   title: e.title,
    //   startTime: e.startDate,
    //   endTime: e.endDate,
    //   location: e.location ?? undefined,
    //   notes: e.notes ?? undefined,
    // }));

    console.log('[CalendarService] getTodayEvents: 未実装（expo-calendar未導入）');
    return CALENDAR_MOCK;
  },
};

// ── モックデータ（実装前の動作確認用）────────────────────────────────────────
const today = new Date();
const CALENDAR_MOCK: CalendarEvent[] = [
  {
    title: 'チームミーティング（モック）',
    startTime: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    location: 'オンライン',
  },
  {
    title: 'ランチ（モック）',
    startTime: new Date(today.setHours(12, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(13, 0, 0, 0)).toISOString(),
  },
];
