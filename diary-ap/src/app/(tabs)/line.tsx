import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FRIENDS } from '@/mock/persona';
import { MOCK_EVENTS } from '@/mock/events';

type SubTab = 'friends' | 'chats';

function formatTime(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function LineScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<SubTab>('chats');
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  const upcomingEvents = MOCK_EVENTS.filter((e) => e.status !== 'completed');

  const handleInvite = (friendId: string, friendName: string) => {
    setInvitedMap((prev) => ({ ...prev, [friendId]: true }));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* サブタブ */}
        <View style={[styles.subTabBar, { borderBottomColor: theme.backgroundElement }]}>
          {(['chats', 'friends'] as SubTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.subTab, activeTab === tab && { borderBottomColor: theme.text, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                type="small"
                style={{ fontWeight: activeTab === tab ? '700' : '400' }}
                themeColor={activeTab === tab ? 'text' : 'textSecondary'}
              >
                {tab === 'chats' ? 'チャット' : '友達'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'chats' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {FRIENDS.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                onPress={() => router.push({ pathname: '/line-chat/[friendId]' as any, params: { friendId: friend.id } })}
                activeOpacity={0.8}
              >
                <View style={[styles.chatRow, { borderBottomColor: theme.backgroundElement }]}>
                  <View style={styles.avatarCircle}>
                    <ThemedText style={styles.avatarEmoji}>{friend.avatarEmoji}</ThemedText>
                  </View>
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <ThemedText type="smallBold">{friend.name}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">{formatTime(friend.lastMessageTime)}</ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>{friend.lastMessage}</ThemedText>
                  </View>
                  {friend.unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: '#06C755' }]}>
                      <ThemedText style={styles.badgeText}>{friend.unreadCount}</ThemedText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.friendsList}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.friendsHint}>
              友達を選んで予定に招待できます
            </ThemedText>
            {FRIENDS.map((friend) => (
              <ThemedView key={friend.id} type="backgroundElement" style={styles.friendCard}>
                <View style={styles.friendRow}>
                  <View style={styles.avatarCircle}>
                    <ThemedText style={styles.avatarEmoji}>{friend.avatarEmoji}</ThemedText>
                  </View>
                  <View style={styles.friendInfo}>
                    <ThemedText type="smallBold">{friend.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{friend.relation}</ThemedText>
                  </View>
                </View>
                {upcomingEvents.length > 0 && (
                  <View style={styles.inviteSection}>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.inviteLabel}>予定に招待</ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.eventPills}>
                        {upcomingEvents.map((event) => {
                          const key = `${friend.id}-${event.id}`;
                          const invited = invitedMap[key];
                          return (
                            <TouchableOpacity
                              key={event.id}
                              style={[
                                styles.eventPill,
                                { backgroundColor: invited ? '#34C759' : theme.backgroundSelected }
                              ]}
                              onPress={() => !invited && setInvitedMap((p) => ({ ...p, [key]: true }))}
                              activeOpacity={0.8}
                            >
                              <ThemedText
                                type="small"
                                style={{ color: invited ? '#fff' : undefined }}
                              >
                                {invited ? '招待済み ✓' : `📅 ${event.title}`}
                              </ThemedText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ThemedView>
            ))}
          </ScrollView>
        )}

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  subTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  chatContent: { flex: 1, gap: 2 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  friendsList: { padding: Spacing.four, gap: Spacing.three },
  friendsHint: { marginBottom: Spacing.one },
  friendCard: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  friendInfo: { flex: 1, gap: 2 },
  inviteSection: { gap: Spacing.one },
  inviteLabel: {},
  eventPills: { flexDirection: 'row', gap: Spacing.two },
  eventPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
});
