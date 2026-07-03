import { View, type ViewProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & { variant?: 'default' | 'elevated' };

export function Card({ style, variant = 'default', ...props }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.backgroundElement,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: '#E8F5EE',
          ...(variant === 'elevated' ? Shadow.strong : Shadow.card),
        },
        style,
      ]}
      {...props}
    />
  );
}
