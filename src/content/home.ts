/**
 * 首頁文案（M1 AC-007、AC-010）。
 * Hero 與 3 個痛點場景搬自 ai-landing-specialist@8e0625e:index.html。
 * 原文中的數字（每天幾封信、幾天後沒人用、幾頁報告、成果天數）都只是情境描述，
 * 這裡改寫為不帶數字的示意，不當作統計。
 */
import type { ContentSource } from './types';

export const HOME_SOURCE: ContentSource = 'ai-landing-specialist@8e0625e';

export const HERO = {
  eyebrow: '為台灣中小企業導入 AI 自動化',
  titleLead: '把 AI 從簡報',
  titleEmphasis: '推進到真正上線',
  lede: '從 LINE、Email、試算表與 CRM 等既有流程開始，以顧問／內訓與專案建置兩種方式，讓 AI 真的在你的業務裡運作，而不是停在簡報。',
  primaryCta: { label: '預約 30 分鐘免費診斷', href: '/contact' },
  secondaryCta: { label: '看服務方案', href: '/services' },
} as const;

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  /** true = 情境示意，非統計數據 */
  illustrative: true;
}

export const PAIN_POINTS_HEADING = '這些場景，是不是很熟悉？';

export const PAIN_POINTS_INTRO =
  '對多數中小企業來說，問題不是「AI 強不強」，而是「怎麼讓它在我們公司真的運作起來」。';

export const PAIN_POINTS_NOTE = '以下為常見情境示意，並非統計數據。';

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 'unused-tools',
    title: '買了 AI 工具的帳號，過一陣子卻沒人用',
    description:
      '同仁不會寫提示詞、不敢把客戶資料丟進去，也不確定能用在哪些場景。帳單繼續，流程沒有改變。',
    illustrative: true,
  },
  {
    id: 'repetitive-support',
    title: '客服每天重複回覆一樣的問題',
    description:
      '常見問題、退貨查詢、預約提醒，都是可以自動化的流程；但沒有人知道從哪裡開始、怎麼做才不踩雷。',
    illustrative: true,
  },
  {
    id: 'report-on-shelf',
    title: '顧問報告停在簡報，沒有人做到上線',
    description:
      '簡報不會自己運作。真正的價值是把工具接上 CRM、LINE 與試算表，讓同仁隔天就能用。',
    illustrative: true,
  },
];

export const CLOSING_CTA = {
  title: '30 分鐘免費診斷',
  body: '不賣東西、不推長期合約。只談：你的業務現在最值得導入 AI 的一兩個地方，以及建議從哪裡開始。',
  primaryCta: { label: '預約諮詢', href: '/contact' },
} as const;
