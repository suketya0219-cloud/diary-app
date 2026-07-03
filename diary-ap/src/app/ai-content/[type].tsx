import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { GradientButton } from '@/components/gradient-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { DIARY_HISTORY } from '@/mock/diary-history';
import { BROWSER_HISTORY_MOCK } from '@/mock/browser';
import { MOCK_SAVED_ANALYSES, type SavedAnalysis } from '@/mock/ai-insights';
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
      const socialDays = DIARY_HISTORY.filter((d) => d.context.with_people.length > 0).length;
      return `以下は1ヶ月分の行動データのサマリーです。\n\n活動頻度: ${Object.entries(actCount).map(([k,v])=>`${k}${v}回`).join('、')}\n気分の内訳: ${Object.entries(moodCount).map(([k,v])=>`${k}${v}日`).join('、')}\n社交的な日数: ${socialDays}日/30日\n\n上記から、このユーザーの性格タイプを分析してください。\n\n## 出力形式\n- 性格タイプ名（独自の名前をつける）\n- タイプの特徴（3つの特徴を箇条書き）\n- 強み\n- 気をつけるポイント\n- このタイプへのメッセージ\n\n合計350文字以内、温かみのあるトーンで`;
    },
  },
};

// セッション中の再分析結果を保持
const sessionCache: Partial<Record<ContentType, { result: string; analyzedAt: string }>> = {};

export default function AIContentScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const config = CONFIG[type as ContentType];

  const saved = MOCK_SAVED_ANALYSES.find((a) => a.type === type) as SavedAnalysis | undefined;
  const cached = sessionCache[type as ContentType];
  const latest = cached ?? saved;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [current, setCurrent] = useState<{ result: string; analyzedAt: string } | undefined>(latest);

  const handleReanalyze = async () => {
    if (!config) return;
    setIsAnalyzing(true);
    const prompt = config.buildPrompt();
    const result = await chat([], prompt);
    const now = new Date().toISOString().slice(0, 10);
    const next = { result, analyzedAt: now };
    sessionCache[type as ContentType] = next;
    setCurrent(next);
    setIsAnalyzing(false);
  };

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
        <ScrollView contentContainerStyle={styles.content}>

          {/* 結果カード */}
          {current ? (
            <Card variant="elevated" style={styles.card}>
              <ThemedText style={styles.cardEmoji}>{config.emoji}</ThemedText>
              <View style={styles.cardHeader}>
                <ThemedText type="smallBold" style={styles.cardTitle}>{config.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{current.analyzedAt} 分析</ThemedText>
              </View>
              <ThemedText style={styles.result}>{current.result}</ThemedText>
            </Card>
          ) : (
            <Card style={styles.emptyCard}>
              <ThemedText style={styles.cardEmoji}>{config.emoji}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">まだ分析結果がありません</ThemedText>
            </Card>
          )}

          {/* 再分析ボタン */}
          <GradientButton onPress={handleReanalyze} disabled={isAnalyzing} style={isAnalyzing ? styles.buttonDisabled : undefined}>
            {isAnalyzing ? (
              <View style={styles.buttonInner}>
                <ActivityIndicator size="small" color="#fff" />
                <ThemedText style={styles.reanalyzeText}>分析中...</ThemedText>
              </View>
            ) : (
              <ThemedText style={styles.reanalyzeText}>🔄 再分析する</ThemedText>
            )}
          </GradientButton>

          {current && cached && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.updateNote}>
              ※ 今回新たに分析した結果を表示中
            </ThemedText>
          )}

        </ScrollView>
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
  content: { padding: Spacing.four, gap: Spacing.three },
  card: { padding: Spacing.four, gap: Spacing.two },
  emptyCard: {
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 150,
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 36 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16 },
  result: { fontSize: 15, lineHeight: 26 },
  buttonDisabled: { opacity: 0.6 },
  buttonInner: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  reanalyzeText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  updateNote: { textAlign: 'center' },
});
