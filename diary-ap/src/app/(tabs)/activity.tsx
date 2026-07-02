import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { activityStore } from '@/store/activities';
import { MOCK_INSIGHTS } from '@/mock/ai-insights';
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
              <ThemedView key={insight.id} type="backgroundElement" style={styles.insightCard}>
                <View style={[styles.insightDot, { backgroundColor: INSIGHT_COLOR[insight.type] }]} />
                <ThemedText style={styles.insightEmoji}>{insight.emoji}</ThemedText>
                <ThemedText type="small" style={styles.insightText}>{insight.text}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.insightDate}>{insight.detectedAt}</ThemedText>
              </ThemedView>
            ))}
          </ScrollView>

          {/* 写真ストリップ（モック） */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
            {['写真1', '写真2', '写真3'].map((label) => (
              <ThemedView key={label} type="backgroundElement" style={styles.photo}>
                <ThemedText type="small" themeColor="textSecondary">📷</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
              </ThemedView>
            ))}
          </ScrollView>

          {/* 件数サマリー */}
          <ThemedView type="backgroundElement" style={styles.summary}>
            <ThemedText type="smallBold">日記に含める出来事: {includedCount}件</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              各項目をタップして日記への反映を切り替えられます。
            </ThemedText>
          </ThemedView>

          {/* タイムライン */}
          <View style={styles.timeline}>
            {activities.map((item) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timeColumn}>
                  <ThemedText type="small" themeColor="textSecondary">{formatTime(item.occurredAt)}</ThemedText>
                  <View style={[styles.timelineDot, { backgroundColor: item.includedInDiary ? theme.text : theme.backgroundElement }]} />
                </View>
                <ThemedView type="backgroundElement" style={styles.card}>
                  <View style={styles.cardRow}>
                    <ThemedText style={styles.typeEmoji}>{TYPE_EMOJI[item.type] ?? '•'}</ThemedText>
                    <View style={styles.cardContent}>
                      <ThemedText type="smallBold">{item.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {item.category}{item.location ? ` / ${item.location}` : ''} / 信頼度 {Math.round(item.confidence * 100)}%
                      </ThemedText>
                    </View>
                    <View style={[
                      styles.includePill,
                      { backgroundColor: item.includedInDiary ? '#34C759' : theme.backgroundSelected }
                    ]}>
                      <ThemedText
                        type="small"
                        style={{ color: item.includedInDiary ? '#fff' : undefined }}
                      >
                        {item.includedInDiary ? '含める' : '除外'}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.backgroundSelected }]}
                      onPress={() => toggleActivity(item.id)}
                      activeOpacity={0.8}
                    >
                      <ThemedText type="small">
                        {item.includedInDiary ? '日記から除外' : '日記へ含める'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </ThemedView>
              </View>
            ))}
          </View>

          {/* 日記ドラフト生成ボタン */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.text }]}
              onPress={() => router.push('/diary-confirm')}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.primaryButtonText, { color: theme.background }]}>
                日記ドラフトを生成
              </ThemedText>
            </TouchableOpacity>
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
  insightStrip: {
    paddingLeft: Spacing.four,
    marginBottom: Spacing.three,
    flexGrow: 0,
  },
  insightContent: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  insightCard: {
    width: 180,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  insightEmoji: { fontSize: 20 },
  insightText: { lineHeight: 18 },
  insightDate: { fontSize: 10, marginTop: 2 },
  photoStrip: {
    paddingLeft: Spacing.four,
    marginBottom: Spacing.three,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: Spacing.two,
    marginRight: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  summary: {
    marginHorizontal: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.half,
    marginBottom: Spacing.three,
  },
  timeline: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  timeColumn: {
    width: 44,
    alignItems: 'center',
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  typeEmoji: {
    fontSize: 20,
    paddingTop: 2,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.half,
  },
  includePill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  footer: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  primaryButton: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
