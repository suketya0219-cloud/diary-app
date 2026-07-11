import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';

type StampBadgeProps = {
  emoji: string;
  label: string;
  background: string;
  textColor: string;
  style?: ViewStyle;
};

export function StampBadge({ emoji, label, background, textColor, style }: StampBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: background }, style]}>
      <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
  },
  emoji: { fontSize: 15 },
  label: { fontSize: 12, fontWeight: '600' },
});
