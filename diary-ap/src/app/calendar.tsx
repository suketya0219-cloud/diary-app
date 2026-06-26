import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// TODO: SQLiteから日記が存在する日付一覧を取得する
// SELECT date FROM diaries WHERE is_confirmed = 1
const MOCK_DIARY_DATES = new Set(['2026-06-20', '2026-06-22', '2026-06-24']);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const theme = useTheme();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handlePrevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const handleDayPress = (day: number) => {
    router.push(`/diary/${dateStr(day)}`);
  };

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* 月ナビゲーション */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <ThemedText type="subtitle">‹</ThemedText>
            </TouchableOpacity>
            <ThemedText type="smallBold">
              {year}年{month + 1}月
            </ThemedText>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <ThemedText type="subtitle">›</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 曜日ヘッダー */}
          <View style={styles.dowRow}>
            {['日', '月', '火', '水', '木', '金', '土'].map(dow => (
              <ThemedText
                key={dow}
                type="small"
                themeColor="textSecondary"
                style={styles.dowCell}
              >
                {dow}
              </ThemedText>
            ))}
          </View>

          {/* 日付グリッド */}
          {weeks.map((wk, wi) => (
            <View key={wi} style={styles.weekRow}>
              {wk.map((day, di) => {
                if (!day) return <View key={di} style={styles.dayCell} />;
                const ds = dateStr(day);
                const hasDiary = MOCK_DIARY_DATES.has(ds);
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();

                return (
                  <TouchableOpacity
                    key={di}
                    style={[
                      styles.dayCell,
                      isToday && [styles.todayCell, { borderColor: theme.text }],
                    ]}
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      type="small"
                      style={isToday ? { fontWeight: '700' } : undefined}
                    >
                      {day}
                    </ThemedText>
                    {hasDiary && (
                      <View style={[styles.diaryDot, { backgroundColor: theme.text }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* 凡例 */}
          <View style={styles.legend}>
            <View style={[styles.diaryDot, { backgroundColor: theme.text }]} />
            <ThemedText type="small" themeColor="textSecondary">日記あり</ThemedText>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.three },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  navButton: { padding: Spacing.two },
  dowRow: { flexDirection: 'row' },
  dowCell: { flex: 1, textAlign: 'center', paddingVertical: Spacing.one },
  weekRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  todayCell: {
    borderWidth: 1.5,
    borderRadius: 999,
  },
  diaryDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
});
