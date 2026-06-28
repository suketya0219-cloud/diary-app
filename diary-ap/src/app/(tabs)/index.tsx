import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  TODAY,
  getUserById,
} from '@/mock/events';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// モックデータ（将来は実データに差し替え）
const MOCK_PHOTO_COUNT = 3;
const MOCK_STEPS = 8420;
const MOCK_PLACE_COUNT = 2;

export default function HomeScreen() {
  const theme = useTheme();

  const today = new Date();
  const dateLabel = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日`;

  const todayEvents = MOCK_EVENTS.filter((e) => e.startAt.startsWith(TODAY));
  const includedCount = MOCK_ACTIVITIES.filter((a) => a.includedInDiary).length;

  const dataSummary = [
    { emoji: '📷', label: `写真 ${MOCK_PHOTO_COUNT}枚` },
    { emoji: '👣', label: `${MOCK_STEPS.toLocaleString()}歩` },
    { emoji: '📍', label: `場所 ${MOCK_PLACE_COUNT}箇所` },
    { emoji: '📅', label: `予定 ${todayEvents.length}件` },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 日付 */}
          <View style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">{dateLabel}</ThemedText>
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              activeOpacity={0.7}
              style={styles.settingsButton}
            >
              <ThemedText style={styles.settingsIcon}>⚙️</ThemedText>
            </TouchableOpacity>
          </View>

          {/* データサマリー */}
          <View style={styles.section}>
            <ThemedView type="backgroundElement" style={styles.summaryCard}>
              <ThemedText type="smallBold" style={styles.summaryTitle}>今日のデータ</ThemedText>
              <View style={styles.summaryGrid}>
                {dataSummary.map((item) => (
                  <View key={item.label} style={styles.summaryItem}>
                    <ThemedText style={styles.summaryEmoji}>{item.emoji}</ThemedText>
                    <ThemedText type="small">{item.label}</ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>
          </View>

          {/* 今日の予定 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="smallBold">今日の予定</ThemedText>
              <TouchableOpacity onPress={() => router.push('/events' as any)}>
                <ThemedText type="small" themeColor="textSecondary">すべて</ThemedText>
              </TouchableOpacity>
            </View>
            {todayEvents.length === 0 ? (
              <ThemedView type="backgroundElement" style={styles.empty}>
                <ThemedText type="small" themeColor="textSecondary">今日の予定はまだありません。</ThemedText>
              </ThemedView>
            ) : (
              todayEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } })}
                  activeOpacity={0.8}
                >
                  <ThemedView type="backgroundElement" style={styles.card}>
                    <View style={styles.cardRow}>
                      <View style={styles.cardContent}>
                        <ThemedText type="smallBold">{event.title}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {formatDateTime(event.startAt)} / {event.location}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          参加者: {event.participantIds.map((id) => getUserById(id)?.displayName).join('、')}
                        </ThemedText>
                      </View>
                      <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                        <ThemedText type="small" themeColor="textSecondary">
                          {event.status === 'shared' ? '共有済み' : event.status === 'confirmed' ? '確定' : '下書き'}
                        </ThemedText>
                      </View>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* 日記の作成状況 */}
          <View style={[styles.section, styles.lastSection]}>
            <ThemedText type="smallBold">日記の作成状況</ThemedText>
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">今日の日記は下書き準備中</ThemedText>
              <View style={styles.diaryButtonRow}>
                <TouchableOpacity
                  style={[styles.diaryButton, { backgroundColor: theme.backgroundSelected }]}
                  onPress={() => router.push('/activity' as any)}
                  activeOpacity={0.8}
                >
                  <ThemedText type="small">出来事を確認（{includedCount}件）</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.diaryButton, { backgroundColor: theme.text }]}
                  onPress={() => router.push('/diary-confirm')}
                  activeOpacity={0.8}
                >
                  <ThemedText type="small" style={{ color: theme.background }}>今日の日記を作る</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
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
    paddingBottom: Spacing.one,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    padding: Spacing.one,
  },
  settingsIcon: {
    fontSize: 18,
  },
  section: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  lastSection: {
    marginBottom: Spacing.six,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  summaryTitle: {
    marginBottom: Spacing.one,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minWidth: '45%',
  },
  summaryEmoji: {
    fontSize: 16,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.half,
  },
  pill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  empty: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  diaryButtonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  diaryButton: {
    flex: 1,
    padding: Spacing.two,
    borderRadius: Spacing.one,
    alignItems: 'center',
  },
});
