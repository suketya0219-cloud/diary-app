import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DIARY_HISTORY } from '@/mock/diary-history';

const DIARY_DATE_SET = new Set(DIARY_HISTORY.filter((d) => d.saved).map((d) => d.date));

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DiaryScreen() {
  const theme = useTheme();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <ThemedText type="subtitle">日記</ThemedText>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.text }]}
              onPress={() => router.push('/diary-confirm')}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.createButtonText, { color: theme.background }]}>今日を書く</ThemedText>
            </TouchableOpacity>
          </View>

          {/* カレンダー */}
          <ThemedView type="backgroundElement" style={styles.calendar}>
            <View style={styles.monthNav}>
              <TouchableOpacity
                onPress={() => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }}
                style={styles.navButton}
              >
                <ThemedText type="subtitle">‹</ThemedText>
              </TouchableOpacity>
              <ThemedText type="smallBold">{year}年{month + 1}月</ThemedText>
              <TouchableOpacity
                onPress={() => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }}
                style={styles.navButton}
              >
                <ThemedText type="subtitle">›</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.dowRow}>
              {['日', '月', '火', '水', '木', '金', '土'].map((dow) => (
                <ThemedText key={dow} type="small" themeColor="textSecondary" style={styles.dowCell}>{dow}</ThemedText>
              ))}
            </View>

            {weeks.map((wk, wi) => (
              <View key={wi} style={styles.weekRow}>
                {wk.map((day, di) => {
                  if (!day) return <View key={di} style={styles.dayCell} />;
                  const ds = dateStr(day);
                  const hasDiary = DIARY_DATE_SET.has(ds);
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  return (
                    <TouchableOpacity
                      key={di}
                      style={[styles.dayCell, isToday && [styles.todayCell, { borderColor: theme.text }]]}
                      onPress={() => router.push(`/diary/${ds}`)}
                      activeOpacity={0.7}
                    >
                      <ThemedText type="small" style={isToday ? { fontWeight: '700' } : undefined}>{day}</ThemedText>
                      {hasDiary && <View style={[styles.diaryDot, { backgroundColor: theme.text }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ThemedView>

          {/* 日記一覧 */}
          <View style={styles.section}>
            <ThemedText type="smallBold" style={styles.sectionTitle}>
              確定済み日記（{DIARY_HISTORY.filter((d) => d.saved).length}件）
            </ThemedText>
            {[...DIARY_HISTORY]
              .filter((d) => d.saved)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((diary) => (
                <TouchableOpacity
                  key={diary.date}
                  onPress={() => router.push(`/diary/${diary.date}`)}
                  activeOpacity={0.8}
                >
                  <ThemedView type="backgroundElement" style={styles.diaryCard}>
                    <View style={styles.diaryRow}>
                      <View style={styles.diaryContent}>
                        <ThemedText type="smallBold">{diary.date}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">{diary.context.summary}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                          {diary.context.diary_text}
                        </ThemedText>
                      </View>
                      <View style={[styles.statusPill, { backgroundColor: '#34C759' }]}>
                        <ThemedText type="small" style={{ color: '#fff' }}>確定済み</ThemedText>
                      </View>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  createButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendar: {
    marginHorizontal: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
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
  section: {
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  sectionTitle: { marginBottom: Spacing.one },
  diaryCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  diaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  diaryContent: {
    flex: 1,
    gap: Spacing.half,
  },
  statusPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  lastSection: { height: Spacing.six },
});
