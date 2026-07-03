import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Shadow, Spacing } from '@/constants/theme';

const AI_MENU = [
  {
    key: 'chat',
    emoji: '💬',
    title: '会話',
    description: 'AIと自由に話す',
    route: '/ai-chat-screen',
    colors: ['#2D8A5E', '#1A4731'] as const,
  },
  {
    key: 'fortune',
    emoji: '🔮',
    title: '占い',
    description: '行動データから今日の運勢を診断',
    route: '/ai-content/fortune',
    colors: ['#7C3AED', '#4C1D95'] as const,
  },
  {
    key: 'data',
    emoji: '📊',
    title: 'データ分析',
    description: '1ヶ月の行動パターンを可視化',
    route: '/ai-content/data',
    colors: ['#1D4ED8', '#1E3A8A'] as const,
  },
  {
    key: 'personality',
    emoji: '🧠',
    title: '性格診断',
    description: '行動傾向から性格タイプを分析',
    route: '/ai-content/personality',
    colors: ['#B45309', '#78350F'] as const,
  },
] as const;

export default function AIMenuScreen() {
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
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
                  <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.desc}>{item.description}</ThemedText>
                </LinearGradient>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  cardWrapper: {
    width: '47%',
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadow.strong,
  },
  card: {
    padding: Spacing.three,
    gap: Spacing.one,
    minHeight: 140,
    justifyContent: 'flex-end',
  },
  emoji: { fontSize: 36, marginBottom: Spacing.one },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  desc: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 17 },
});
