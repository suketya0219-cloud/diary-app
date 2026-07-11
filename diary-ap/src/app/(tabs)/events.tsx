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

function statusStamp(status: SharedEvent['status']) {
  switch (status) {
    case 'completed': return { background: Pastel.mint, textColor: Pastel.mintText, emoji: '✓' };
    case 'confirmed': return { background: Pastel.sky, textColor: Pastel.skyText, emoji: '📌' };
    case 'shared': return { background: Pastel.butter, textColor: Pastel.butterText, emoji: '🔗' };
    case 'cancelled': return { background: '#F2EDE5', textColor: '#999999', emoji: '×' };
    default: return { background: Pastel.coral, textColor: Pastel.coralText, emoji: '✎' };
  }
}

function EventCard({ event }: { event: SharedEvent }) {
  const res = getResponseFor(event.id, CURRENT_USER_ID);
  const stamp = statusStamp(event.status);
  const participants = event.participantIds
    .map((id) => getUserById(id))
    .filter((u): u is NonNullable<typeof u> => !!u);

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/events/[id]' as any, params: { id: event.id } })} activeOpacity={0.8}>
      <Card borderColor={stamp.background} style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardContent}>
            <ThemedText type="smallBold">{event.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDateTime(event.startAt)} - {formatTime(event.endAt)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">{event.location || '場所未定'}</ThemedText>
          </View>
          <StampBadge emoji={stamp.emoji} label={statusLabel(event.status)} background={stamp.background} textColor={stamp.textColor} />
        </View>
        <View style={styles.cardFooter}>
          {participants.length > 0 && <AvatarStack people={participants} size={22} />}
          <View style={styles.pillRow}>
            {res && (
              <View style={[styles.pill, { backgroundColor: Pastel.sky }]}>
                <ThemedText type="small" style={{ color: Pastel.skyText, fontSize: 11 }}>{statusLabel(res.status)}</ThemedText>
              </View>
            )}
            {event.sharedVia.length > 0 && (
              <View style={[styles.pill, { backgroundColor: '#F2EDE5' }]}>
                <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11 }}>{event.sharedVia.join(' / ')}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const todayEvents = MOCK_EVENTS.filter((e) => e.startAt.startsWith(TODAY));
  const upcomingEvents = MOCK_EVENTS.filter((e) => e.startAt > `${TODAY}T23:59`);
  const pendingInvites = MOCK_RESPONSES.filter(
    (r) => r.userId === CURRENT_USER_ID && r.status === 'pending'
  ).map((r) => MOCK_EVENTS.find((e) => e.id === r.eventId)).filter(Boolean) as typeof MOCK_EVENTS;
  const pastEvents = MOCK_EVENTS.filter((e) => e.status === 'completed');

  const sections = [
    { title: '今日', events: todayEvents, accent: Accent.red },
    { title: '今後', events: upcomingEvents, accent: Accent.green },
    { title: '回答待ちの招待', events: pendingInvites, accent: Pastel.butterText },
    { title: '過去', events: pastEvents, accent: '#999999' },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="subtitle">予定</ThemedText>
          </View>

          <GradientButton style={styles.createButton} onPress={() => router.push('/ai-chat')}>
            <ThemedText style={styles.createButtonText}>＋ 予定を作る</ThemedText>
          </GradientButton>

          {sections.map(({ title, events, accent }) => (
            <View key={title} style={styles.section}>
              <View style={styles.sectionTitleWrap}>
                <ThemedText type="smallBold">{title}</ThemedText>
                <View style={[styles.sectionLine, { backgroundColor: accent }]} />
              </View>
              {events.length === 0 ? (
                <Card style={styles.empty}>
                  <ThemedText type="small" themeColor="textSecondary">{title}の予定はありません</ThemedText>
                </Card>
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
    borderRadius: Radius.pill,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    paddingVertical: Spacing.one,
  },
  section: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionTitleWrap: { gap: 3, marginBottom: Spacing.one },
  sectionLine: { height: 2, width: 28, borderRadius: 1 },
  lastSection: {
    height: Spacing.six,
  },
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  empty: {
    padding: Spacing.three,
    alignItems: 'center',
  },
});
