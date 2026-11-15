/**
 * 預約諮詢表單的 zod schema（M1 AC-004、AC-005、AC-007）。
 * 驗證模式沿用 claude-code-training 各 API route 的 zod 寫法，只用於前端表單。
 */
import { z } from 'zod';
import { COMPANY_SIZE_VALUES, INQUIRY_TYPE_VALUES } from '@/content/contact';

export const HEADCOUNT_MAX = 100000;

const headcountSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : Number(trimmed);
    }
    return value;
  },
  z
    .number({ error: '預估人數請填數字' })
    .int('預估人數請填整數')
    .min(1, '預估人數至少為 1')
    .max(HEADCOUNT_MAX, '預估人數超出範圍')
    .optional(),
);

export const inquirySchema = z.object({
  name: z.string().trim().min(1, '請填寫姓名').max(50, '姓名請在 50 字以內'),
  email: z
    .string()
    .trim()
    .min(1, '請填寫 Email')
    .max(254, 'Email 過長')
    .pipe(z.email('Email 格式不正確')),
  company: z.string().trim().min(1, '請填寫公司名稱').max(100, '公司名稱請在 100 字以內'),
  companySize: z.enum(COMPANY_SIZE_VALUES, { error: '請選擇公司規模' }),
  inquiryType: z.enum(INQUIRY_TYPE_VALUES, { error: '請選擇需求類型' }),
  headcount: headcountSchema,
  message: z
    .string()
    .trim()
    .min(10, '請至少用 10 個字說明需求')
    .max(2000, '需求說明請在 2000 字以內'),
  consent: z.literal(true, { error: '請先閱讀個資蒐集告知並勾選同意' }),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

/** 驗證表單；失敗時回傳每個欄位的第一則錯誤訊息。 */
export function validateInquiry(
  input: unknown,
): { ok: true; data: Inquiry } | { ok: false; errors: InquiryErrors } {
  const result = inquirySchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };

  const errors: InquiryErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof Inquiry | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return { ok: false, errors };
}
