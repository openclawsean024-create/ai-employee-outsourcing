/**
 * 常見問題（M1 AC-007）。
 * 搬自 ai-landing-specialist@8e0625e:index.html 的 7 題 FAQ。
 * 依 PRD/SPEC.md §12.1：刪除沒有依據的產業實績說法、引用語與未確認的費用數字；
 * 未確認的時程數字也改為「諮詢後提供」。
 */
import { QUOTE_LABEL } from './pricing';
import type { ContentSource } from './types';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_SOURCE: ContentSource = 'ai-landing-specialist@8e0625e';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'need-coding',
    question: '需要懂寫程式嗎？',
    answer: '不需要。你只要能清楚描述業務流程，流程設計、工具串接與上線由我們負責。',
  },
  {
    id: 'cost',
    question: '導入 AI 大概要花多少錢？',
    answer: `依範圍而定。目前所有方案一律「${QUOTE_LABEL}」，並以新台幣報價；免費診斷後會依你的流程範圍提供書面報價。`,
  },
  {
    id: 'time-to-result',
    question: '導入後多久能看到效果？',
    answer:
      '依流程複雜度而定。每個專案開始前會先定義 KPI、今日基準與 60 天目標，到期一起驗收；實際時程於診斷後提供。',
  },
  {
    id: 'tools',
    question: '會用哪些 AI 工具？',
    answer:
      '依場景選擇最適合的工具，通常是 Claude、ChatGPT 或 Gemini 的 API，搭配 Make、Zapier 或 n8n 接上你現有的系統（CRM、LINE、Google Sheets、Notion、Slack 等）。不綁特定廠商。',
  },
  {
    id: 'data-safety',
    question: '客戶資料安全嗎？',
    answer:
      '遵守資料最小化原則：能在本地處理的不上雲，能用企業版的不用個人版。每個專案開始前會簽訂保密協議（NDA）與資料處理協議。',
  },
  {
    id: 'industries',
    question: '做過哪些產業？',
    answer:
      '目前網站上的案例皆為「示範情境」，不是真實客戶案例。真實案例會在取得客戶同意後才公開。',
  },
  {
    id: 'not-sure',
    question: '不確定適不適合，怎麼辦？',
    answer:
      '先預約 30 分鐘免費診斷。我們會評估你的業務有沒有 AI 導入空間，並建議從哪裡開始。沒有成交壓力，也不推長期合約。',
  },
];
