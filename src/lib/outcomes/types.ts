// 「成果工作台」型別（v2 prototype 對齊）
// - 三種任務包：客服 FAQ、訂單異常清單、社群內容週報
// - 狀態：擷取 → 草稿 → 待人工核准 → 已交付
// - 對外內容需人工核准後才能複製/下載
// - 純前端示範；不送後端、不送出對外、不做自動發送

export type OutcomePackId = 'cs-faq' | 'order-anomalies' | 'social-weekly';

export type OutcomeState =
  | 'captured' // 擷取：來源資料剛進來
  | 'draft' // 草稿：AI 摘要/草稿完成
  | 'awaiting-approval' // 待人工核准
  | 'delivered'; // 已交付（純前端示範）

export type OutcomeChannel = 'faq-page' | 'support-team' | 'ops-team' | 'social-ig' | 'social-fb' | 'social-threads';

export interface OutcomeEvidence {
  id: string;
  sourceLabel: string; // 例如「客服信箱 9/16–9/22」
  sourceType: 'email' | 'order-system' | 'social' | 'csv' | 'note';
  count: number; // 來源資料筆數
  capturedAt: string; // ISO；剛擷取進來時填
  snippet?: string; // 證據片段（截斷展示）
}

// v3 prototype 對齊：每則「草稿條目」可附一筆來源引用編號（[source:N]）
// 供「引用 → 來源」雙向跳轉之用。footer 條列與 prototype 同步。
export interface OutcomeEntry {
  title: string;
  text: string; // 可編輯草稿內容
  source: number; // 對應 sources 陣列的 1-based 索引
  foot: string; // 條目下方補充說明
}

export interface OutcomeSource {
  name: string;
  type: string; // 例：「CSV」「TXT」「Email」「客服信箱」
  details: string; // 範圍 / 筆數 / 期間
  quote?: string; // 原文片段摘要
}

// 介面唯一碼；v3 prototype 用於「成果 ID」與「核准摘要」
export interface OutcomeIdentity {
  id: string; // 例：ZZ-039-01
  kind: string; // 例：客服 FAQ
}

export interface OutcomeApproval {
  by: 'human-demo' | string;
  at: string; // ISO
  acknowledgedCheck: boolean; // 知道這只是前端示範
  contentCheck: boolean; // 已核對內容可對外
}

export interface OutcomeArtifact {
  id: string;
  packId: OutcomePackId;
  state: OutcomeState;
  title: string;
  weekLabel: string; // 例如「2026 第 39 週」
  weekRange: string; // 例如「9/21 – 9/27」
  createdAt: string;
  generatedAt: string;
  modelLabel: string; // 例如「Astra 高階」／「Mock-LLM」
  estimatedCostNtd: number; // 範例估算；UI 需明確標示為 sample
  costLimitNtd: number; // 估算上限（顯示用）
  sourceSummary: string; // 來源摘要（純前端 mock）
  evidence: OutcomeEvidence[]; // 完整證據列表（向後相容）
  // v3 prototype 對齊欄位
  entries: OutcomeEntry[]; // 編輯草稿條目
  sources: OutcomeSource[]; // 來源縮要（具名 + 筆數 + 摘要）
  version: number; // 草稿版本；每次編輯後 in-memory 遞增
  subtitle: string; // 卡片副標（例：「42 則對話 · 2 個主要問題」）
  countLabel: string; // 草稿數量說明（例：「2 則回覆草稿」）
  sourceCountLabel: string; // 來源數量說明（例：「2 份來源」）
  kicker: string; // 草稿標題小語
  description: string; // 摘要說明（編輯後會更新）
  notice: string; // 底部提醒文字
  draftMarkdown: string; // 編輯器草稿內容（純前端示範）
  approval: OutcomeApproval | null; // 經核准流程才有
  channels: OutcomeChannel[]; // 預定可發送通路（僅顯示，不送出）
  isMock: true; // 永遠 true：純前端示範，UI 必須顯示「範例」徽章
}
