import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { Radius, Shadow } from '@/constants/theme';

type GradientButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary';
};

export function GradientButton({ style, children, variant = 'primary', ...props }: GradientButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.wrapper, isPrimary && Shadow.card, style]} {...props}>
      <LinearGradient
        colors={isPrimary ? ['#1A1A1A', '#3D3D3D'] : ['#F5F5F5', '#E8E8E8']}
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
