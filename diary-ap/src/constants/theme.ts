/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FBF8F3',
    backgroundElement: '#F2EDE5',
    backgroundSelected: '#E8E0D5',
    textSecondary: '#999999',
  },
  dark: {
    text: '#1A1A1A',
    background: '#FBF8F3',
    backgroundElement: '#F2EDE5',
    backgroundSelected: '#E8E0D5',
    textSecondary: '#999999',
  },
} as const;

// ポイントカラー（白黒以外のアクセント）
export const Accent = {
  red: '#E84040',    // タイトル・強調・今日
  green: '#3DB870',  // ライン・進捗・完了
} as const;

// パステルカラー（スタンプ・カテゴリ分類・淡い枠線用）
export const Pastel = {
  coral: '#FCE0DD',
  coralText: '#C85A50',
  mint: '#DCEFE3',
  mintText: '#3B8F63',
  sky: '#DCEAF6',
  skyText: '#4A85B0',
  butter: '#FBEFD2',
  butterText: '#B08A2E',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Shadow = {
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8 },
    android: { elevation: 2 },
    web: { boxShadow: '0 1px 8px rgba(0,0,0,0.06)' } as any,
    default: {},
  }) ?? {},
  strong: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 20 },
    android: { elevation: 5 },
    web: { boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } as any,
    default: {},
  }) ?? {},
};

export const Radius = { sm: 10, md: 16, lg: 24, pill: 100 } as const;
