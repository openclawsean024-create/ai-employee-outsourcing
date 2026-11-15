/**
 * 服務方案資料（單一來源，M1 AC-001、AC-007）。
 *
 * 搬自：
 * - ai-landing-specialist@8e0625e:index.html 的四階服務天梯
 *   （教育與諮詢、付費業務審計、專項開發專案、月度維護）
 * - claude-code-training@48e84a7:src/app/pricing/page.tsx 的顧問服務與企業包班描述
 *
 * 原始頁面的價格數字、「最多人選」類標籤與保固承諾皆未經確認，沒有搬入；
 * 價格一律使用 pricing.ts 的 QUOTE_PRICE。
 */
import { QUOTE_PRICE, type Price } from './pricing';
import { CORPORATE_PACKAGE } from './training';
import type { ContentSource, Timeline } from './types';

export type ServiceCategoryId = 'consulting-training' | 'project';

export const SERVICE_CATEGORIES: Array<{
  id: ServiceCategoryId;
  label: string;
  summary: string;
}> = [
  {
    id: 'consulting-training',
    label: '顧問／內訓',
    summary: '先釐清 AI 該用在哪個流程，並讓團隊學會自己使用。',
  },
  {
    id: 'project',
    label: '專案建置',
    summary: '把單一流程的自動化做到實際上線，並視需要持續維護。',
  },
];

export interface ServicePlan {
  id: string;
  category: ServiceCategoryId;
  name: string;
  summary: string;
  /** 適合對象 */
  audience: string;
  /** 交付內容 */
  deliverables: string[];
  /** 時程 */
  timeline: Timeline;
  /** 報價方式：計價基礎 */
  pricingBasis: string;
  /** 報價方式：價格（未定價一律 quote） */
  price: Price;
  /** available = 提供中；candidate = 候選方案，是否提供待 Sean 決定 */
  availability: 'available' | 'candidate';
  source: ContentSource;
  /** 服務天梯階段（1–4），非天梯項目為 null */
  ladderStep: 1 | 2 | 3 | 4 | null;
  /** 延伸頁面 */
  href?: string;
}

export const CANDIDATE_LABEL = '候選方案，是否提供待確認';

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'advisory-session',
    category: 'consulting-training',
    name: '教育與諮詢',
    summary: '用一兩個小時盤點團隊可以導入 AI 的場景，作為低風險的第一步。',
    audience: '剛開始評估 AI、還不確定能用在哪些流程的團隊',
    deliverables: [
      '1–2 小時的團隊 AI 應用場景盤點',
      '提示詞（prompt）模板、工具清單與避坑指南',
      '不賣工具、不推長期合約',
    ],
    timeline: { text: '每次 1–2 小時', confirmed: false },
    pricingBasis: '按時數',
    price: QUOTE_PRICE,
    availability: 'available',
    source: 'ai-landing-specialist@8e0625e',
    ladderStep: 1,
  },
  {
    id: 'business-audit',
    category: 'consulting-training',
    name: '付費業務審計',
    summary: '深入訪談與流程盤點，找出最值得先導入 AI 的環節。',
    audience: '想知道該從哪個流程開始、需要書面依據做決策的經營者與主管',
    deliverables: [
      '深度訪談 3–5 位關鍵同仁',
      '盤點各流程環節可以節省的時間與成本',
      '排出優先導入順序與預估回收期',
      '書面審計報告',
    ],
    timeline: { text: '7–14 天', confirmed: false },
    pricingBasis: '按案',
    price: QUOTE_PRICE,
    availability: 'available',
    source: 'ai-landing-specialist@8e0625e',
    ladderStep: 2,
  },
  {
    id: 'advisory-retainer',
    category: 'consulting-training',
    name: '顧問服務',
    summary: '以固定顧問會議陪同團隊推進 AI 導入。',
    audience: '已經開始導入、需要固定顧問陪同推進的團隊',
    deliverables: ['每週顧問會議', '客製化 Claude Code 開發', 'AI 成熟度報告'],
    timeline: { text: '按月進行，期間於諮詢時確認', confirmed: false },
    pricingBasis: '按月',
    price: QUOTE_PRICE,
    availability: 'available',
    source: 'claude-code-training@48e84a7',
    ladderStep: null,
  },
  {
    id: 'corporate-training',
    category: 'consulting-training',
    name: '企業內訓（包班）',
    summary: CORPORATE_PACKAGE.summary,
    audience: CORPORATE_PACKAGE.audience,
    deliverables: CORPORATE_PACKAGE.features,
    timeline: CORPORATE_PACKAGE.timeline,
    pricingBasis: CORPORATE_PACKAGE.pricingBasis,
    price: CORPORATE_PACKAGE.price,
    availability: 'available',
    source: 'claude-code-training@48e84a7',
    ladderStep: null,
    href: '/training',
  },
  {
    id: 'automation-project',
    category: 'project',
    name: '專項開發專案',
    summary: '針對單一流程交付可實際運作的 AI 自動化。',
    audience: '已經知道要先自動化哪一個流程的團隊',
    deliverables: [
      '單一流程自動化，接上既有系統（LINE、Email、網站、試算表、CRM 等）',
      '範例：客服常見問題自動回覆',
      '範例：會議錄音 → 摘要 → 待辦派工',
      '上線後教團隊監督、接手與調整提示詞',
    ],
    timeline: { text: '30–60 天', confirmed: false },
    pricingBasis: '按專案',
    price: QUOTE_PRICE,
    availability: 'available',
    source: 'ai-landing-specialist@8e0625e',
    ladderStep: 3,
  },
  {
    id: 'monthly-maintenance',
    category: 'project',
    name: '月度維護',
    summary: '專案上線後的監控、調整與每月回報。',
    audience: '流程已經上線、需要有人持續監控與調整的團隊',
    deliverables: ['系統監控與例外處理', '每月迭代新的提示詞與流程', '每月成效報告'],
    timeline: { text: '按月持續', confirmed: false },
    pricingBasis: '按月',
    price: QUOTE_PRICE,
    availability: 'candidate',
    source: 'ai-landing-specialist@8e0625e',
    ladderStep: 4,
  },
];

/** 四階服務天梯（依階段排序）。 */
export const SERVICE_LADDER: ServicePlan[] = SERVICE_PLANS.filter(
  (plan) => plan.ladderStep !== null,
).sort((a, b) => (a.ladderStep ?? 0) - (b.ladderStep ?? 0));

export function plansByCategory(category: ServiceCategoryId): ServicePlan[] {
  return SERVICE_PLANS.filter((plan) => plan.category === category);
}
