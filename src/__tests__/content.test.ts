/**
 * M1 AC-007 合併內容搬遷完成。
 * PRD/SPEC.md §12.1、§12.2 列為「搬入」的每一項，在主 repo 都要有對應資料檔。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROCESS_STEPS } from '@/content/process';
import { FAQ_ITEMS } from '@/content/faq';
import { FOUR_BLANKS, PILLARS } from '@/content/methodology';
import { SERVICE_LADDER, SERVICE_PLANS } from '@/content/services';
import { PAIN_POINTS } from '@/content/home';
import { COURSE_LEVELS, COURSES, CORPORATE_PACKAGE } from '@/content/training';
import { CONTACT_COPY, INQUIRY_FIELDS, INQUIRY_TYPES } from '@/content/contact';
import { inquirySchema } from '@/lib/inquiry/schema';

const root = process.cwd();

describe('M1 AC-007 從 ai-landing-specialist@8e0625e 搬入', () => {
  it('AC-007 process.ts 有 5 步導入流程（免費診斷→業務審計→方案設計→PoC 部署→培訓迭代）', () => {
    expect(PROCESS_STEPS).toHaveLength(5);
    expect(PROCESS_STEPS.map((s) => s.step)).toEqual([1, 2, 3, 4, 5]);
    expect(PROCESS_STEPS.map((s) => s.title)).toEqual([
      '免費診斷',
      '業務審計',
      '方案設計',
      'PoC 與部署',
      '培訓與迭代',
    ]);
    for (const step of PROCESS_STEPS) {
      expect(step.description.length).toBeGreaterThan(0);
      // 時程數字待 Sean 確認
      expect(step.duration.confirmed).toBe(false);
    }
  });

  it('AC-007 faq.ts 至少 5 題（搬入 7 題），每題有問與答', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThanOrEqual(5);
    expect(FAQ_ITEMS).toHaveLength(7);
    for (const item of FAQ_ITEMS) {
      expect(item.question.trim().length).toBeGreaterThan(0);
      expect(item.answer.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(FAQ_ITEMS.map((i) => i.id)).size).toBe(FAQ_ITEMS.length);
  });

  it('AC-007 FAQ 已刪除未確認的費用數字與產業實績說法', () => {
    const text = FAQ_ITEMS.map((i) => `${i.question}${i.answer}`).join('\n');
    expect(text).not.toMatch(/\d+\s*[-–]\s*\d+\s*萬/);
    expect(text).not.toMatch(/都有.*案例/);
    expect(text).toContain('示範情境');
    expect(text).toContain('諮詢後報價');
  });

  it('AC-007 methodology.ts 含三大板塊與 4 個空格', () => {
    expect(PILLARS).toHaveLength(3);
    expect(PILLARS.map((p) => p.title)).toEqual([
      '獲取更多客戶',
      '提升單個客戶價值',
      '降低成本與時間',
    ]);
    expect(FOUR_BLANKS).toHaveLength(4);
    expect(FOUR_BLANKS.map((b) => b.label)).toEqual([
      '對應板塊',
      '具體 KPI',
      '今日基準',
      '60 天目標',
    ]);
  });

  it('AC-007 services.ts 含四階服務天梯', () => {
    expect(SERVICE_LADDER.map((p) => p.name)).toEqual([
      '教育與諮詢',
      '付費業務審計',
      '專項開發專案',
      '月度維護',
    ]);
    for (const plan of SERVICE_LADDER) {
      expect(plan.source).toBe('ai-landing-specialist@8e0625e');
    }
  });

  it('AC-007 首頁有 3 個痛點場景，且標為示意、不含數字統計', () => {
    expect(PAIN_POINTS).toHaveLength(3);
    for (const point of PAIN_POINTS) {
      expect(point.illustrative).toBe(true);
      expect(`${point.title}${point.description}`).not.toMatch(/\d/);
    }
  });

  it('AC-007 預約表單保留「不推長期合約」說明，且沒有回覆時效承諾', () => {
    expect(CONTACT_COPY.intro).toContain('不推長期合約');
    expect(JSON.stringify(CONTACT_COPY)).not.toMatch(/小時內回/);
  });
});

describe('M1 AC-007 從 claude-code-training@48e84a7 搬入', () => {
  it('AC-007 training.ts 有基礎／進階／企業三種課程程度', () => {
    expect(COURSE_LEVELS.map((l) => l.id)).toEqual(['basic', 'advanced', 'enterprise']);
    expect(COURSE_LEVELS.map((l) => l.label)).toEqual(['基礎', '進階', '企業']);
  });

  it('AC-007 課程卡欄位完整（標題、說明、程度、時長、價格）', () => {
    expect(COURSES.length).toBeGreaterThanOrEqual(3);
    for (const course of COURSES) {
      expect(course.title.length).toBeGreaterThan(0);
      expect(course.description.length).toBeGreaterThan(0);
      expect(['basic', 'advanced', 'enterprise']).toContain(course.level);
      expect(course).toHaveProperty('durationMinutes');
      expect(course.price.currency).toBe('TWD');
    }
  });

  it('AC-007 企業包班形式（客製化 4 小時、10–50 人、實體＋線上、結業證書）', () => {
    const features = CORPORATE_PACKAGE.features.join('｜');
    expect(features).toContain('4 小時');
    expect(features).toContain('10–50 人');
    expect(features).toContain('實體＋線上');
    expect(features).toContain('結業證書');
  });

  it('AC-007 顧問方案描述併入 services.ts', () => {
    const retainer = SERVICE_PLANS.find((p) => p.id === 'advisory-retainer');
    expect(retainer).toBeTruthy();
    expect(retainer?.source).toBe('claude-code-training@48e84a7');
    expect(retainer?.deliverables).toEqual([
      '每週顧問會議',
      '客製化 Claude Code 開發',
      'AI 成熟度報告',
    ]);
  });

  it('AC-007 預約欄位概念轉為「需求類型」「預估人數」', () => {
    expect(INQUIRY_FIELDS.inquiryType.label).toBe('需求類型');
    expect(INQUIRY_FIELDS.headcount.label).toBe('預估人數');
    expect(INQUIRY_FIELDS.headcount.required).toBe(false);
    expect(INQUIRY_TYPES.map((t) => t.label)).toEqual(['導入專案', '內訓', '諮詢']);
  });

  it('AC-007 表單以 zod schema 驗證', () => {
    const ok = inquirySchema.safeParse({
      name: '王測試',
      email: 'test@example.com',
      company: '範例股份有限公司',
      companySize: '11-50',
      inquiryType: 'training',
      headcount: '20',
      message: '想替 20 位同仁安排 AI 內訓課程。',
      consent: true,
    });
    expect(ok.success).toBe(true);
    expect(inquirySchema.safeParse({}).success).toBe(false);
  });
});

describe('M1 AC-007 不搬的模組沒有進主 repo', () => {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  it('AC-007 沒有 auth、Prisma、Stripe、Supabase 相關依賴', () => {
    for (const name of Object.keys(deps)) {
      expect(name).not.toMatch(/prisma|stripe|supabase|bcrypt|next-auth|nodemailer|emailjs/i);
    }
    expect(deps.zod).toBeTruthy();
  });

  it('AC-007 沒有後端 API route、資料庫 schema 或 .env', () => {
    expect(existsSync(path.join(root, 'app/api'))).toBe(false);
    expect(existsSync(path.join(root, 'prisma'))).toBe(false);
    expect(existsSync(path.join(root, 'supabase'))).toBe(false);
    expect(readdirSync(root).filter((f) => f.startsWith('.env'))).toEqual([]);
  });

  it('AC-007 沒有登入、註冊、報名或付款路由', () => {
    for (const route of ['login', 'register', 'courses', 'checkout', 'pricing', 'dashboard']) {
      expect(existsSync(path.join(root, 'app', route))).toBe(false);
      expect(existsSync(path.join(root, 'app/(site)', route))).toBe(false);
    }
  });
});
