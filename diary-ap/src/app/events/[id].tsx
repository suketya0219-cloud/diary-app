import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  CURRENT_USER_ID,
  MOCK_EVENTS,
  MOCK_MEMORIES,
  MOCK_MESSAGES,
  MOCK_PHOTOS,
  MOCK_RESPONSES,
  MOCK_WEATHER,
  getUserById,
  getResponseFor,
  getWeatherForDate,
} from '@/mock/events';
import type { EventBelonging, EventRole, SharedEvent } from '@/types/events';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusLabel(s: string) {
  const m: Record<string, string> = {
    draft: '下書き', shared: '共有済み', confirmed: '確定', completed: '実施済み', cancelled: '中止',
    pending: '回答待ち', accepted: '参加', declined: '辞退', tentative: '保留',
    event_detail: '予定内容', message: 'メッセージ', weather: '天気', place: '場所', suggested: '提案',
  };
  return m[s] ?? s;
}

function SectionTitle({ children }: { children: string }) {
  return <ThemedText type="smallBold" style={styles.sectionTitle}>{children}</ThemedText>;
}

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <ThemedView type="backgroundElement" style={[styles.card, style]}>
      {children}
    </ThemedView>
  );
}

export default function EventDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const eventData = MOCK_EVENTS.find((e) => e.id === id);
  const [event, setEvent] = useState<SharedEvent | null>(eventData ?? null);

  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <ThemedText style={{ padding: Spacing.four }}>予定が見つかりません</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const participants = event.participantIds.map((pid) => ({
    user: getUserById(pid)!,
    res: getResponseFor(event.id, pid),
  }));
  const weather = getWeatherForDate(event.startAt.slice(0, 10));
  const messages = MOCK_MESSAGES.filter((m) => m.eventId === event.id);
  const photos = MOCK_PHOTOS.filter((p) => p.eventId === event.id);
  const relatedMemories = MOCK_MEMORIES.filter((mem) =>
    mem.userIds.some((uid) => uid !== CURRENT_USER_ID && event.participantIds.includes(uid))
  );

  const toggleRole = (roleId: string) => {
    setEvent((prev) => prev && {
      ...prev,
      roles: prev.roles.map((r) => r.id === roleId ? { ...r, done: !r.done } : r),
    });
  };

  const toggleBelonging = (belongingId: string) => {
    setEvent((prev) => prev && {
      ...prev,
      belongings: prev.belongings.map((b) => b.id === belongingId ? { ...b, checked: !b.checked } : b),
    });
  };

  const openMap = () => {
    if (!event.place) return;
    const q = encodeURIComponent(`${event.place.name} ${event.place.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* 基本情報 */}
          <Card style={styles.heroCard}>
            <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatDateTime(event.startAt)} - {formatTime(event.endAt)}
            </ThemedText>
            <ThemedText type="smallBold">{event.location || '場所未定'}</ThemedText>
            {event.place && (
              <TouchableOpacity
                style={[styles.mapButton, { backgroundColor: theme.backgroundSelected }]}
                onPress={openMap}
                activeOpacity={0.8}
              >
                <ThemedText type="small">📍 MAPで場所を確認</ThemedText>
              </TouchableOpacity>
            )}
            {event.description ? (
              <ThemedText type="small" themeColor="textSecondary">{event.description}</ThemedText>
            ) : null}
            <View style={styles.pillRow}>
              <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="small" themeColor="textSecondary">作成者: {getUserById(event.creatorUserId)?.displayName}</ThemedText>
              </View>
              <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="small" themeColor="textSecondary">{statusLabel(event.status)}</ThemedText>
              </View>
              <View style={[styles.pill, { backgroundColor: event.diaryEnabled ? '#34C75920' : theme.backgroundSelected }]}>
                <ThemedText type="small" themeColor="textSecondary">{event.diaryEnabled ? '日記反映あり' : '日記反映なし'}</ThemedText>
              </View>
            </View>
          </Card>

          {/* 天気 */}
          {weather && (
            <View style={styles.section}>
              <SectionTitle>当日の天気</SectionTitle>
              <Card>
                <ThemedText type="smallBold">{weather.area} {weather.summary}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {weather.lowC}〜{weather.highC}℃ / 降水確率{weather.rainProbability}% / {weather.wind}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{weather.suggestion}</ThemedText>
              </Card>
            </View>
          )}

          {/* 参加者 */}
          <View style={styles.section}>
            <SectionTitle>参加者</SectionTitle>
            <Card>
              <View style={styles.pillRow}>
                {participants.map(({ user, res }) => (
                  <View key={user.id} style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="small">{user.displayName}: {statusLabel(res?.status ?? 'pending')}</ThemedText>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          {/* 役割 */}
          <View style={styles.section}>
            <SectionTitle>役割</SectionTitle>
            {event.roles.length === 0 ? (
              <Card>
                <ThemedText type="small" themeColor="textSecondary">まだ役割はありません。</ThemedText>
              </Card>
            ) : (
              event.roles.map((role) => (
                <Card key={role.id} style={styles.prepCard}>
                  <View style={styles.prepRow}>
                    <View style={styles.prepContent}>
                      <ThemedText type="smallBold">{role.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        担当: {getUserById(role.userId)?.displayName} / 由来: {statusLabel(role.source)}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      style={[styles.doneButton, { backgroundColor: role.done ? '#34C759' : theme.backgroundSelected }]}
                      onPress={() => toggleRole(role.id)}
                      activeOpacity={0.8}
                    >
                      <ThemedText type="small" style={role.done ? { color: '#fff' } : undefined}>
                        {role.done ? '完了済み' : '完了にする'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </View>

          {/* 持ち物 */}
          <View style={styles.section}>
            <SectionTitle>持ち物</SectionTitle>
            {event.belongings.length === 0 ? (
              <Card>
                <ThemedText type="small" themeColor="textSecondary">持ち物候補はまだありません。</ThemedText>
              </Card>
            ) : (
              event.belongings.map((item) => (
                <Card key={item.id} style={styles.prepCard}>
                  <View style={styles.prepRow}>
                    <View style={styles.prepContent}>
                      <ThemedText type="smallBold">{item.checked ? '✓ ' : ''}{item.label}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        担当: {item.ownerUserId ? getUserById(item.ownerUserId)?.displayName : '共通'} / 由来: {statusLabel(item.source)}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      style={[styles.doneButton, { backgroundColor: item.checked ? '#34C759' : theme.backgroundSelected }]}
                      onPress={() => toggleBelonging(item.id)}
                      activeOpacity={0.8}
                    >
                      <ThemedText type="small" style={item.checked ? { color: '#fff' } : undefined}>
                        {item.checked ? '確認済み' : '確認'}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </View>

          {/* メッセージ */}
          <View style={styles.section}>
            <SectionTitle>メッセージ</SectionTitle>
            {messages.length === 0 ? (
              <Card><ThemedText type="small" themeColor="textSecondary">まだメッセージはありません。</ThemedText></Card>
            ) : (
              messages.map((msg) => (
                <Card key={msg.id} style={styles.prepCard}>
                  <View style={styles.msgHeader}>
                    <ThemedText type="smallBold">{getUserById(msg.userId)?.displayName}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{formatTime(msg.sentAt)}</ThemedText>
                  </View>
                  <ThemedText type="small">{msg.text}</ThemedText>
                </Card>
              ))
            )}
          </View>

          {/* 写真 */}
          <View style={styles.section}>
            <SectionTitle>共有写真</SectionTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.photoStrip}>
                {photos.length === 0 ? (
                  <>
                    {['未共有', '＋', '＋'].map((label, i) => (
                      <ThemedView key={i} type="backgroundElement" style={styles.photo}>
                        <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
                      </ThemedView>
                    ))}
                  </>
                ) : (
                  photos.map((photo) => (
                    <ThemedView key={photo.id} type="backgroundElement" style={styles.photo}>
                      <ThemedText>📷</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">{photo.label}</ThemedText>
                    </ThemedView>
                  ))
                )}
              </View>
            </ScrollView>
          </View>

          {/* メンバーとの思い出 */}
          {relatedMemories.length > 0 && (
            <View style={styles.section}>
              <SectionTitle>メンバーとの思い出</SectionTitle>
              {relatedMemories.map((mem) => (
                <Card key={mem.id} style={styles.prepCard}>
                  <View style={styles.prepRow}>
                    <View style={styles.prepContent}>
                      <ThemedText type="smallBold">{mem.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">{mem.summary}</ThemedText>
                    </View>
                    <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                      <ThemedText type="small" themeColor="textSecondary">{mem.date}</ThemedText>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* 操作 */}
          <View style={styles.section}>
            <SectionTitle>操作</SectionTitle>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.backgroundElement }]}
                onPress={() => Alert.alert('モック', '共有のモックです')}
                activeOpacity={0.8}
              >
                <ThemedText type="small">共有</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.backgroundElement }]}
                onPress={() => Alert.alert('モック', 'カレンダー追加のモックです')}
                activeOpacity={0.8}
              >
                <ThemedText type="small">カレンダーへ追加</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.backgroundElement }]}
                onPress={() => Alert.alert('モック', '実施済みにしました')}
                activeOpacity={0.8}
              >
                <ThemedText type="small">実施済みにする</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                onPress={() => router.push('/diary-confirm')}
                activeOpacity={0.8}
              >
                <ThemedText type="small" style={{ color: '#fff' }}>日記候補へ追加</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.lastSection} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  heroCard: {
    margin: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  mapButton: {
    padding: Spacing.two,
    borderRadius: Spacing.one,
    alignSelf: 'flex-start',
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
  section: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  prepCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  prepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  prepContent: {
    flex: 1,
    gap: Spacing.half,
  },
  doneButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoStrip: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actionButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
  },
  lastSection: { height: Spacing.six },
});
