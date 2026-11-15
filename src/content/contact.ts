/**
 * 預約諮詢表單的欄位與文案（M1 AC-004、AC-007）。
 *
 * 欄位來源：
 * - ai-landing-specialist@8e0625e 的預約診斷表單：姓名、Email、公司、問題描述，以及「不推長期合約」說明
 * - claude-code-training@48e84a7 的 Booking 模型：類型（enterprise／consulting）→「需求類型」、attendees →「預估人數」
 * - 公司規模欄位參考 ai-team-intro 的表單設計（只參考欄位，不搬程式）
 *
 * 原表單的回覆時效承諾未經 Sean 確認，沒有搬入。
 */

export const INQUIRY_TYPES = [
  { value: 'project', label: '導入專案' },
  { value: 'training', label: '內訓' },
  { value: 'consulting', label: '諮詢' },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]['value'];

export const INQUIRY_TYPE_VALUES = INQUIRY_TYPES.map((t) => t.value) as [
  InquiryType,
  ...InquiryType[],
];

export const COMPANY_SIZES = [
  { value: '1-10', label: '1–10 人' },
  { value: '11-50', label: '11–50 人' },
  { value: '51-200', label: '51–200 人' },
  { value: '201+', label: '201 人以上' },
] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number]['value'];

export const COMPANY_SIZE_VALUES = COMPANY_SIZES.map((s) => s.value) as [
  CompanySize,
  ...CompanySize[],
];

export const INQUIRY_FIELDS = {
  name: { label: '姓名', required: true, placeholder: '例：王測試' },
  email: { label: 'Email', required: true, placeholder: 'you@example.com' },
  company: { label: '公司', required: true, placeholder: '例：範例股份有限公司' },
  companySize: { label: '公司規模', required: true, placeholder: '請選擇' },
  inquiryType: { label: '需求類型', required: true, placeholder: '請選擇' },
  headcount: { label: '預估人數', required: false, placeholder: '內訓或使用人數，可留空' },
  message: {
    label: '需求說明',
    required: true,
    placeholder: '例：客服每天重複回覆一樣的問題／想做內容但沒有人力／會議紀錄沒人整理…',
  },
} as const;

export type InquiryFieldName = keyof typeof INQUIRY_FIELDS;

export const CONTACT_COPY = {
  title: '預約諮詢',
  intro: '先從 30 分鐘免費診斷開始。不賣東西、不推長期合約，只談你的業務現在最值得導入 AI 的一兩個地方。',
  submitLabel: '送出預約',
  testModeBanner: '測試模式：本表單目前不會把資料送出或儲存到任何地方。',
  successTitle: '測試模式，資料未送出',
  successBody:
    '表單驗證已通過，但本網站目前為測試模式：你填寫的內容沒有被送出、儲存或寄給任何人。正式的諮詢送達管道待 Sean 選定後開放。',
  resetLabel: '再填一次',
} as const;

/** 判斷網址參數帶入的需求類型是否合法（例如 /contact?type=training）。 */
export function parseInquiryType(value: string | null | undefined): InquiryType | '' {
  return INQUIRY_TYPE_VALUES.includes(value as InquiryType) ? (value as InquiryType) : '';
}
