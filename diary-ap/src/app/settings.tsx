import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DEFAULT_SETTINGS, Settings } from '@/types/diary';

// TODO: 設定をAsyncStorageに永続化する（キー: 'settings'）
// 個人データはAsyncStorageに入れない。設定値のみOK（仕様書: DB設計方針）

type SettingRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  comingSoon?: boolean;
};

function SettingRow({ label, description, value, onChange, disabled, comingSoon }: SettingRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.backgroundElement }]}>
      <View style={styles.rowLabel}>
        <ThemedText type="small">{label}</ThemedText>
        {description && (
          <ThemedText type="small" themeColor="textSecondary">{description}</ThemedText>
        )}
        {comingSoon && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.comingSoon}>
            実装予定
          </ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: '#34C759' }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const update = (key: keyof Settings) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: AsyncStorage.setItem('settings', JSON.stringify({...settings, [key]: value}))
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* 自動日記 */}
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            自動日記
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.section}>
            <SettingRow
              label="自動まとめ"
              description={`毎日 ${settings.autoGenerateTime} に通知`}
              value={settings.autoGenerateEnabled}
              onChange={update('autoGenerateEnabled')}
            />
            {/* TODO: 時刻ピッカーを追加する */}
          </ThemedView>

          {/* データソース（実装予定） */}
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            データソース
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.section}>
            <SettingRow
              label="LINE連携"
              description="トーク履歴を日記に含める"
              value={settings.lineEnabled}
              onChange={update('lineEnabled')}
              disabled
              comingSoon
            />
            <SettingRow
              label="ブラウザ履歴"
              description="閲覧サイトを日記に含める"
              value={settings.browserHistoryEnabled}
              onChange={update('browserHistoryEnabled')}
              disabled
              comingSoon
            />
          </ThemedView>

          {/* AI機能（実装予定） */}
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
            AI機能
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.section}>
            <SettingRow
              label="AI提案"
              description="行動の先読み提案を受け取る"
              value={settings.aiSuggestEnabled}
              onChange={update('aiSuggestEnabled')}
              disabled
              comingSoon
            />
          </ThemedView>

          {/* バージョン情報 */}
          <ThemedText type="small" themeColor="textSecondary" style={styles.version}>
            v0.1.0 (Phase 1A - フロー検証)
          </ThemedText>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.two },
  sectionTitle: {
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { flex: 1, gap: 2 },
  comingSoon: {
    fontSize: 10,
    color: '#FF9500',
  },
  version: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
});
