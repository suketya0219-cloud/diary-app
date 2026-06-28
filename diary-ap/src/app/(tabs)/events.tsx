import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  CURRENT_USER_ID,
  MOCK_EVENTS,
  MOCK_RESPONSES,
  TODAY,
  getUserById,
  getResponseFor,
} from '@/mock/events';
import type { SharedEvent } from '@/types/events';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: '下書き', shared: '共有済み', confirmed: '確定',
    completed: '実施済み', cancelled: '中止',
    pending: '回答待ち', accepted: '参加', declined: '辞退', tentative: '保留',
  };
  return map[status] ?? status;
}

function EventCard({ event }: { event: SharedEvent }) {
  const theme = useTheme();
  const res = getResponseFor(event.id, CURRENT_USER_ID);
  const participants = event.participantIds.map((id) => getUserById(id)?.displayName).join('、');
  const isToday = event.startAt.startsWith(TODAY);

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } })} activeOpacity={0.8}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <ThemedText type="smallBold">{event.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDateTime(event.startAt)} - {formatTime(event.endAt)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">{event.location || '場所未定'}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">参加者: {participants}</ThemedText>
          </View>
          <View style={[
            styles.statusPill,
            { backgroundColor: event.status === 'completed' ? '#34C759' : isToday ? theme.text : theme.backgroundElement }
          ]}>
            <ThemedText
              type="small"
              style={{ color: event.status === 'completed' || isToday ? (theme.background) : undefined }}
            >
              {statusLabel(event.status)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.pillRow}>
          {res && (
            <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="small" themeColor="textSecondary">{statusLabel(res.status)}</ThemedText>
            </View>
          )}
          {event.sharedVia.length > 0 && (
            <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="small" themeColor="textSecondary">{event.sharedVia.join(' / ')}</ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const theme = useTheme();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const todayEvents = MOCK_EVENTS.filter((e) => e.startAt.startsWith(TODAY));
  const upcomingEvents = MOCK_EVENTS.filter((e) => e.startAt > `${TODAY}T23:59`);
  const pendingInvites = MOCK_RESPONSES.filter(
    (r) => r.userId === CURRENT_USER_ID && r.status === 'pending'
  ).map((r) => MOCK_EVENTS.find((e) => e.id === r.eventId)).filter(Boolean) as typeof MOCK_EVENTS;
  const pastEvents = MOCK_EVENTS.filter((e) => e.status === 'completed');

  const sections = [
    { title: '今日', events: todayEvents },
    { title: '今後', events: upcomingEvents },
    { title: '回答待ちの招待', events: pendingInvites },
    { title: '過去', events: pastEvents },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="subtitle">予定</ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.text }]}
            onPress={() => router.push('/ai-chat')}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.createButtonText, { color: theme.background }]}>＋ 予定を作る</ThemedText>
          </TouchableOpacity>

          {sections.map(({ title, events }) => (
            <View key={title} style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionTitle}>{title}</ThemedText>
              {events.length === 0 ? (
                <ThemedView type="backgroundElement" style={styles.empty}>
                  <ThemedText type="small" themeColor="textSecondary">{title}の予定はありません。</ThemedText>
                </ThemedView>
              ) : (
                events.map((event) => <EventCard key={event.id} event={event} />)
              )}
            </View>
          ))}

          <View style={styles.lastSection} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  createButton: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  lastSection: {
    height: Spacing.six,
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
  statusPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  pill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  empty: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
});
