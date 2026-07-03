import { View, type ViewProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

type CardProps = ViewProps & { variant?: 'default' | 'elevated' };

export function Card({ style, variant = 'default', ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFCF8',
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: '#EDE8E0',
          ...(variant === 'elevated' ? Shadow.strong : Shadow.card),
        },
        style,
      ]}
      {...props}
    />
  );
}
