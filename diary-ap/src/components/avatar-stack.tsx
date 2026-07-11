import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Pastel } from '@/constants/theme';

type Person = { id: string; avatar: string };

const PALETTE = [Pastel.butter, Pastel.mint, Pastel.sky, Pastel.coral];

export function AvatarStack({ people, size = 24 }: { people: Person[]; size?: number }) {
  return (
    <View style={styles.row}>
      {people.map((p, i) => (
        <View
          key={p.id}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: PALETTE[i % PALETTE.length],
              marginLeft: i === 0 ? 0 : -size * 0.35,
            },
          ]}
        >
          <ThemedText style={[styles.initial, { fontSize: size * 0.42 }]}>{p.avatar}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFCF8',
  },
  initial: { fontWeight: '700', color: '#4A4A4A' },
});
