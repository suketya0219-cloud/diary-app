// TODO: expo-sqlite + SQLCipher を導入後に実際のDB接続を実装する
// 現時点はスキーマ定義のみ。データはReact Stateで管理（in-memory）。
//
// 導入予定パッケージ:
//   npx expo install expo-sqlite
//   暗号化: SQLCipher (expo-sqlite/crypto) + expo-secure-store
//
// 仕様書参照: セキュリティ・同意・責任境界 > DB設計
//   - AsyncStorageには個人データを入れない
//   - 構造データ: SQLite + SQLCipher
//   - 暗号鍵: SecureStore

// ─── DDL定義（参照用） ──────────────────────────────────────────────────────

export const CREATE_TABLE_DIARIES = `
  CREATE TABLE IF NOT EXISTS diaries (
    id            TEXT PRIMARY KEY,
    date          TEXT NOT NULL UNIQUE,   -- YYYY-MM-DD
    draft_text    TEXT NOT NULL DEFAULT '',
    confirmed_text TEXT NOT NULL DEFAULT '',
    is_confirmed  INTEGER NOT NULL DEFAULT 0,  -- 0: false, 1: true
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL
  );
`;

export const CREATE_TABLE_DIARY_EVENTS = `
  CREATE TABLE IF NOT EXISTS diary_events (
    id             TEXT PRIMARY KEY,
    diary_id       TEXT NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    time           TEXT NOT NULL,          -- ISO datetime
    description    TEXT NOT NULL,
    source         TEXT NOT NULL,          -- DataSource
    content_type   TEXT NOT NULL,          -- fact | user_input | ai_inference
    confidence     TEXT NOT NULL DEFAULT 'medium',
    confirm_status TEXT NOT NULL DEFAULT 'unconfirmed',
    secret_level   TEXT NOT NULL DEFAULT 'personal',
    ai_reasoning   TEXT                    -- AI推論の場合のみ
  );
`;

export const CREATE_TABLE_EDIT_HISTORY = `
  CREATE TABLE IF NOT EXISTS edit_history (
    id          TEXT PRIMARY KEY,
    diary_id    TEXT NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    before_text TEXT NOT NULL,
    after_text  TEXT NOT NULL,
    edited_at   TEXT NOT NULL
  );
`;

// UI設定のみAsyncStorageに保存（個人データは入れない）
// キー: 'settings'
// 値: JSON.stringify(Settings)
export const ASYNC_STORAGE_KEYS = {
  SETTINGS: 'settings',
} as const;
