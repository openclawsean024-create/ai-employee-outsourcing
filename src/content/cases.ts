/**
 * 案例資料（M1 AC-003）。
 *
 * M1 沒有任何真實客戶案例：下面每一筆都是 kind: 'demo' 的「示範情境」，
 * 用來說明服務會怎麼進行。情境中的公司是虛構的，沒有客戶名稱，也沒有任何成效數字。
 *
 * 要新增真實案例（kind: 'real'）時，必須由 Sean 確認已取得客戶同意
 * （consentConfirmedBySean: true）並填寫來源；缺少任一項，validateCases 與測試都會失敗。
 */

export interface CaseBlanks {
  /** 對應板塊 */
  pillar: string;
  /** 具體 KPI */
  kpi: string;
  /** 今日基準 */
  baseline: string;
  /** 60 天目標 */
  target: string;
}

interface CaseBase {
  id: string;
  title: string;
  /** 情境背景 */
  setting: string;
  /** 遇到的問題 */
  challenge: string;
  /** 進行方式 */
  approach: string[];
  /** 交付內容 */
  deliverables: string[];
  /** 對應 services.ts 的方案 id */
  relatedServiceId: string;
  /** 四個空格原則的填法示範 */
  blanks: CaseBlanks;
}

export interface DemoCase extends CaseBase {
  kind: 'demo';
}

export interface RealCase extends CaseBase {
  kind: 'real';
  /** Sean 已確認取得客戶同意公開 */
  consentConfirmedBySean: true;
  /** 案例來源（例如同意書日期與保存位置的代稱，不放個資） */
  source: string;
}

export type CaseStudy = DemoCase | RealCase;

export const DEMO_BADGE_LABEL = '示範情境';
export const DEMO_DISCLAIMER = '非真實客戶案例';
export const REAL_BADGE_LABEL = '客戶案例';
export const CASES_EMPTY_LABEL = '案例整理中';

export const CASES_INTRO =
  '以下皆為示範情境，用來說明服務實際會怎麼進行。情境中的公司是虛構的，不是實際客戶，也不代表任何成效保證。真實案例會在取得客戶同意後才公開。';

const PENDING_BASELINE = '導入時實際量測後填入';
const PENDING_TARGET = '與客戶共同設定';

export const CASES: CaseStudy[] = [
  {
    kind: 'demo',
    id: 'demo-support-faq',
    title: '客服常見問題自動回覆（LINE／Email）',
    setting: '一家線上零售商家（虛構情境）',
    challenge: '客服同仁每天重複回覆相同的常見問題、退貨查詢與預約提醒，沒有時間處理比較複雜的個案。',
    approach: [
      '盤點常見問題與現有的回覆內容',
      '設計自動回覆流程，並定義轉交真人處理的條件',
      '接上 LINE 與 Email，先在小範圍試行',
      '教客服同仁監督回覆品質與調整提示詞',
    ],
    deliverables: ['常見問題自動回覆流程', '轉交真人的規則', '操作與維護說明'],
    relatedServiceId: 'automation-project',
    blanks: {
      pillar: '提升單個客戶價值',
      kpi: '常見問題的首次回覆時間',
      baseline: PENDING_BASELINE,
      target: PENDING_TARGET,
    },
  },
  {
    kind: 'demo',
    id: 'demo-meeting-notes',
    title: '會議錄音 → 摘要 → 待辦派工',
    setting: '一家專業服務公司（虛構情境）',
    challenge: '會議結束後沒有人整理紀錄，決議與待辦事項常常沒有被追蹤。',
    approach: [
      '確認會議類型、錄音方式與資料保密需求',
      '設計「錄音 → 逐字稿 → 摘要 → 待辦」的流程',
      '把待辦事項接到團隊既有的工作管理工具',
      '試行後依回饋調整摘要格式',
    ],
    deliverables: ['會議摘要與待辦的自動化流程', '摘要格式範本', '資料處理說明'],
    relatedServiceId: 'automation-project',
    blanks: {
      pillar: '降低成本與時間',
      kpi: '每場會議整理紀錄所花的時間',
      baseline: PENDING_BASELINE,
      target: PENDING_TARGET,
    },
  },
  {
    kind: 'demo',
    id: 'demo-corporate-training',
    title: '員工 AI 內訓（企業包班）',
    setting: '一家想讓全體同仁開始使用 AI 工具的公司（虛構情境）',
    challenge: '公司買了 AI 工具的帳號，但同仁不會寫提示詞，也不確定哪些資料可以放進工具。',
    approach: [
      '課前了解各部門的工作內容與資料使用規範',
      '依公司流程客製課程內容與練習題',
      '以包班形式授課，搭配課後問答',
    ],
    deliverables: ['客製化內訓課程', '課堂練習與提示詞範本', '課後問答'],
    relatedServiceId: 'corporate-training',
    blanks: {
      pillar: '降低成本與時間',
      kpi: '同仁在日常工作中使用 AI 工具的比例',
      baseline: PENDING_BASELINE,
      target: PENDING_TARGET,
    },
  },
];

/**
 * 檢查案例資料：real 案例必須帶 consentConfirmedBySean: true 與非空白的來源。
 * 回傳錯誤訊息清單；空陣列代表通過。
 */
export function validateCases(cases: ReadonlyArray<unknown>): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  cases.forEach((entry, index) => {
    const item = (entry ?? {}) as {
      id?: string;
      kind?: unknown;
      consentConfirmedBySean?: unknown;
      source?: unknown;
    };
    const label = item.id ?? `#${index}`;

    if (item.id) {
      if (seen.has(item.id)) errors.push(`${label}：id 重複`);
      seen.add(item.id);
    }

    if (item.kind !== 'demo' && item.kind !== 'real') {
      errors.push(`${label}：kind 必須是 'demo' 或 'real'`);
      return;
    }

    if (item.kind === 'real') {
      if (item.consentConfirmedBySean !== true) {
        errors.push(`${label}：real 案例缺少 consentConfirmedBySean: true`);
      }
      if (typeof item.source !== 'string' || item.source.trim() === '') {
        errors.push(`${label}：real 案例缺少來源欄位`);
      }
    }
  });

  return errors;
}
