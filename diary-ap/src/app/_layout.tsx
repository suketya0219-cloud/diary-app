import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
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

        {/* AIチャット画面 */}
        <Stack.Screen name="ai-chat-screen" options={{ title: 'AI会話' }} />

        {/* AIコンテンツ（占い・データ・性格） */}
        <Stack.Screen name="ai-content/[type]" options={{ title: 'AI分析' }} />

        {/* LINEチャット（友達別） */}
        <Stack.Screen name="line-chat/[friendId]" options={{ title: 'トーク' }} />

        {/* 設定 */}
        <Stack.Screen name="settings" options={{ title: '設定' }} />
      </Stack>
    </ThemeProvider>
  );
}
