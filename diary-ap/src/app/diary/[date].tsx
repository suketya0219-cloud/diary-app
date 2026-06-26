import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// TODO: SQLiteから対象日付の日記を取得する
// SELECT * FROM diaries WHERE date = :date
function useDiaryByDate(date: string) {
  const mockText = `【${date}の日記】\n\nこの日はまだ日記がありません。\n\n（TODO: SQLiteから実データを取得する）`;
  const [text, setText] = useState(mockText);
  const [isSaved, setIsSaved] = useState(false);
  return { text, setText, isSaved, setIsSaved };
}

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const theme = useTheme();
  const { text, setText, isSaved, setIsSaved } = useDiaryByDate(date ?? '');

  const handleSave = () => {
    // TODO: UPDATE diaries SET confirmed_text = :text, updated_at = NOW() WHERE date = :date
    // TODO: 修正履歴をedit_historyに記録する
    console.log('保存:', date, text);
    setIsSaved(true);
  };

  const [year, month, day] = (date ?? '').split('-');
  const dateLabel = year && month && day ? `${year}年${month}月${day}日` : date;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>

        <View style={styles.dateHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">{dateLabel}</ThemedText>
          {isSaved && (
            <ThemedText type="small" style={{ color: '#34C759' }}>保存済み ✓</ThemedText>
          )}
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }
            ]}
            multiline
            value={text}
            onChangeText={(t) => { setText(t); setIsSaved(false); }}
            placeholder="この日の日記..."
            placeholderTextColor={theme.textSecondary}
          />
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.text }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.saveButtonText, { color: theme.background }]}>
            保存する
          </ThemedText>
        </TouchableOpacity>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.two },
  textInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 400,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  saveButtonText: { fontSize: 16, fontWeight: '600' },
});
