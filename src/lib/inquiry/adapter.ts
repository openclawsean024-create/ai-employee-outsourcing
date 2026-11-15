/**
 * 諮詢送出 adapter（M1 AC-004）。
 *
 * M1 只有 mock 實作：不發任何網路請求、不寫入 localStorage／IndexedDB／cookie、
 * 不寫 console，資料只存在呼叫當下的記憶體中，函式結束後即丟棄。
 *
 * M2 接真實送達管道（Email、表單服務、CRM…）前，必須先由 Sean 選定並授權管道、
 * 補上隱私權政策與保存期限（PRD/SPEC.md FR-014、FR-015），再替換 submitInquiry。
 */
import type { Inquiry } from './schema';

export type InquiryResult =
  | {
      ok: true;
      /** test = 測試模式（mock）；live = 已接真實送達管道 */
      mode: 'test' | 'live';
      /** 資料是否真的送達某個收件端 */
      delivered: boolean;
    }
  | { ok: false; message: string };

export type SubmitInquiry = (inquiry: Inquiry) => Promise<InquiryResult>;

/** M1 預設實作：測試模式，資料未送出。 */
export const mockSubmitInquiry: SubmitInquiry = async () => ({
  ok: true,
  mode: 'test',
  delivered: false,
});

/** 表單預設使用的 adapter。M1 固定為 mock。 */
export const submitInquiry: SubmitInquiry = mockSubmitInquiry;
