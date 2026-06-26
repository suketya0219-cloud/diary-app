import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

// ─── AIと相談画面（実装予定）────────────────────────────────────────────────
//
// TODO: Phase 4（Personal Context Provider）で実装する
// 機能イメージ:
//   - 蓄積したPersonal Contextを参照してAIと対話
//   - 目的別Context Packを生成してAIへ最小提供
//   - 利用目的・提供範囲をユーザーが確認できるUI
//
// AI統合方針:
//   - Local Model Provider（Apple Foundation Models）優先
//   - フォールバック: Cloud Model Provider / Rule-based
//   - 仕様書参照: AIモデル抽象化方針 / Personal Context Provider

export default function AiChatScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.center}>

          <ThemedText style={styles.icon}>🤖</ThemedText>

          <ThemedText type="subtitle" style={styles.title}>
            AIと相談
          </ThemedText>

          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            あなたの個人コンテキストをもとに、AIがサポートします。
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.comingSoonCard}>
            <ThemedText type="smallBold">実装予定</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Phase 4（Personal Context Provider）で利用可能になります。
            </ThemedText>
          </ThemedView>

          {/* TODO: 実装内容
            1. チャット入力UI
            2. Personal Contextからの関連情報抽出
            3. Context Packの生成と提供範囲の確認UI
            4. AIモデル（Local/Cloud/Rule-based）への接続
            5. 提供履歴の監査ログ保存
          */}

        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  icon: { fontSize: 64 },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
  comingSoonCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
    width: '100%',
  },
});
