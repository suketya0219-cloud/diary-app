import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

type GradientButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary';
};

export function GradientButton({ style, children, variant = 'primary', ...props }: GradientButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.wrapper, Shadow.card, style]} {...props}>
      <LinearGradient
        colors={isPrimary ? ['#2D8A5E', '#1A4731'] : ['#E8F5EE', '#D4F0E4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: Radius.md, overflow: 'hidden' },
  gradient: { paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
});
