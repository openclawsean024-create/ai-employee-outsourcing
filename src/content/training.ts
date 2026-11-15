/**
 * 內訓課程資料（M1 AC-006、AC-007）。
 *
 * 搬自 claude-code-training@48e84a7：
 * - 課程程度分類與課程卡欄位：prisma/schema.prisma 的 Course、src/app/courses/page.tsx
 * - 企業包班形式：src/app/pricing/page.tsx 的 Enterprise 方案
 * 不搬：Prisma、登入、報名、進度、證書 API、個人訂閱方案與任何價格數字。
 *
 * 課程實際課綱待 Sean 或外部教材提供，這裡不撰寫課綱。
 */
import { QUOTE_PRICE, type Price } from './pricing';
import type { ContentSource, Timeline } from './types';

export type CourseLevel = 'basic' | 'advanced' | 'enterprise';

export const COURSE_LEVELS: Array<{
  id: CourseLevel;
  label: string;
  summary: string;
  audience: string;
}> = [
  {
    id: 'basic',
    label: '基礎',
    summary: '從基礎提示詞（prompt）開始，認識 Claude Code 等 AI 工具在日常工作的用法。',
    audience: '第一次在工作中使用 AI 工具的同仁',
  },
  {
    id: 'advanced',
    label: '進階',
    summary: '在基礎之上的進階模組，練習把 AI 工具接進自己的實際工作流程。',
    audience: '已有 AI 工具使用經驗、想用在實際流程的同仁',
  },
  {
    id: 'enterprise',
    label: '企業',
    summary: '依公司流程與導入目標客製的企業包班課程。',
    audience: '要讓整個團隊或部門一起導入 AI 的企業',
  },
];

/** 課程卡欄位（對應原 Course 資料模型：標題、說明、程度、時長、價格）。 */
export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  /** 分鐘；null = 時長待確認 */
  durationMinutes: number | null;
  price: Price;
  /** pending = 課綱待 Sean 或外部教材提供 */
  syllabusStatus: 'pending' | 'ready';
  source: ContentSource;
}

export const SYLLABUS_PENDING_LABEL = '課綱整理中，待 Sean 或外部教材提供';

export const COURSES: Course[] = [
  {
    id: 'basic-course',
    title: '基礎課程',
    description: '基礎提示詞與 AI 工具入門。詳細課綱整理中。',
    level: 'basic',
    durationMinutes: null,
    price: QUOTE_PRICE,
    syllabusStatus: 'pending',
    source: 'claude-code-training@48e84a7',
  },
  {
    id: 'advanced-course',
    title: '進階課程',
    description: '進階模組，把 AI 工具用進實際工作流程。詳細課綱整理中。',
    level: 'advanced',
    durationMinutes: null,
    price: QUOTE_PRICE,
    syllabusStatus: 'pending',
    source: 'claude-code-training@48e84a7',
  },
  {
    id: 'enterprise-course',
    title: '企業包班課程',
    description: '依公司需求客製的包班課程，內容於諮詢後規劃。',
    level: 'enterprise',
    durationMinutes: 240,
    price: QUOTE_PRICE,
    syllabusStatus: 'pending',
    source: 'claude-code-training@48e84a7',
  },
];

/** 企業包班形式。 */
export const CORPORATE_PACKAGE: {
  title: string;
  summary: string;
  audience: string;
  features: string[];
  timeline: Timeline;
  pricingBasis: string;
  price: Price;
  source: ContentSource;
} = {
  title: '企業包班',
  summary: '為單一企業開設的客製化內訓課程。',
  audience: '需要員工 AI 內訓的企業人資或訓練窗口',
  features: ['客製化 4 小時課程', '每班 10–50 人', '實體＋線上', '結業證書', '課後問答（Q&A）'],
  timeline: { text: '每堂 4 小時', confirmed: false },
  pricingBasis: '按場次或包班',
  price: QUOTE_PRICE,
  source: 'claude-code-training@48e84a7',
};

/** 預約內訓入口：連到 /contact 並預選需求類型「內訓」。 */
export const TRAINING_CTA = {
  label: '預約內訓諮詢',
  href: '/contact?type=training',
} as const;

/**
 * 外部教材占位區塊。
 * 教材為 Sean 的私人 repo，內容、授權與公開範圍皆待提供；
 * M1 不讀取、不複製、不推測其課綱。
 */
export const EXTERNAL_MATERIAL_PLACEHOLDER = {
  title: '企業 AI 導入教材整合中',
  body: '企業 AI 導入內訓教材將與本服務整合為同一品牌。教材內容、授權與公開範圍待 Sean 提供，整合完成前這裡不列出課綱。',
  reference: 'sean0407/enterprise-ai-adoption-course',
  referenceLabel: '待整合的外部教材（尚未公開）',
  status: 'pending',
} as const;
