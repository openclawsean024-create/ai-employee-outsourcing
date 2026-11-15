/**
 * 報價方式（單一來源，M1 AC-002）。
 *
 * 所有價格欄位都使用同一個 Price 型別、幣別一律新台幣（TWD，畫面顯示 NT 元符號）。
 * Sean 尚未提供實際數字的方案一律用 kind: 'quote'，畫面顯示「諮詢後報價」。
 * 舊 repo 中互相矛盾的價格（外幣標價、個人訂閱月費等）不沿用，見 PRD/SPEC.md §3。
 */

export type PriceUnit = 'hour' | 'session' | 'project' | 'month' | 'class';

export type Price =
  | { kind: 'fixed'; currency: 'TWD'; amount: number; unit: PriceUnit }
  | { kind: 'range'; currency: 'TWD'; min: number; max: number; unit: PriceUnit }
  | { kind: 'quote'; currency: 'TWD' };

export const PRICE_KINDS = ['fixed', 'range', 'quote'] as const;

export const QUOTE_LABEL = '諮詢後報價';

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  hour: '小時',
  session: '場',
  project: '案',
  month: '月',
  class: '堂',
};

/** 尚未定價的方案統一使用這個值。 */
export const QUOTE_PRICE: Price = { kind: 'quote', currency: 'TWD' };

const CURRENCY_PREFIX = 'NT$';

function formatAmount(amount: number): string {
  return `${CURRENCY_PREFIX} ${amount.toLocaleString('zh-TW')}`;
}

/** 把 Price 轉成畫面文字；元件不得自行寫死價格字串。 */
export function formatPrice(price: Price): string {
  switch (price.kind) {
    case 'fixed':
      return `${formatAmount(price.amount)}／${PRICE_UNIT_LABELS[price.unit]}`;
    case 'range':
      return `${formatAmount(price.min)} – ${formatAmount(price.max)}／${PRICE_UNIT_LABELS[price.unit]}`;
    case 'quote':
      return QUOTE_LABEL;
  }
}

export function isValidPrice(price: Price): boolean {
  if (price.currency !== 'TWD') return false;
  switch (price.kind) {
    case 'fixed':
      return Number.isFinite(price.amount) && price.amount >= 0 && price.unit in PRICE_UNIT_LABELS;
    case 'range':
      return (
        Number.isFinite(price.min) &&
        Number.isFinite(price.max) &&
        price.min >= 0 &&
        price.max >= price.min &&
        price.unit in PRICE_UNIT_LABELS
      );
    case 'quote':
      return true;
    default:
      return false;
  }
}

/** 頁面上的「報價方式說明」。 */
export const PRICING_POLICY = {
  title: '報價方式',
  summary: `所有方案目前一律「${QUOTE_LABEL}」，並以新台幣（NT$）報價。`,
  points: [
    '先進行免費診斷，了解業務流程、痛點與現有工具，再依範圍提供書面報價。',
    '計價基礎依方案而定：顧問與諮詢按時數或按月、內訓按場次或包班、專案建置按專案、維護按月。',
    '報價一律以新台幣（NT$）計價，不使用外幣標價。',
    '實際金額由 Sean 於諮詢後提供；本網站目前不顯示任何未經確認的價格數字。',
  ],
  pendingNote: '各方案實際價格或區間待 Sean 確認後，會更新在同一份資料檔（src/content）中。',
} as const;
