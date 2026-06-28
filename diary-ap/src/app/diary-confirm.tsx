import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { BROWSER_HISTORY_MOCK } from '@/mock/browser';
import { LINE_MOCK_MESSAGES } from '@/mock/line';
import { CalendarService } from '@/services/calendar';
import { LocationService } from '@/services/location';
import { PhotoService } from '@/services/photo';
import { generateDiaryEntry } from '@/services/gemini';
import type { DiaryContext } from '@/services/gemini';
import { activityStore } from '@/store/activities';

async function generateDiaryDraft(): Promise<DiaryContext> {
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  const [events, location, photos] = await Promise.all([
    CalendarService.getTodayEvents().catch(() => []),
    LocationService.getCurrentLocation().catch(() => null),
    PhotoService.getTodayPhotos().catch(() => []),
  ]);

  const includedActivities = activityStore.getIncluded();
  const activityTitles = includedActivities.map((a) => a.title);
  const calendarTitles = events.map((e) => e.title);

  return generateDiaryEntry({
    date: dateStr,
    location: location?.placeName ?? includedActivities.find((a) => a.location)?.location,
    photoCount: photos.length || includedActivities.filter((a) => a.type === 'photo').length,
    steps: 8432,
    calendarEvents: [...calendarTitles, ...activityTitles],
    lineMessages: LINE_MOCK_MESSAGES.slice(0, 3),
    browserHistory: BROWSER_HISTORY_MOCK.slice(0, 3),
  });
}

export default function DiaryConfirmScreen() {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(true);
  const [context, setContext] = useState<DiaryContext | null>(null);
  const [diaryText, setDiaryText] = useState('');

  useEffect(() => {
    generateDiaryDraft().then((result) => {
      setContext(result);
      setDiaryText(result.diary_text);
      setIsGenerating(false);
    });
  }, []);

  const handleSave = () => {
    console.log('保存する日記:', diaryText);
    console.log('コンテキスト:', context);
    // TODO: SQLiteに保存
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.text} />
            <ThemedText type="small" themeColor="textSecondary" style={styles.loadingText}>
              今日の出来事をまとめています...
            </ThemedText>
          </View>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

            {/* 日記テキスト編集 */}
            <ThemedText type="smallBold">日記</ThemedText>
            <TextInput
              style={[styles.textInput, {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              }]}
              multiline
              value={diaryText}
              onChangeText={setDiaryText}
              placeholder="日記の内容..."
              placeholderTextColor={theme.textSecondary}
            />

            {/* 抽出されたコンテキスト */}
            {context && (
              <ThemedView type="backgroundElement" style={styles.contextCard}>
                <ThemedText type="smallBold" style={styles.contextTitle}>抽出されたコンテキスト</ThemedText>

                {context.summary ? (
                  <View style={styles.contextRow}>
                    <ThemedText type="small" themeColor="textSecondary">要約</ThemedText>
                    <ThemedText type="small">{context.summary}</ThemedText>
                  </View>
                ) : null}

                {context.mood ? (
                  <View style={styles.contextRow}>
                    <ThemedText type="small" themeColor="textSecondary">気分</ThemedText>
                    <ThemedText type="small">{context.mood}</ThemedText>
                  </View>
                ) : null}

                {context.activities.length > 0 && (
                  <View style={styles.contextRow}>
                    <ThemedText type="small" themeColor="textSecondary">活動</ThemedText>
                    <View style={styles.pillRow}>
                      {context.activities.map((a) => (
                        <View key={a} style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                          <ThemedText type="small">{a}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {context.places.length > 0 && (
                  <View style={styles.contextRow}>
                    <ThemedText type="small" themeColor="textSecondary">場所</ThemedText>
                    <View style={styles.pillRow}>
                      {context.places.map((p) => (
                        <View key={p} style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                          <ThemedText type="small">{p}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {context.with_people.length > 0 && (
                  <View style={styles.contextRow}>
                    <ThemedText type="small" themeColor="textSecondary">一緒にいた人</ThemedText>
                    <View style={styles.pillRow}>
                      {context.with_people.map((p) => (
                        <View key={p} style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
                          <ThemedText type="small">{p}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </ThemedView>
            )}

          </ScrollView>
        )}

        {!isGenerating && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.text }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.saveButtonText, { color: theme.background }]}>
              保存する
            </ThemedText>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, gap: Spacing.three },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  scroll: { flex: 1 },
  scrollContent: { gap: Spacing.three, paddingTop: Spacing.three },
  textInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  contextCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  contextTitle: {
    marginBottom: Spacing.one,
  },
  contextRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  pillRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  pill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Spacing.one,
  },
  saveButton: {
    padding: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
