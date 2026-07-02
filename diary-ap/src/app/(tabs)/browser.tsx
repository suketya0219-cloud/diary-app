import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { BROWSER_HISTORY_MOCK } from '@/mock/browser';

const CATEGORIES = ['すべて', 'テニス', '料理', '映画', '仕事', 'ショッピング', 'ニュース'] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_EMOJI: Record<string, string> = {
  テニス: '🎾', 料理: '🍳', 映画: '🎬', 仕事: '💼', ショッピング: '🛍', ニュース: '📰',
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function BrowserScreen() {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('すべて');

  const filtered = activeCategory === 'すべて'
    ? BROWSER_HISTORY_MOCK
    : BROWSER_HISTORY_MOCK.filter((h) => h.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* カテゴリフィルター */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterPill,
                {
                  backgroundColor: activeCategory === cat ? theme.text : theme.backgroundElement,
                }
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <ThemedText
                type="small"
                style={{ color: activeCategory === cat ? theme.background : theme.text }}
              >
                {cat !== 'すべて' ? `${CATEGORY_EMOJI[cat]} ` : ''}{cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
            {sorted.length}件の閲覧履歴
          </ThemedText>
          {sorted.map((item, i) => (
            <ThemedView key={i} type="backgroundElement" style={styles.card}>
              <View style={styles.cardRow}>
                <ThemedText style={styles.categoryEmoji}>
                  {CATEGORY_EMOJI[item.category] ?? '🌐'}
                </ThemedText>
                <View style={styles.cardContent}>
                  <ThemedText type="smallBold" numberOfLines={2}>{item.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{item.url}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{formatDateTime(item.time)}</ThemedText>
                </View>
              </View>
            </ThemedView>
          ))}
        </ScrollView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  filterBar: {
    flexGrow: 0,
    paddingVertical: Spacing.two,
  },
  filterContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
  list: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  count: {
    marginBottom: Spacing.one,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  categoryEmoji: { fontSize: 20, paddingTop: 2 },
  cardContent: { flex: 1, gap: 2 },
});
