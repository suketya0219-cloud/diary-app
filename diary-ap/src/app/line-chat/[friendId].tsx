import { useLocalSearchParams } from 'expo-router';
import { useRef, useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FRIENDS } from '@/mock/persona';
import { LINE_CHAT_MESSAGES, type ChatMessage } from '@/mock/line-chats';

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function LineChatScreen() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const theme = useTheme();
  const friend = FRIENDS.find((f) => f.id === friendId);
  const flatRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  const baseMessages = LINE_CHAT_MESSAGES.filter((m) => m.friendId === friendId);
  const [messages, setMessages] = useState<ChatMessage[]>(baseMessages);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `new-${Date.now()}`,
      friendId: friendId ?? '',
      sender: 'me',
      body: inputText.trim(),
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 50);
  }, [messages]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => (
              <View style={[styles.messageRow, item.sender === 'me' && styles.messageRowMe]}>
                {item.sender === 'friend' && (
                  <View style={styles.friendAvatar}>
                    <ThemedText style={styles.avatarEmoji}>{friend?.avatarEmoji ?? '👤'}</ThemedText>
                  </View>
                )}
                <View style={[
                  styles.bubble,
                  item.sender === 'me'
                    ? { backgroundColor: '#06C755' }
                    : { backgroundColor: theme.backgroundElement }
                ]}>
                  <ThemedText
                    type="small"
                    style={{ color: item.sender === 'me' ? '#fff' : theme.text }}
                  >
                    {item.body}
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.timestamp}>
                  {formatTime(item.time)}
                </ThemedText>
              </View>
            )}
          />
          <View style={[styles.inputBar, { borderTopColor: theme.backgroundElement, backgroundColor: theme.background }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="メッセージを入力"
              placeholderTextColor={theme.textSecondary}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#06C755' : theme.backgroundElement }]}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <ThemedText style={{ color: inputText.trim() ? '#fff' : theme.textSecondary, fontSize: 16 }}>
                ↑
              </ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

export function generateStaticParams() {
  return [
    { friendId: 'f1' },
    { friendId: 'f2' },
    { friendId: 'f3' },
    { friendId: 'f4' },
    { friendId: 'f5' },
    { friendId: 'family' },
  ];
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  messageList: { padding: Spacing.three, gap: Spacing.two },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  messageRowMe: { flexDirection: 'row-reverse' },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  timestamp: { fontSize: 10, marginBottom: 2 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.two,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
