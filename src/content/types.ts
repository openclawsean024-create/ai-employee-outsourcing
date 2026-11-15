/** 內容資料檔共用型別。 */

/**
 * 時程描述。confirmed: false 表示數字搬自舊 repo 的規劃值，
 * 尚未經 Sean 確認，畫面需標示「規劃值，待確認」。
 */
export interface Timeline {
  text: string;
  confirmed: boolean;
}

/** 內容搬遷來源（PRD/SPEC.md §12 合併清單）。 */
export type ContentSource =
  | 'ai-landing-specialist@8e0625e'
  | 'claude-code-training@48e84a7'
  | 'ai-employee-outsourcing';

export const TIMELINE_PENDING_LABEL = '規劃值，待確認';
