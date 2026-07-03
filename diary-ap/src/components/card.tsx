import { View, type ViewProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

type CardProps = ViewProps & { variant?: 'default' | 'elevated' };

export function Card({ style, variant = 'default', ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          ...(variant === 'elevated' ? Shadow.strong : Shadow.card),
        },
        style,
      ]}
      {...props}
    />
  );
}
