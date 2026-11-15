/**
 * 導入方法論：三大板塊＋四個空格原則（M1 AC-007）。
 * 搬自 ai-landing-specialist@8e0625e:index.html「三個板塊」區塊；
 * 原文中的失敗率說法沒有出處，沒有搬入。
 */
import type { ContentSource } from './types';

export const METHODOLOGY_SOURCE: ContentSource = 'ai-landing-specialist@8e0625e';

export interface Pillar {
  id: string;
  title: string;
  description: string;
  examples: string[];
}

export const PILLARS: Pillar[] = [
  {
    id: 'acquire',
    title: '獲取更多客戶',
    description: '用 AI 自動化潛客開發、外聯訊息、內容生成與社群經營。',
    examples: ['SEO 文案與社群貼文', '潛客名單過濾與個人化開發信', '廣告素材 A/B 測試'],
  },
  {
    id: 'grow',
    title: '提升單個客戶價值',
    description: '讓每個客戶買更多、留更久、更願意推薦。',
    examples: ['AI 客服第一線（常見問題、退貨、預約）', '個人化商品或課程推薦', '智能分眾與再行銷'],
  },
  {
    id: 'save',
    title: '降低成本與時間',
    description: '把重複的人工工作交給 AI，讓人去做 AI 做不來的事。',
    examples: ['會議錄音 → 摘要 → 待辦派工', '合約與發票 OCR、自動登帳', '客戶回饋自動分類'],
  },
];

export interface Blank {
  order: number;
  label: string;
  description: string;
}

export const FOUR_BLANKS_TITLE = '四個空格原則';

export const FOUR_BLANKS_INTRO = '每一個工作流上線前，先回答這四個空格。';

export const FOUR_BLANKS: Blank[] = [
  { order: 1, label: '對應板塊', description: '這個工作流屬於三大板塊中的哪一個。' },
  { order: 2, label: '具體 KPI', description: '用哪一個可量測的指標判斷它有沒有用。' },
  { order: 3, label: '今日基準', description: '導入前，這個指標現在的數值。' },
  { order: 4, label: '60 天目標', description: '上線 60 天後，希望這個指標達到的數值。' },
];
