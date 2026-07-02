import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AI_MENU = [
  {
    key: 'chat',
    emoji: '💬',
    title: '会話',
    description: 'AIと自由に話す',
    route: '/ai-chat-screen',
  },
  {
    key: 'fortune',
    emoji: '🔮',
    title: '占い',
    description: '行動データから今日の運勢を診断',
    route: '/ai-content/fortune',
  },
  {
    key: 'data',
    emoji: '📊',
    title: 'データ分析',
    description: '1ヶ月の行動パターンを可視化',
    route: '/ai-content/data',
  },
  {
    key: 'personality',
    emoji: '🧠',
    title: '性格診断',
    description: '行動傾向から性格タイプを分析',
    route: '/ai-content/personality',
  },
] as const;

export default function AIMenuScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          <View style={styles.header}>
            <ThemedText type="subtitle">AI</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              あなたのデータをもとにAIが分析します
            </ThemedText>
          </View>

          <View style={styles.grid}>
            {AI_MENU.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.cardWrapper}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
              >
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.desc}>
                    {item.description}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.four },
  header: { gap: Spacing.one },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  cardWrapper: { width: '47%' },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
    minHeight: 130,
  },
  emoji: { fontSize: 32, marginBottom: Spacing.one },
  desc: { marginTop: 2, lineHeight: 18 },
});
