import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { chat } from '@/services/gemini';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function AiChatScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const reply = await chat(history, text);
      setMessages([...nextMessages, { id: (Date.now() + 1).toString(), role: 'model', text: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages([...nextMessages, { id: (Date.now() + 1).toString(), role: 'model', text: `エラー: ${msg}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          {/* メッセージリスト */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={styles.empty}>
                <ThemedText style={styles.emptyIcon}>🤖</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                  Gemini に何でも聞いてみてください
                </ThemedText>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleModel]}>
                <ThemedText
                  style={[
                    styles.bubbleText,
                    { color: item.role === 'user' ? '#fff' : theme.text },
                  ]}
                >
                  {item.text}
                </ThemedText>
              </View>
            )}
          />

          {/* 入力エリア */}
          <View style={[styles.inputRow, { backgroundColor: theme.backgroundElement }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="メッセージを入力..."
              placeholderTextColor={theme.textSecondary}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.text }, (!input.trim() || loading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              {loading
                ? <ActivityIndicator color={theme.background} size="small" />
                : <ThemedText style={[styles.sendIcon, { color: theme.background }]}>↑</ThemedText>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  inner: { flex: 1 },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { textAlign: 'center' },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#3c87f7',
    borderBottomRightRadius: Spacing.half,
  },
  bubbleModel: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Spacing.half,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: Spacing.three,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: Spacing.one,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});
