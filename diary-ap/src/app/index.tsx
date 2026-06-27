import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// TODO: 実装後はSQLiteから今日の日記有無を確認する
function useTodayDiaryStatus() {
  // 仮: 常に「未作成」を返す
  // 実装後: SELECT * FROM diaries WHERE date = TODAY
  const [hasToday] = useState(false);
  return hasToday;
}

export default function HomeScreen() {
  const theme = useTheme();
  const hasToday = useTodayDiaryStatus();

  const today = new Date();
  const dateLabel = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  // 「日記を書く」ボタン → データ収集 → diary-confirm画面へ
  // TODO: データ収集フロー（写真・位置・カレンダー・健康）を実装
  const handleWriteDiary = () => {
    router.push('/diary-confirm');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* ヘッダー */}
        <View style={styles.header}>
          <ThemedText type="subtitle">日記</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{dateLabel}</ThemedText>
        </View>

        {/* ステータス表示 */}
        <ThemedView
          type="backgroundElement"
          style={styles.statusCard}
        >
          <ThemedText type="smallBold">今日の日記</ThemedText>
          <View style={[
            styles.statusBadge,
            { backgroundColor: hasToday ? '#34C759' : '#FF9500' }
          ]}>
            <ThemedText style={styles.statusBadgeText}>
              {hasToday ? '作成済み ✓' : '未作成'}
            </ThemedText>
          </View>
        </ThemedView>

        {/* メインボタン: 日記を書く */}
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.text }]}
          onPress={handleWriteDiary}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.primaryButtonText, { color: theme.background }]}>
            日記を書く
          </ThemedText>
        </TouchableOpacity>

        {/* サブボタン群 */}
        <View style={styles.subButtonRow}>

          {/* カレンダー */}
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: theme.backgroundElement }]}
            onPress={() => router.push('/calendar')}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.subButtonIcon}>📅</ThemedText>
            <ThemedText type="small">カレンダー</ThemedText>
          </TouchableOpacity>

          {/* 設定 */}
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: theme.backgroundElement }]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.subButtonIcon}>⚙️</ThemedText>
            <ThemedText type="small">設定</ThemedText>
          </TouchableOpacity>

          {/* AIと相談 */}
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: theme.backgroundElement }]}
            onPress={() => router.push('/ai-chat')}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.subButtonIcon}>🤖</ThemedText>
            <ThemedText type="small">AIと相談</ThemedText>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    paddingTop: Spacing.three,
    gap: Spacing.half,
  },
  statusCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    padding: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  subButtonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  subButton: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.half,
  },
  subButtonDisabled: {
    opacity: 0.6,
  },
  subButtonIcon: {
    fontSize: 24,
  },
  comingSoon: {
    fontSize: 10,
  },
});
