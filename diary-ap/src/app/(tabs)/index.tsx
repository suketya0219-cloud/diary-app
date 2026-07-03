import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { GradientButton } from '@/components/gradient-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_ACTIVITIES, MOCK_EVENTS, TODAY, getUserById } from '@/mock/events';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

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

          {/* ヘッダー */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">{dateLabel}</ThemedText>
              <ThemedText type="subtitle" style={styles.greeting}>おはよう、田村さん</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} style={styles.settingsButton}>
              <ThemedText style={styles.settingsIcon}>⚙️</ThemedText>
            </TouchableOpacity>
          </View>

          {/* データサマリーバナー */}
          <View style={styles.section}>
            <LinearGradient
              colors={['#0D0D0D', '#3D3D3D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.summaryBanner}
            >
              <ThemedText style={styles.summaryBannerTitle}>TODAY</ThemedText>
              <View style={styles.summaryGrid}>
                {dataSummary.map((item) => (
                  <View key={item.label} style={styles.summaryItem}>
                    <ThemedText style={styles.summaryEmoji}>{item.emoji}</ThemedText>
                    <ThemedText style={styles.summaryLabel}>{item.label}</ThemedText>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* 今日の予定 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="smallBold">今日の予定</ThemedText>
              <TouchableOpacity onPress={() => router.push('/events' as any)}>
                <ThemedText type="small" themeColor="textSecondary">すべて →</ThemedText>
              </TouchableOpacity>
            </View>
            {todayEvents.length === 0 ? (
              <Card style={styles.empty}>
                <ThemedText type="small" themeColor="textSecondary">今日の予定はまだありません</ThemedText>
              </Card>
            ) : (
              todayEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } })}
                  activeOpacity={0.8}
                >
                  <Card style={styles.eventCard}>
                    <View style={styles.eventRow}>
                      <View style={[styles.eventDot, { backgroundColor: '#0D0D0D' }]} />
                      <View style={styles.eventContent}>
                        <ThemedText type="smallBold">{event.title}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {formatDateTime(event.startAt)} · {event.location}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {event.participantIds.map((id) => getUserById(id)?.displayName).join('、')}
                        </ThemedText>
                      </View>
                      <View style={styles.statusBadge}>
                        <ThemedText style={styles.statusText}>
                          {event.status === 'shared' ? '共有済み' : event.status === 'confirmed' ? '確定' : '下書き'}
                        </ThemedText>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* 日記の作成状況 */}
          <View style={[styles.section, styles.lastSection]}>
            <ThemedText type="smallBold">日記の作成状況</ThemedText>
            <Card variant="elevated" style={styles.diaryCard}>
              <View style={styles.diaryCardHeader}>
                <ThemedText style={styles.diaryEmoji}>📖</ThemedText>
                <View style={styles.diaryCardText}>
                  <ThemedText type="smallBold">今日の日記を作ろう</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{includedCount}件の出来事を記録中</ThemedText>
                </View>
              </View>
              <View style={styles.diaryButtonRow}>
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() => router.push('/activity' as any)}
                  activeOpacity={0.8}
                >
                  <ThemedText type="small" themeColor="textSecondary">出来事を確認</ThemedText>
                </TouchableOpacity>
                <GradientButton
                  style={styles.primaryButtonWrapper}
                  onPress={() => router.push('/diary-confirm')}
                >
                  <ThemedText style={styles.primaryButtonText}>日記を作る</ThemedText>
                </GradientButton>
              </View>
            </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { marginTop: 2 },
  settingsButton: { padding: Spacing.one, marginTop: 4 },
  settingsIcon: { fontSize: 20 },
  section: { paddingHorizontal: Spacing.four, marginTop: Spacing.three, gap: Spacing.two },
  lastSection: { marginBottom: Spacing.six },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryBanner: {
    borderRadius: Radius.md,
    padding: Spacing.four,
    gap: Spacing.two,
    ...Shadow.strong,
  },
  summaryBannerTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, minWidth: '45%' },
  summaryEmoji: { fontSize: 16 },
  summaryLabel: { color: '#fff', fontSize: 13, fontWeight: '500' },
  empty: { padding: Spacing.three, alignItems: 'center' },
  eventCard: { padding: Spacing.three },
  eventRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  eventDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  eventContent: { flex: 1, gap: 2 },
  statusBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusText: { fontSize: 11, color: '#555', fontWeight: '600' },
  diaryCard: { padding: Spacing.four, gap: Spacing.three },
  diaryCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  diaryEmoji: { fontSize: 32 },
  diaryCardText: { gap: 2 },
  diaryButtonRow: { flexDirection: 'row', gap: Spacing.two },
  outlineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4F0E4',
  },
  primaryButtonWrapper: { flex: 1 },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
