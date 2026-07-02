import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DIARY_HISTORY } from '@/mock/diary-history';
import { BROWSER_HISTORY_MOCK } from '@/mock/browser';
import { chat } from '@/services/gemini';

type ContentType = 'fortune' | 'data' | 'personality';

const CONFIG: Record<ContentType, { emoji: string; title: string; buildPrompt: () => string }> = {
  fortune: {
    emoji: '🔮',
    title: '今日の運勢',
    buildPrompt: () => {
      const recent = DIARY_HISTORY.slice(0, 7).map((d) =>
        `${d.date}: ${d.context.summary}（気分: ${d.context.mood}、活動: ${d.context.activities.join('・')}）`
      ).join('\n');
      return `以下はあるユーザーの直近7日間の行動記録です。\n\n${recent}\n\n上記のデータをもとに、このユーザーへの「今日の運勢」を占ってください。\n\n## ルール\n- 行動パターンから読み取れる傾向を根拠にする\n- 「総合運」「対人運」「仕事運」「健康運」の4項目で、それぞれ★5段階と一言コメントを付ける\n- 最後に今日のラッキーアクションを1つ提案する\n- 前向きで温かいトーンで書く\n- 合計300文字以内`;
    },
  },
  data: {
    emoji: '📊',
    title: '行動パターン分析',
    buildPrompt: () => {
      const summary = DIARY_HISTORY.map((d) =>
        `${d.date}: 気分=${d.context.mood}、活動=[${d.context.activities.join(',')}]、場所=[${d.context.places.join(',')}]`
      ).join('\n');
      const categories = BROWSER_HISTORY_MOCK.map((b) => b.category);
      const catCount = categories.reduce<Record<string, number>>((acc, c) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
      const catSummary = Object.entries(catCount).map(([k, v]) => `${k}: ${v}回`).join('、');
      return `以下は1ヶ月分の行動データです。\n\n【日記データ】\n${summary}\n\n【ブラウザ閲覧カテゴリ】\n${catSummary}\n\n上記のデータを分析して、このユーザーの行動パターンをレポートしてください。\n\n## 出力形式\n- 「気分の傾向」：どんな日が多いか、何が影響しているか\n- 「活動パターン」：よくやっていること、頻度\n- 「興味・関心」：ブラウザ履歴から読み取れるもの\n- 「AIからの提案」：データをもとにした具体的なアドバイスを2つ\n\n各項目2〜3文で、合計400文字以内`;
    },
  },
  personality: {
    emoji: '🧠',
    title: '性格タイプ診断',
    buildPrompt: () => {
      const activities = DIARY_HISTORY.flatMap((d) => d.context.activities);
      const actCount = activities.reduce<Record<string, number>>((acc, a) => { acc[a] = (acc[a] || 0) + 1; return acc; }, {});
      const moods = DIARY_HISTORY.map((d) => d.context.mood);
      const moodCount = moods.reduce<Record<string, number>>((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {});
      const people = DIARY_HISTORY.flatMap((d) => d.context.with_people);
      const socialDays = DIARY_HISTORY.filter((d) => d.context.with_people.length > 0).length;
      return `以下は1ヶ月分の行動データのサマリーです。\n\n活動頻度: ${Object.entries(actCount).map(([k,v])=>`${k}${v}回`).join('、')}\n気分の内訳: ${Object.entries(moodCount).map(([k,v])=>`${k}${v}日`).join('、')}\n社交的な日数: ${socialDays}日/30日\n\n上記から、このユーザーの性格タイプを分析してください。\n\n## 出力形式\n- 性格タイプ名（独自の名前をつける）\n- タイプの特徴（3つの特徴を箇条書き）\n- 強み\n- 気をつけるポイント\n- このタイプへのメッセージ\n\n合計350文字以内、温かみのあるトーンで`;
    },
  },
};

export default function AIContentScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const theme = useTheme();
  const config = CONFIG[type as ContentType];
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!config) return;
    const prompt = config.buildPrompt();
    chat([], prompt).then((res) => {
      setResult(res);
      setIsLoading(false);
    });
  }, [type]);

  if (!config) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>不明なコンテンツです</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {isLoading ? (
          <View style={styles.loading}>
            <ThemedText style={styles.loadingEmoji}>{config.emoji}</ThemedText>
            <ActivityIndicator size="large" color={theme.text} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.loadingText}>
              データを分析しています...
            </ThemedText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText style={styles.cardEmoji}>{config.emoji}</ThemedText>
              <ThemedText type="smallBold" style={styles.cardTitle}>{config.title}</ThemedText>
              <ThemedText style={styles.result}>{result}</ThemedText>
            </ThemedView>
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

export function generateStaticParams() {
  return [{ type: 'fortune' }, { type: 'data' }, { type: 'personality' }];
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  loadingEmoji: { fontSize: 48 },
  loadingText: { marginTop: Spacing.one },
  content: { padding: Spacing.four },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  cardEmoji: { fontSize: 40 },
  cardTitle: { fontSize: 18 },
  result: { fontSize: 15, lineHeight: 26 },
});
