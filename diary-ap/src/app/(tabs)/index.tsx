import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  CURRENT_USER_ID,
  MOCK_ACTIVITIES,
  MOCK_EVENTS,
  MOCK_RESPONSES,
  TODAY,
  getUserById,
} from '@/mock/events';

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const theme = useTheme();

  const today = new Date();
  const dateLabel = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 ${['日', '月', '火', '水', '木', '金', '土'][today.getDay()]}曜日`;

  const todayEvents = MOCK_EVENTS.filter((e) => e.startAt.startsWith(TODAY));
  const pendingInvites = MOCK_RESPONSES.filter(
    (r) => r.userId === CURRENT_USER_ID && r.status === 'pending'
  ).map((r) => MOCK_EVENTS.find((e) => e.id === r.eventId)).filter(Boolean) as typeof MOCK_EVENTS;

  const includedCount = MOCK_ACTIVITIES.filter((a) => a.includedInDiary).length;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ヘッダー */}
          <View style={styles.hero}>
            <ThemedText type="small" themeColor="textSecondary">{dateLabel}</ThemedText>
            <ThemedText type="title" style={styles.heroTitle}>今日の予定と記録を、{'\n'}あとで日記に。</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              予定を作って共有すると、実施後に日記の材料として整理されます。
            </ThemedText>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.text }]}
              onPress={() => router.push('/events/create' as any)}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.primaryButtonText, { color: theme.background }]}>
                ＋ 予定を作る
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* クイックアクション */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.subButton, { backgroundColor: theme.backgroundElement }]}
              onPress={() => router.push('/activity' as any)}
              activeOpacity={0.8}
            >
              <ThemedText type="small">今日の出来事</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subButton, { backgroundColor: theme.backgroundElement }]}
              onPress={() => router.push('/diary-confirm')}
              activeOpacity={0.8}
            >
              <ThemedText type="small">日記を確認する</ThemedText>
            </TouchableOpacity>
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
                          {formatDate(event.startAt)} / {event.location}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          参加者: {event.participantIds.map((id) => getUserById(id)?.displayName).join('、')}
                        </ThemedText>
                      </View>
                      <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
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

          {/* 回答待ちの招待 */}
          {pendingInvites.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>回答待ちの招待</ThemedText>
              {pendingInvites.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } })}
                  activeOpacity={0.8}
                >
                  <ThemedView type="backgroundElement" style={styles.card}>
                    <ThemedText type="smallBold">{event.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {formatDate(event.startAt)} / {event.location}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 今日の出来事サマリー */}
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>今日取得された出来事</ThemedText>
            <ThemedView type="backgroundElement" style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  <ThemedText type="smallBold">日記候補 {includedCount}件</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    予定・写真・歩数・メモから、今日の材料を集めています。
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.smallButton, { backgroundColor: theme.text }]}
                  onPress={() => router.push('/activity' as any)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={[styles.smallButtonText, { color: theme.background }]}>確認</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>

          {/* 日記の作成状況 */}
          <View style={[styles.section, styles.lastSection]}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>日記の作成状況</ThemedText>
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">今日の日記は下書き準備中</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 4 }}>
                含める出来事を確認してから、日記ドラフトを生成できます。
              </ThemedText>
              <View style={[styles.row, { marginTop: Spacing.two }]}>
                <TouchableOpacity
                  style={[styles.subButton, { backgroundColor: theme.backgroundSelected }]}
                  onPress={() => router.push('/activity' as any)}
                  activeOpacity={0.8}
                >
                  <ThemedText type="small">出来事を確認</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.subButton, { backgroundColor: theme.text }]}
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
  hero: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  primaryButton: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  subButton: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
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
  sectionTitle: {
    marginBottom: Spacing.one,
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
  smallButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
});
