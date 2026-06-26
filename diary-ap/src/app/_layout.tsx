import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

// タブナビゲーション（boilerplate）からStackナビゲーションに変更
// 全画面に左上の戻るボタンが自動的につく（Stackのデフォルト動作）
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* ホーム: ヘッダー非表示（カスタムレイアウトを使用） */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* カレンダー */}
        <Stack.Screen name="calendar" options={{ title: 'カレンダー' }} />

        {/* 日記生成後の確認・編集 */}
        <Stack.Screen name="diary-confirm" options={{ title: '今日の日記' }} />

        {/* 過去の日記詳細・編集（日付別） */}
        <Stack.Screen name="diary/[date]" options={{ title: '日記' }} />

        {/* 設定 */}
        <Stack.Screen name="settings" options={{ title: '設定' }} />

        {/* AIと相談（実装予定） */}
        <Stack.Screen name="ai-chat" options={{ title: 'AIと相談' }} />
      </Stack>
    </ThemeProvider>
  );
}
