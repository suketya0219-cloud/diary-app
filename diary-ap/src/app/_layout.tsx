import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* タブ群（ホーム・予定・出来事・日記・AI） */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* 予定詳細（タブ外・フルスクリーン） */}
        <Stack.Screen name="events/[id]" options={{ title: '予定' }} />
        <Stack.Screen name="events/create" options={{ title: '予定を作る' }} />

        {/* 日記生成後の確認・編集 */}
        <Stack.Screen name="diary-confirm" options={{ title: '今日の日記' }} />

        {/* 過去の日記詳細・編集（日付別） */}
        <Stack.Screen name="diary/[date]" options={{ title: '日記' }} />

        {/* LINEチャット（友達別） */}
        <Stack.Screen name="line-chat/[friendId]" options={{ title: 'トーク' }} />

        {/* 設定 */}
        <Stack.Screen name="settings" options={{ title: '設定' }} />
      </Stack>
    </ThemeProvider>
  );
}
