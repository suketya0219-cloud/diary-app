// ─── 通知サービス ─────────────────────────────────────────────────────────────
//
// TODO: インストールが必要
//   npx expo install expo-notifications
//
// 仕様:
//   - 毎日 settings.autoGenerateTime（例: "22:00"）に通知を送る
//   - 通知タップ → アプリが開いて diary-confirm 画面に遷移
//   - バックグラウンド自動生成はiOS制限で不可。ワンタップが現実的な最善。
//
// インストール後にコメントアウトを外すだけで動く。

// import * as Notifications from 'expo-notifications';

export type NotificationTime = { hour: number; minute: number };

function parseTime(timeStr: string): NotificationTime {
  const [h, m] = timeStr.split(':').map(Number);
  return { hour: h ?? 22, minute: m ?? 0 };
}

export const NotificationService = {
  // 通知権限をリクエストする（アプリ初回起動時に呼ぶ）
  async requestPermission(): Promise<boolean> {
    // TODO: expo-notifications導入後に差し替える
    // const { status } = await Notifications.requestPermissionsAsync();
    // return status === 'granted';
    console.log('[NotificationService] requestPermission: 未実装（expo-notifications未導入）');
    return false;
  },

  // 毎日の自動まとめ通知をスケジュール登録する
  async scheduleDailyReminder(timeStr: string): Promise<void> {
    // TODO: expo-notifications導入後に差し替える
    // const { hour, minute } = parseTime(timeStr);
    // await Notifications.cancelAllScheduledNotificationsAsync();
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: '今日の日記をまとめますか？',
    //     body: 'タップして今日の出来事を確認しましょう。',
    //     data: { screen: 'diary-confirm' },
    //   },
    //   trigger: {
    //     type: Notifications.SchedulableTriggerInputTypes.DAILY,
    //     hour,
    //     minute,
    //   },
    // });
    const { hour, minute } = parseTime(timeStr);
    console.log(`[NotificationService] scheduleDailyReminder: ${hour}:${minute} （未実装）`);
  },

  // スケジュール済み通知をすべてキャンセルする
  async cancelAll(): Promise<void> {
    // TODO: expo-notifications導入後に差し替える
    // await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[NotificationService] cancelAll: 未実装（expo-notifications未導入）');
  },

  // 通知タップ時のハンドラを登録する（_layout.tsx の useEffect 内で呼ぶ）
  setNotificationHandler(): void {
    // TODO: expo-notifications導入後に差し替える
    // Notifications.setNotificationHandler({
    //   handleNotification: async () => ({
    //     shouldShowAlert: true,
    //     shouldPlaySound: false,
    //     shouldSetBadge: false,
    //   }),
    // });
    console.log('[NotificationService] setNotificationHandler: 未実装（expo-notifications未導入）');
  },
};
