/**
 * M1 AC-008 移除未查證宣稱。
 * 以禁用詞清單掃描使用者可見內容（app/、src/components/、src/content/），
 * 任何未查證的評分、用戶數、市場統計或「實戰案例」說法都會讓測試失敗。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const SCAN_DIRS = ['app', 'src/components', 'src/content'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.css', '.md', '.mdx', '.json'];

/** 禁用詞清單：新增內容前若需要用到這些說法，必須先有出處並經 Sean 確認。 */
const BANNED_CLAIMS: Array<{ label: string; pattern: RegExp }> = [
  // GOAL.md AC-008 指定
  { label: '未查證評分來源（Product Hunt）', pattern: /Product Hunt/i },
  { label: '未查證用戶數（800+）', pattern: /800\+/ },
  { label: '未查證統計（87%）', pattern: /87\s*%/ },
  { label: '未查證統計（178%）', pattern: /178\s*%/ },
  { label: '未查證營收數字（4.61 億）', pattern: /4\.61\s*億/ },
  { label: '未查證指標（LTV/CAC）', pattern: /LTV\s*\/\s*CAC/i },
  { label: '未查證實績（實戰案例）', pattern: /實戰案例/ },
  // 舊版主 repo 的不實說法
  { label: '不實說法（平台預載金鑰）', pattern: /預載金鑰/ },
  { label: '未查證用戶數（微型賣家使用）', pattern: /微型賣家使用/ },
  // ai-landing-specialist@8e0625e 未搬入的市場數據區與社會認同
  { label: '無出處市場數據（IBM）', pattern: /\bIBM\b/ },
  { label: '無出處市場數據（Upwork）', pattern: /Upwork/i },
  { label: '無出處市場數據（麥肯錫）', pattern: /麥肯錫|McKinsey/i },
  { label: '無出處市場數據（61% 採用鴻溝）', pattern: /61\s*%/ },
  { label: '無出處市場數據（+40% 時薪）', pattern: /\+\s*40\s*%/ },
  { label: '無出處市場數據（3-15% 營收增長）', pattern: /3\s*[-–]\s*15\s*%/ },
  { label: '未查證成功率（13% 成功）', pattern: /13\s*%/ },
  { label: '未查證社會認同（最受歡迎）', pattern: /最受歡迎/ },
  { label: '未確認的回覆承諾（24 小時內回信）', pattern: /24\s*小時內回信/ },
  { label: '引用影片原話', pattern: /影片原話/ },
  // claude-code-training 首頁未查證數字
  { label: '未查證營收數字（潛在 ARR）', pattern: /潛在\s*ARR/i },
  { label: '未查證數字（5 萬 AI 工程師）', pattern: /5\s*萬\s*AI\s*工程師/ },
  { label: '未查證數字（500 家企業）', pattern: /500\s*家企業/ },
  { label: '未查證觀看數（410K）', pattern: /410K/i },
  // 通用樣式：評分、用戶數、見證
  { label: '未查證用戶／客戶數量', pattern: /已有\s*[\d,.]+\s*[萬千]?\s*\+?\s*[位家名個]?\s*(用戶|客戶|賣家|企業|學員)/ },
  { label: '未查證評分（x.x 顆星／分）', pattern: /[1-5]\.\d\s*(顆星|星評|分好評|\/\s*5)/ },
  { label: '未查證見證（客戶見證／好評推薦）', pattern: /客戶見證|好評推薦/ },
  { label: '外幣標價（USD）', pattern: /\bUSD\b/ },
];

function listFiles(dir: string): string[] {
  const abs = path.join(root, dir);
  const out: string[] = [];
  for (const entry of readdirSync(abs)) {
    const full = path.join(abs, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listFiles(path.join(dir, entry)));
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry))) {
      out.push(path.join(dir, entry));
    }
  }
  return out;
}

function findClaims(text: string): string[] {
  return BANNED_CLAIMS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

describe('M1 AC-008 移除未查證宣稱', () => {
  const files = SCAN_DIRS.flatMap(listFiles);

  it('AC-008 掃描範圍涵蓋 app/、src/components/、src/content/', () => {
    for (const dir of SCAN_DIRS) {
      expect(files.some((f) => f.startsWith(`${dir}${path.sep}`))).toBe(true);
    }
  });

  it('AC-008 使用者可見內容不含禁用詞清單中的任何宣稱', () => {
    const violations: string[] = [];
    for (const file of files) {
      const lines = readFileSync(path.join(root, file), 'utf8').split('\n');
      lines.forEach((line, index) => {
        for (const label of findClaims(line)) {
          violations.push(`${file}:${index + 1} ${label} → ${line.trim()}`);
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it('AC-008 DashboardHero 已移除「Product Hunt 4.9、800+ 微型賣家」', () => {
    const hero = readFileSync(
      path.join(root, 'src/components/views/dashboard/DashboardHero.tsx'),
      'utf8',
    );
    expect(hero).not.toMatch(/Product Hunt|800\+|微型賣家|4\.9/);
  });

  it('AC-008 示範頁的假指標明確標示為示意數字', () => {
    const metrics = readFileSync(
      path.join(root, 'src/components/views/dashboard/DashboardMetrics.tsx'),
      'utf8',
    );
    expect(metrics).toContain('並非實際用量、成本或成效統計');
  });

  it.each([
    '4.9 在 Product Hunt · 已有 800+ 微型賣家使用',
    '目前 Beta 版僅使用平台預載金鑰',
    '87% AI 專案死在 demo 階段',
    'AI 整合服務需求年同比 +178%',
    'NT$4.61 億 潛在 ARR',
    'LTV/CAC 36',
    '電商、零售都有實戰案例',
    '已有 1,200 位客戶導入',
    '學員評價 4.8 / 5',
    'USD $100 – $500 / 小時',
  ])('AC-008 掃描器會擋下：%s', (sample) => {
    expect(findClaims(sample).length).toBeGreaterThan(0);
  });

  it.each([
    '示範情境：非真實客戶案例',
    '諮詢後報價',
    '客製化 4 小時課程，10–50 人',
    '每個工作流都先定義 KPI、今日基準與 60 天目標',
  ])('AC-008 掃描器不會誤擋正常文案：%s', (sample) => {
    expect(findClaims(sample)).toEqual([]);
  });
});
