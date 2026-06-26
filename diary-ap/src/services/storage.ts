// ─── Settings の永続化サービス ───────────────────────────────────────────────
//
// TODO: インストールが必要
//   npx expo install @react-native-async-storage/async-storage
//
// インストール後にこのファイルのコメントアウトを外すだけで動く。
// 個人データ（日記本文など）はここに保存しない。UIの設定値のみ。

import { DEFAULT_SETTINGS, Settings } from '@/types/diary';

const SETTINGS_KEY = 'settings_v1';

// ── AsyncStorage が未インストールのため、メモリキャッシュで代替 ──────────────
let _cache: Settings = { ...DEFAULT_SETTINGS };

export const StorageService = {
  async loadSettings(): Promise<Settings> {
    // TODO: AsyncStorage導入後に差し替える
    // const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    // return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    return _cache;
  },

  async saveSettings(settings: Settings): Promise<void> {
    // TODO: AsyncStorage導入後に差し替える
    // await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    _cache = settings;
  },

  async clearSettings(): Promise<void> {
    // TODO: AsyncStorage導入後に差し替える
    // await AsyncStorage.removeItem(SETTINGS_KEY);
    _cache = { ...DEFAULT_SETTINGS };
  },
};
