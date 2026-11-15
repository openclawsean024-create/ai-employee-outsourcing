/**
 * 品牌設定（單一來源）。
 *
 * 對外品牌名稱尚未由 Sean 確認（PRD/SPEC.md §13-1）。
 * 目前使用 GOAL.md 的產品暫定名；確認後只需修改這個檔案，
 * 網站標題、導覽列、頁尾與 metadata 都會一起更新。
 */
export const BRAND = {
  /** 暫定品牌名（待 Sean 確認） */
  name: 'AI 員工外包與導入服務',
  /** false = 暫定名，尚未確認 */
  nameConfirmed: false,
  tagline: '把 AI 自動化從簡報推進到實際上線',
  description:
    '以顧問／內訓與專案建置兩種方式，協助台灣中小企業把 AI 自動化接進既有流程並實際上線。',
  audience: '想導入 AI 自動化的台灣中小企業',
} as const;

/** M1 網站狀態說明：示範情境＋測試模式，尚未對外正式接案。 */
export const SITE_STAGE_NOTICE =
  '本網站為測試版：案例皆為示範情境，預約表單為測試模式（資料不會送出或儲存）。';
