/**
 * M1 AC-004 預約諮詢表單（測試模式）與 AC-005 個資告知與同意。
 * 測試只使用明顯的假資料（王測試、test@example.com、範例股份有限公司）。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import ContactForm from '@/components/site/ContactForm';
import PrivacyNotice from '@/components/site/PrivacyNotice';
import { COMPANY_SIZES, INQUIRY_TYPES, parseInquiryType } from '@/content/contact';
import { PRIVACY_NOTICE } from '@/content/privacy-notice';
import { mockSubmitInquiry, submitInquiry, type SubmitInquiry } from '@/lib/inquiry/adapter';
import { validateInquiry } from '@/lib/inquiry/schema';

const root = process.cwd();

const FAKE = {
  name: '王測試',
  email: 'test@example.com',
  company: '範例股份有限公司',
  companySize: '11-50',
  inquiryType: 'project',
  headcount: '12',
  message: '想把客服常見問題的回覆流程自動化，先了解可以怎麼開始。',
};

/** 記錄所有可能把資料帶出瀏覽器或寫入本機儲存的管道。 */
function installLeakSpies() {
  const fetchSpy = vi.fn(() => Promise.reject(new Error('測試中不應呼叫 fetch')));
  vi.stubGlobal('fetch', fetchSpy);
  const sendBeacon = vi.fn(() => true);
  Object.defineProperty(window.navigator, 'sendBeacon', { value: sendBeacon, configurable: true });
  const xhrOpen = vi.spyOn(window.XMLHttpRequest.prototype, 'open');
  const xhrSend = vi.spyOn(window.XMLHttpRequest.prototype, 'send');
  ensureStorage('localStorage');
  ensureStorage('sessionStorage');
  const setItem = vi.fn();
  for (const storage of [window.localStorage, window.sessionStorage]) {
    const original = storage.setItem.bind(storage);
    vi.spyOn(storage, 'setItem').mockImplementation((key: string, value: string) => {
      setItem(key);
      original(key, value);
    });
  }
  const idbOpen = vi.spyOn(indexedDB, 'open');
  const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  return { fetchSpy, sendBeacon, xhrOpen, xhrSend, setItem, idbOpen, consoleLog };
}

/** 記憶體版 Storage：執行環境沒有提供 Web Storage 時使用，讓「有沒有寫入」仍然可以被檢查。 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  [name: string]: unknown;
}

/**
 * 較新的 Node 會以自己的（未啟用的）localStorage 蓋掉 jsdom 的實作，使 window.localStorage 為 undefined。
 * 這時補上記憶體版，確保「localStorage 無新增鍵」的斷言不是空檢查。
 */
function ensureStorage(name: 'localStorage' | 'sessionStorage') {
  let existing: Storage | undefined;
  try {
    existing = (globalThis as Record<string, unknown>)[name] as Storage | undefined;
  } catch {
    existing = undefined;
  }
  if (!existing || typeof existing.setItem !== 'function') {
    vi.stubGlobal(name, new MemoryStorage());
  }
}

function storageKeys(storage: Storage): string[] {
  return Array.from({ length: storage.length }, (_, i) => storage.key(i) ?? '').sort();
}

/** 去掉註解，只檢查實際程式碼。 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}

function fillForm(overrides: Partial<typeof FAKE> = {}) {
  const data = { ...FAKE, ...overrides };
  fireEvent.change(screen.getByLabelText(/^姓名/), { target: { value: data.name } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: data.email } });
  fireEvent.change(screen.getByLabelText(/^公司(?!規模)/), { target: { value: data.company } });
  fireEvent.change(screen.getByLabelText(/^公司規模/), { target: { value: data.companySize } });
  fireEvent.change(screen.getByLabelText(/^需求類型/), { target: { value: data.inquiryType } });
  fireEvent.change(screen.getByLabelText(/^預估人數/), { target: { value: data.headcount } });
  fireEvent.change(screen.getByLabelText(/^需求說明/), { target: { value: data.message } });
}

const consentBox = () => screen.getByRole('checkbox', { name: /我已閱讀並同意/ }) as HTMLInputElement;
const submitButton = () => screen.getByRole('button', { name: '送出預約' });

let spies: ReturnType<typeof installLeakSpies>;

beforeEach(() => {
  spies = installLeakSpies();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('M1 AC-004 預約諮詢表單（測試模式）', () => {
  it('AC-004 表單含姓名、Email、公司、公司規模、需求類型、預估人數（選填）、需求說明', () => {
    render(<ContactForm submit={vi.fn()} />);
    expect(screen.getByLabelText(/^姓名/).getAttribute('aria-required')).toBe('true');
    expect(screen.getByLabelText(/^Email/).getAttribute('type')).toBe('email');
    expect(screen.getByLabelText(/^公司(?!規模)/)).toBeTruthy();
    expect(screen.getByLabelText(/^需求說明/).tagName).toBe('TEXTAREA');

    const size = screen.getByLabelText(/^公司規模/) as HTMLSelectElement;
    expect(Array.from(size.options).map((o) => o.value).filter(Boolean)).toEqual(
      COMPANY_SIZES.map((s) => s.value),
    );

    const type = screen.getByLabelText(/^需求類型/) as HTMLSelectElement;
    expect(Array.from(type.options).map((o) => o.textContent).slice(1)).toEqual([
      '導入專案',
      '內訓',
      '諮詢',
    ]);

    const headcount = screen.getByLabelText(/^預估人數/);
    expect(headcount.getAttribute('aria-required')).toBe('false');
    expect(screen.getByText('（選填）')).toBeTruthy();
  });

  it('AC-004 空白送出顯示各欄錯誤訊息，adapter 不被呼叫', async () => {
    const submit = vi.fn<SubmitInquiry>();
    render(<ContactForm submit={submit} />);
    fireEvent.click(submitButton());

    const alerts = await screen.findAllByRole('alert');
    const messages = alerts.map((a) => a.textContent);
    expect(messages).toEqual([
      '請填寫姓名',
      '請填寫 Email',
      '請填寫公司名稱',
      '請選擇公司規模',
      '請選擇需求類型',
      '請至少用 10 個字說明需求',
      '請先閱讀個資蒐集告知並勾選同意',
    ]);
    expect(submit).toHaveBeenCalledTimes(0);

    // 錯誤訊息與欄位以 aria 關聯，且焦點移到第一個錯誤欄位
    const name = screen.getByLabelText(/^姓名/);
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe('inquiry-name-error');
    expect(document.activeElement).toBe(name);
    // 選填欄位留空不算錯誤
    expect(screen.getByLabelText(/^預估人數/).getAttribute('aria-invalid')).toBeNull();
  });

  it('AC-004 Email 格式錯誤與預估人數非數字時顯示錯誤', async () => {
    const submit = vi.fn<SubmitInquiry>();
    render(<ContactForm submit={submit} />);
    fillForm({ email: 'not-an-email', headcount: '很多人' });
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    const messages = (await screen.findAllByRole('alert')).map((a) => a.textContent);
    expect(messages).toEqual(['Email 格式不正確', '預估人數請填數字']);
    expect(submit).toHaveBeenCalledTimes(0);
  });

  it('AC-004 以假資料送出：adapter 被呼叫 1 次、fetch 0 次、localStorage 無新增鍵', async () => {
    const localBefore = storageKeys(window.localStorage);
    const sessionBefore = storageKeys(window.sessionStorage);
    const submit = vi.fn<SubmitInquiry>(mockSubmitInquiry);

    render(<ContactForm submit={submit} />);
    fillForm();
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    const success = await screen.findByTestId('inquiry-success');
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith({
      name: '王測試',
      email: 'test@example.com',
      company: '範例股份有限公司',
      companySize: '11-50',
      inquiryType: 'project',
      headcount: 12,
      message: FAKE.message,
      consent: true,
    });

    expect(spies.fetchSpy).toHaveBeenCalledTimes(0);
    expect(spies.sendBeacon).toHaveBeenCalledTimes(0);
    expect(spies.xhrOpen).toHaveBeenCalledTimes(0);
    expect(spies.xhrSend).toHaveBeenCalledTimes(0);
    expect(spies.setItem).toHaveBeenCalledTimes(0);
    expect(spies.idbOpen).toHaveBeenCalledTimes(0);
    expect(spies.consoleLog).toHaveBeenCalledTimes(0);
    expect(storageKeys(window.localStorage)).toEqual(localBefore);
    expect(storageKeys(window.sessionStorage)).toEqual(sessionBefore);

    // 成功畫面明示測試模式
    expect(success.getAttribute('role')).toBe('status');
    expect(success.getAttribute('data-mode')).toBe('test');
    expect(within(success).getByRole('heading').textContent).toBe('測試模式，資料未送出');
    expect(success.textContent).toContain('沒有被送出、儲存或寄給任何人');
    // 畫面上不殘留填過的個資
    expect(document.body.textContent).not.toContain('王測試');
    expect(document.body.textContent).not.toContain('test@example.com');
  });

  it('AC-004 預估人數可留空（選填）', async () => {
    const submit = vi.fn<SubmitInquiry>(mockSubmitInquiry);
    render(<ContactForm submit={submit} />);
    fillForm({ headcount: '' });
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    await screen.findByTestId('inquiry-success');
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit.mock.calls[0][0].headcount).toBeUndefined();
  });

  it('AC-004 預設 adapter 就是 mock：不發網路請求、不寫入 storage，回傳測試模式', async () => {
    expect(submitInquiry).toBe(mockSubmitInquiry);
    const localBefore = storageKeys(window.localStorage);

    render(<ContactForm />);
    fillForm();
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());
    await screen.findByText('測試模式，資料未送出');

    const parsed = validateInquiry({ ...FAKE, consent: true });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      await expect(mockSubmitInquiry(parsed.data)).resolves.toEqual({
        ok: true,
        mode: 'test',
        delivered: false,
      });
    }

    expect(spies.fetchSpy).toHaveBeenCalledTimes(0);
    expect(spies.sendBeacon).toHaveBeenCalledTimes(0);
    expect(spies.xhrOpen).toHaveBeenCalledTimes(0);
    expect(spies.setItem).toHaveBeenCalledTimes(0);
    expect(spies.idbOpen).toHaveBeenCalledTimes(0);
    expect(storageKeys(window.localStorage)).toEqual(localBefore);
  });

  it('AC-004 adapter 與表單原始碼沒有任何對外送出或儲存的程式', () => {
    for (const file of [
      'src/lib/inquiry/adapter.ts',
      'src/lib/inquiry/schema.ts',
      'src/components/site/ContactForm.tsx',
      'src/components/site/ContactContent.tsx',
    ]) {
      const source = stripComments(readFileSync(path.join(root, file), 'utf8'));
      expect(source.length).toBeGreaterThan(100);
      expect(source).not.toMatch(
        /fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|console\.|https?:\/\/|mailto:|axios|emailjs/i,
      );
    }
  });

  it('AC-004 表單上方明示測試模式；adapter 失敗時顯示錯誤而非成功', async () => {
    const submit = vi.fn<SubmitInquiry>(async () => ({ ok: false, message: '測試用錯誤' }));
    render(<ContactForm submit={submit} />);
    expect(screen.getByTestId('inquiry-test-banner').textContent).toContain('測試模式');

    fillForm();
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    expect((await screen.findByTestId('inquiry-submit-error')).textContent).toBe('測試用錯誤');
    expect(screen.queryByTestId('inquiry-success')).toBeNull();
  });

  it('AC-004 可預選需求類型（/contact?type=training → 內訓）', () => {
    expect(parseInquiryType('training')).toBe('training');
    expect(parseInquiryType('hacker')).toBe('');
    expect(parseInquiryType(null)).toBe('');
    expect(INQUIRY_TYPES.find((t) => t.value === 'training')?.label).toBe('內訓');

    render(<ContactForm initialType="training" submit={vi.fn()} />);
    expect((screen.getByLabelText(/^需求類型/) as HTMLSelectElement).value).toBe('training');
  });

  it('AC-004 /contact 路由存在並渲染 ContactContent', () => {
    const page = path.join(root, 'app/(site)/contact/page.tsx');
    expect(existsSync(page)).toBe(true);
    expect(readFileSync(page, 'utf8')).toContain('ContactContent');
  });
});

describe('M1 AC-005 個資告知與同意', () => {
  it('AC-005 告知區塊含蒐集目的、資料類別、利用期間與方式、當事人權利', () => {
    render(<PrivacyNotice />);
    const notice = screen.getByTestId('privacy-notice');
    for (const heading of ['蒐集目的', '資料類別', '利用期間與方式', '當事人權利']) {
      expect(within(notice).getByText(heading)).toBeTruthy();
    }
    for (const section of PRIVACY_NOTICE.sections) {
      expect(notice.textContent).toContain(section.body);
    }
  });

  it('AC-005 告知文字標註版本號與「待 Sean／法務確認」', () => {
    render(<PrivacyNotice />);
    const version = screen.getByTestId('privacy-notice-version').textContent ?? '';
    expect(version).toContain(PRIVACY_NOTICE.version);
    expect(version).toMatch(/v\d+\.\d+/);
    expect(version).toContain('待 Sean／法務確認');
  });

  it('AC-005 告知顯示在表單欄位上方，且有必勾的同意核取方塊', () => {
    render(<ContactForm submit={vi.fn()} />);
    const notice = screen.getByTestId('privacy-notice');
    const firstField = screen.getByLabelText(/^姓名/);
    expect(
      notice.compareDocumentPosition(firstField) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    const box = consentBox();
    expect(box.checked).toBe(false);
    expect(box.required).toBe(true);
    expect(box.getAttribute('aria-describedby')).toBe('privacy-notice');
  });

  it('AC-005 未勾選同意不能送出：adapter 呼叫 0 次並顯示錯誤', async () => {
    const submit = vi.fn<SubmitInquiry>(mockSubmitInquiry);
    render(<ContactForm submit={submit} />);
    fillForm();
    fireEvent.click(submitButton());

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('請先閱讀個資蒐集告知並勾選同意');
    expect(submit).toHaveBeenCalledTimes(0);
    expect(spies.fetchSpy).toHaveBeenCalledTimes(0);
    expect(screen.queryByTestId('inquiry-success')).toBeNull();
    expect(document.activeElement).toBe(consentBox());
  });

  it('AC-005 勾選後再取消同意，仍然不能送出', async () => {
    const submit = vi.fn<SubmitInquiry>(mockSubmitInquiry);
    render(<ContactForm submit={submit} />);
    fillForm();
    fireEvent.click(consentBox());
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    await screen.findByRole('alert');
    expect(submit).toHaveBeenCalledTimes(0);
  });

  it('AC-005 勾選同意後才可送出', async () => {
    const submit = vi.fn<SubmitInquiry>(mockSubmitInquiry);
    render(<ContactForm submit={submit} />);
    fillForm();
    fireEvent.click(consentBox());
    fireEvent.click(submitButton());

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0].consent).toBe(true);
  });

  it('AC-005 schema 層也拒絕未同意的資料', () => {
    const result = validateInquiry({ ...FAKE, consent: false });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({ consent: '請先閱讀個資蒐集告知並勾選同意' });
    }
  });
});
