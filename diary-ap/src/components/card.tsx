import { View, type ViewProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

type CardProps = ViewProps & { variant?: 'default' | 'elevated'; borderColor?: string };

export function Card({ style, variant = 'default', borderColor = '#EDE8E0', ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFCF8',
          borderRadius: Radius.lg,
          borderWidth: 1,
          borderColor,
          ...(variant === 'elevated' ? Shadow.strong : Shadow.card),
        },
        style,
      ]}
      {...props}
    />
  );
}
