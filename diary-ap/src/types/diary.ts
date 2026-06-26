// ─── データソース種別 ───────────────────────────────────────────────────────────
export type DataSource =
  | 'photo'        // カメラロール写真
  | 'camera'       // アプリ内撮影
  | 'calendar'     // カレンダー予定
  | 'health'       // HealthKit（歩数・運動等）
  | 'location'     // 位置情報
  | 'memo'         // 手動メモ
  | 'line_mock'    // LINEモックデータ（将来: 実データ）
  | 'browser_mock' // ブラウザ履歴モックデータ（将来: 実データ）
  | 'external_camera'; // 外部カメラ（WiFi接続、将来実装）

// ─── 確定状態 ────────────────────────────────────────────────────────────────
export type ConfirmStatus = 'unconfirmed' | 'confirmed' | 'rejected';

// ─── コンテンツ種別（事実 / 本人入力 / AI推論を分離） ──────────────────────
export type ContentType = 'fact' | 'user_input' | 'ai_inference';

// ─── 機密度 ──────────────────────────────────────────────────────────────────
export type SecretLevel = 'public' | 'personal' | 'confidential' | 'no_external';

// ─── 信頼度 ──────────────────────────────────────────────────────────────────
export type ConfidenceLevel = 'high' | 'medium' | 'low';

// ─── 出来事（イベント）───────────────────────────────────────────────────────
export interface DiaryEvent {
  id: string;
  diaryId: string;
  time: string;            // ISO datetime
  description: string;
  source: DataSource;
  contentType: ContentType;
  confidence: ConfidenceLevel;
  confirmStatus: ConfirmStatus;
  secretLevel: SecretLevel;
  aiReasoning?: string;    // AI推論の根拠（ai_inferenceの場合のみ）
}

// ─── 修正履歴（将来のPersonal Context形成に使用） ───────────────────────────
export interface EditHistory {
  id: string;
  diaryId: string;
  beforeText: string;
  afterText: string;
  editedAt: string;
}

// ─── 日記 ────────────────────────────────────────────────────────────────────
export interface Diary {
  id: string;
  date: string;            // YYYY-MM-DD
  draftText: string;       // AI生成ドラフト（または Rule-based）
  confirmedText: string;   // 本人確認・編集後テキスト
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  events: DiaryEvent[];
  editHistory: EditHistory[];
}

// ─── 設定 ────────────────────────────────────────────────────────────────────
export interface Settings {
  // 自動生成
  autoGenerateEnabled: boolean;
  autoGenerateTime: string; // "HH:MM" 形式

  // 将来実装予定
  lineEnabled: boolean;          // LINE連携
  browserHistoryEnabled: boolean; // ブラウザ履歴収集
  aiSuggestEnabled: boolean;     // AI提案
}

export const DEFAULT_SETTINGS: Settings = {
  autoGenerateEnabled: false,
  autoGenerateTime: '22:00',
  lineEnabled: false,
  browserHistoryEnabled: false,
  aiSuggestEnabled: false,
};
