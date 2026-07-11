import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarStack } from '@/components/avatar-stack';
import { Card } from '@/components/card';
import { GradientButton } from '@/components/gradient-button';
import { StampBadge } from '@/components/stamp-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Accent, Pastel, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_ACTIVITIES, MOCK_EVENTS, TODAY, getUserById } from '@/mock/events';
import type { Activity, ActivityType } from '@/types/events';

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const MOCK_PHOTO_COUNT = 3;
const MOCK_STEPS = 8420;
const MOCK_PLACE_COUNT = 2;

const ACTIVITY_ICON: Record<ActivityType, string> = {
  calendar: '📅',
  shared_event: '🤝',
  photo: '📷',
  health: '🏃',
  note: '📝',
  location: '📍',
};

type FlowItem = {
  id: string;
  time: string;
  icon: string;
  title: string;
  subtitle?: string;
  participantIds?: string[];
  onPress?: () => void;
};

export default function HomeScreen() {
  const theme = useTheme();

  const today = new Date();
  const dateLabel = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日`;

  const todayEvents = MOCK_EVENTS.filter((e) => e.startAt.startsWith(TODAY));
  const includedCount = MOCK_ACTIVITIES.filter((a) => a.includedInDiary).length;

  const dataSummary = [
    { emoji: '📷', label: `写真 ${MOCK_PHOTO_COUNT}枚`, background: Pastel.butter, textColor: Pastel.butterText },
    { emoji: '👣', label: `${MOCK_STEPS.toLocaleString()}歩`, background: Pastel.sky, textColor: Pastel.skyText },
    { emoji: '📍', label: `場所 ${MOCK_PLACE_COUNT}箇所`, background: Pastel.mint, textColor: Pastel.mintText },
    { emoji: '📅', label: `予定 ${todayEvents.length}件`, background: Pastel.coral, textColor: Pastel.coralText },
  ];

  // 予定と出来事を時系列でひとつの「今日の流れ」にまとめる
  const flowItems: FlowItem[] = [
    ...todayEvents.map((event) => ({
      id: event.id,
      time: event.startAt,
      icon: '📅',
      title: event.title,
      subtitle: event.location,
      participantIds: event.participantIds,
      onPress: () => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } }),
    })),
    ...MOCK_ACTIVITIES.filter((a: Activity) => a.occurredAt.startsWith(TODAY)).map((activity) => ({
      id: activity.id,
      time: activity.occurredAt,
      icon: ACTIVITY_ICON[activity.type],
      title: activity.title,
      subtitle: activity.location,
      participantIds: activity.personId ? [activity.personId] : undefined,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ヘッダー */}
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">{dateLabel}</ThemedText>
              <ThemedText type="subtitle" style={styles.greeting}>
                <ThemedText type="subtitle" style={{ color: Accent.red }}>おはよう</ThemedText>、田村さん
              </ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} style={styles.settingsButton}>
              <ThemedText style={styles.settingsIcon}>⚙️</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 今日のスタンプ */}
          <View style={styles.section}>
            <View style={styles.stampRow}>
              {dataSummary.map((item) => (
                <StampBadge key={item.label} {...item} />
              ))}
            </View>
          </View>

          {/* 今日の流れ */}
          <View style={styles.section}>
            <View style={styles.sectionTitleWrap}>
              <ThemedText type="smallBold">今日の流れ</ThemedText>
              <View style={[styles.sectionLine, { backgroundColor: Accent.green }]} />
            </View>
            {flowItems.length === 0 ? (
              <Card style={styles.empty}>
                <ThemedText type="small" themeColor="textSecondary">まだ今日の記録はありません</ThemedText>
              </Card>
            ) : (
              <View style={styles.timeline}>
                {flowItems.map((item, index) => {
                  const content = (
                    <View style={styles.flowRow}>
                      <View style={styles.flowTimeCol}>
                        <ThemedText type="small" themeColor="textSecondary">{formatTime(item.time)}</ThemedText>
                        {index < flowItems.length - 1 && <View style={styles.flowConnector} />}
                      </View>
                      <View style={styles.flowIconWrap}>
                        <ThemedText style={styles.flowIcon}>{item.icon}</ThemedText>
                      </View>
                      <Card style={styles.flowCard}>
                        <View style={styles.flowCardInner}>
                          <View style={styles.flowCardText}>
                            <ThemedText type="smallBold">{item.title}</ThemedText>
                            {item.subtitle && (
                              <ThemedText type="small" themeColor="textSecondary">{item.subtitle}</ThemedText>
                            )}
                          </View>
                          {item.participantIds && item.participantIds.length > 0 && (
                            <AvatarStack
                              people={item.participantIds
                                .map((id) => getUserById(id))
                                .filter((u): u is NonNullable<typeof u> => !!u)}
                            />
                          )}
                        </View>
                      </Card>
                    </View>
                  );
                  return item.onPress ? (
                    <TouchableOpacity key={item.id} onPress={item.onPress} activeOpacity={0.8}>
                      {content}
                    </TouchableOpacity>
                  ) : (
                    <View key={item.id}>{content}</View>
                  );
                })}
              </View>
            )}
          </View>

          {/* 今日のまとめ */}
          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionTitleWrap}>
              <ThemedText type="smallBold">今日のまとめ</ThemedText>
              <View style={[styles.sectionLine, { backgroundColor: Accent.red }]} />
            </View>
            <Card variant="elevated" borderColor={Pastel.coral} style={styles.diaryCard}>
              <View style={styles.diaryCardHeader}>
                <View style={styles.diaryEmojiWrap}>
                  <ThemedText style={styles.diaryEmoji}>📖</ThemedText>
                </View>
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
  settingsButton: {
    padding: Spacing.two,
    marginTop: 4,
    borderRadius: Radius.pill,
    backgroundColor: '#F2EDE5',
  },
  settingsIcon: { fontSize: 18 },
  section: { paddingHorizontal: Spacing.four, marginTop: Spacing.four, gap: Spacing.three },
  lastSection: { marginBottom: Spacing.six },
  sectionTitleWrap: { gap: 3 },
  sectionLine: { height: 2, width: 28, borderRadius: 1 },
  stampRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  empty: { padding: Spacing.three, alignItems: 'center' },

  timeline: { gap: Spacing.two },
  flowRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  flowTimeCol: { width: 40, alignItems: 'center', gap: 4 },
  flowConnector: { width: 1, flex: 1, minHeight: 12, backgroundColor: '#EDE8E0', marginTop: 2 },
  flowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFCF8',
    borderWidth: 1,
    borderColor: '#EDE8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowIcon: { fontSize: 15 },
  flowCard: { flex: 1, padding: Spacing.three, marginBottom: Spacing.two },
  flowCardInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  flowCardText: { flex: 1, gap: 2 },

  diaryCard: { padding: Spacing.four, gap: Spacing.three },
  diaryCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  diaryEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Pastel.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaryEmoji: { fontSize: 24 },
  diaryCardText: { gap: 2 },
  diaryButtonRow: { flexDirection: 'row', gap: Spacing.two },
  outlineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4F0E4',
  },
  primaryButtonWrapper: { flex: 1 },
  primaryButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
