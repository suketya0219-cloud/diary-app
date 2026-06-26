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

// ─── Rule-based 日記生成 ──────────────────────────────────────────────────────
// TODO: Phase 1B でAIモデル（Local / Cloud / Rule-based Provider）に差し替える
async function generateDiaryDraft(): Promise<string> {
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  // 各サービスからデータを並列取得（失敗しても日記生成は続ける）
  const [events, location, photos] = await Promise.all([
    CalendarService.getTodayEvents().catch(() => []),
    LocationService.getCurrentLocation().catch(() => null),
    PhotoService.getTodayPhotos().catch(() => []),
  ]);

  const lineEvents = LINE_MOCK_MESSAGES
    .map(m => `・${m.sender}と「${m.body.slice(0, 15)}...」のやりとり`)
    .slice(0, 2);
  const browserEvents = BROWSER_HISTORY_MOCK
    .map(b => `・「${b.title}」を調べた`)
    .slice(0, 2);
  const calendarLines = events.length > 0
    ? events.map(e => `・${e.title}`)
    : ['・予定なし（またはカレンダー未連携）'];
  const locationLine = location
    ? `今日は主に ${location.placeName} にいた。`
    : '（位置情報: 実装予定）';
  const photoLine = photos.length > 0
    ? `写真を ${photos.length} 枚撮影した。`
    : '（写真: 実装予定）';

  // TODO: 実装後は歩数をHealthKitから取得する
  const lines = [
    `【${dateStr}の日記】`,
    '',
    locationLine,
    photoLine,
    '今日は8,432歩歩いた。（TODO: HealthKitから取得）',
    '',
    '予定:',
    ...calendarLines,
    '',
    'LINEでのやりとり:',
    ...lineEvents,
    '',
    '調べたこと:',
    ...browserEvents,
  ];

  // 生成に時間がかかるように見せる（実AI実装後は不要）
  await new Promise(r => setTimeout(r, 1500));
  return lines.join('\n');
}

export default function DiaryConfirmScreen() {
  const theme = useTheme();
  const [isGenerating, setIsGenerating] = useState(true);
  const [diaryText, setDiaryText] = useState('');

  useEffect(() => {
    generateDiaryDraft().then((draft) => {
      setDiaryText(draft);
      setIsGenerating(false);
    });
  }, []);

  // TODO: SQLiteに保存する。現在はコンソールログのみ
  const handleSave = () => {
    console.log('保存する日記:', diaryText);
    // TODO: INSERT INTO diaries (date, draft_text, confirmed_text, is_confirmed, ...) VALUES (...)
    // TODO: 修正前後の差分をedit_historyに記録する（Personal Context形成に使用）
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
            {/* TODO: 実際のデータ収集状況をここに表示する */}
            <ThemedText type="small" themeColor="textSecondary">
              📍 位置情報を取得中（実装予定）
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              📷 写真を確認中（実装予定）
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              📅 カレンダーを確認中（実装予定）
            </ThemedText>
          </View>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

            {/* 注意書き: AI推論と事実の分離 */}
            <ThemedView type="backgroundElement" style={styles.noteCard}>
              <ThemedText type="small" themeColor="textSecondary">
                ✏️ 内容を確認・編集して保存してください。
              </ThemedText>
              {/* TODO: 事実・本人入力・AI推論を分けて表示する（仕様書: コンテンツ種別）*/}
            </ThemedView>

            {/* 日記テキスト編集エリア */}
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
              value={diaryText}
              onChangeText={setDiaryText}
              placeholder="日記の内容..."
              placeholderTextColor={theme.textSecondary}
            />

          </ScrollView>
        )}

        {/* 保存ボタン */}
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
  noteCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    textAlignVertical: 'top',
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
