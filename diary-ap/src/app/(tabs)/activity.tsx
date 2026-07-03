import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { GradientButton } from '@/components/gradient-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_INSIGHTS } from '@/mock/ai-insights';
import { activityStore } from '@/store/activities';
import type { Activity } from '@/types/events';

const INSIGHT_COLOR: Record<string, string> = {
  pattern: '#10B981',
  insight: '#3B82F6',
  suggestion: '#F59E0B',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const TYPE_EMOJI: Record<string, string> = {
  calendar: '📅',
  shared_event: '👥',
  photo: '📷',
  health: '💪',
  note: '✏️',
  location: '📍',
};

export default function ActivityScreen() {
  const theme = useTheme();
  const [activities, setActivities] = useState<Activity[]>(activityStore.get());

  const toggleActivity = (id: string) => {
    setActivities((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, includedInDiary: !a.includedInDiary } : a));
      activityStore.set(next);
      return next;
    });
  };

  const includedCount = activities.filter((a) => a.includedInDiary).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <ThemedText type="subtitle">今日の出来事</ThemedText>
          </View>

          {/* AIインサイトカード */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.insightStrip} contentContainerStyle={styles.insightContent}>
            {MOCK_INSIGHTS.slice(0, 4).map((insight) => (
              <View key={insight.id} style={[styles.insightCard, Shadow.card, { borderLeftColor: INSIGHT_COLOR[insight.type] }]}>
                <ThemedText style={styles.insightEmoji}>{insight.emoji}</ThemedText>
                <ThemedText type="small" style={styles.insightText}>{insight.text}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.insightDate}>{insight.detectedAt}</ThemedText>
              </View>
            ))}
          </ScrollView>

          {/* 写真ストリップ（モック） */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
            {['写真1', '写真2', '写真3'].map((label) => (
              <Card key={label} style={styles.photo}>
                <ThemedText type="small" themeColor="textSecondary">📷</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
              </Card>
            ))}
          </ScrollView>

          {/* 件数サマリー */}
          <Card style={styles.summary}>
            <ThemedText type="smallBold">日記に含める出来事: {includedCount}件</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              各項目をタップして日記への反映を切り替えられます。
            </ThemedText>
          </Card>

          {/* タイムライン */}
          <View style={styles.timeline}>
            {activities.map((item) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timeColumn}>
                  <ThemedText type="small" themeColor="textSecondary">{formatTime(item.occurredAt)}</ThemedText>
                  <View style={[styles.timelineDot, { backgroundColor: item.includedInDiary ? '#2D8A5E' : '#D4F0E4' }]} />
                </View>
                <Card style={styles.card}>
                  <View style={styles.cardRow}>
                    <ThemedText style={styles.typeEmoji}>{TYPE_EMOJI[item.type] ?? '•'}</ThemedText>
                    <View style={styles.cardContent}>
                      <ThemedText type="smallBold">{item.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {item.category}{item.location ? ` · ${item.location}` : ''} · 信頼度 {Math.round(item.confidence * 100)}%
                      </ThemedText>
                    </View>
                    <View style={[styles.includePill, { backgroundColor: item.includedInDiary ? '#2D8A5E' : '#F0FAF4', borderColor: item.includedInDiary ? '#2D8A5E' : '#D4F0E4' }]}>
                      <ThemedText style={[styles.pillText, { color: item.includedInDiary ? '#fff' : '#5A8C72' }]}>
                        {item.includedInDiary ? '含める' : '除外'}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: '#E8F5EE' }]}
                    onPress={() => toggleActivity(item.id)}
                    activeOpacity={0.8}
                  >
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.includedInDiary ? '日記から除外する' : '日記へ含める'}
                    </ThemedText>
                  </TouchableOpacity>
                </Card>
              </View>
            ))}
          </View>

          {/* 日記ドラフト生成ボタン */}
          <View style={styles.footer}>
            <GradientButton onPress={() => router.push('/diary-confirm')}>
              <ThemedText style={styles.primaryButtonText}>日記ドラフトを生成</ThemedText>
            </GradientButton>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  insightStrip: { paddingLeft: Spacing.four, marginBottom: Spacing.three, flexGrow: 0 },
  insightContent: { gap: Spacing.two, paddingRight: Spacing.four },
  insightCard: {
    width: 180,
    padding: Spacing.three,
    borderRadius: Radius.md,
    gap: Spacing.one,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8F5EE',
    borderLeftWidth: 4,
  },
  insightEmoji: { fontSize: 20 },
  insightText: { lineHeight: 18 },
  insightDate: { fontSize: 10, marginTop: 2 },
  photoStrip: { paddingLeft: Spacing.four, marginBottom: Spacing.three },
  photo: {
    width: 80,
    height: 80,
    marginRight: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  summary: {
    marginHorizontal: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.half,
    marginBottom: Spacing.three,
  },
  timeline: { paddingHorizontal: Spacing.four, gap: Spacing.two },
  timelineItem: { flexDirection: 'row', gap: Spacing.two },
  timeColumn: { width: 44, alignItems: 'center', paddingTop: Spacing.two, gap: Spacing.one },
  timelineDot: { width: 8, height: 8, borderRadius: 4 },
  card: { flex: 1, padding: Spacing.three, gap: Spacing.two },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  typeEmoji: { fontSize: 20, paddingTop: 2 },
  cardContent: { flex: 1, gap: 2 },
  includePill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  pillText: { fontSize: 11, fontWeight: '600' },
  actionButton: {
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  footer: { padding: Spacing.four, paddingBottom: Spacing.six },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
