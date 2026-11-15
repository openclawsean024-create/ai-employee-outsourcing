/**
 * M1 AC-011 README 補齊。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRAND } from '@/content/brand';
import { NAV_LINKS } from '@/content/navigation';

const root = process.cwd();
const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};

function section(heading: string): string {
  const start = readme.indexOf(`\n${heading}\n`);
  if (start === -1) return '';
  const rest = readme.slice(start + heading.length + 2);
  const next = rest.search(/\n## /);
  return next === -1 ? rest : rest.slice(0, next);
}

describe('M1 AC-011 README 補齊', () => {
  it.each([
    '## 產品定位',
    '## 路由',
    '## 本機開發',
    '## 驗證',
    '## 示範情境與測試模式',
    '## 資料與個資',
    '## 相關 repo 與外部教材狀態',
  ])('AC-011 README 含「%s」章節且有內容', (heading) => {
    expect(readme).toContain(`\n${heading}\n`);
    expect(section(heading).trim().length).toBeGreaterThan(80);
  });

  it('AC-011 產品定位說明這是服務型產品與兩種獲利模式', () => {
    const text = section('## 產品定位');
    expect(readme.startsWith(`# ${BRAND.name}`)).toBe(true);
    expect(text).toContain('服務型產品');
    expect(text).toContain('顧問／內訓');
    expect(text).toContain('專案建置');
  });

  it('AC-011 路由一覽列出所有實際存在的路由', () => {
    const text = section('## 路由');
    const routes = ['/', ...NAV_LINKS.map((link) => link.href), '/demo'];
    for (const route of routes) {
      expect(text).toContain(`\`${route}\``);
      const dir = route === '/' ? 'app/(site)' : route === '/demo' ? 'app/demo' : `app/(site)${route}`;
      expect(existsSync(path.join(root, dir, 'page.tsx'))).toBe(true);
    }
  });

  it('AC-011 本機開發與驗證章節列出的 npm script 都實際存在', () => {
    const text = `${section('## 本機開發')}\n${section('## 驗證')}`;
    for (const script of ['dev', 'build', 'start', 'lint', 'typecheck', 'test', 'test:watch']) {
      expect(pkg.scripts[script]).toBeTruthy();
    }
    for (const command of [
      'npm ci --legacy-peer-deps',
      'npm run dev',
      'npm run lint',
      'npm run typecheck',
      'npm test',
      'npm run build',
    ]) {
      expect(text).toContain(command);
    }
  });

  it('AC-011 驗證章節列出的每個 AC 測試檔都存在', () => {
    const text = section('## 驗證');
    const filters = Array.from(text.matchAll(/`npm test -- ([a-z-]+)`/g)).map((m) => m[1]);
    expect(filters.length).toBeGreaterThanOrEqual(11);
    for (const filter of filters) {
      const exists = ['ts', 'tsx'].some((ext) =>
        existsSync(path.join(root, 'src/__tests__', `${filter}.test.${ext}`)),
      );
      expect(exists, `找不到 ${filter} 的測試檔`).toBe(true);
    }
    for (let n = 1; n <= 12; n += 1) {
      expect(text).toContain(`AC-${String(n).padStart(3, '0')}`);
    }
  });

  it('AC-011 說明示範情境、測試模式與諮詢後報價', () => {
    const text = section('## 示範情境與測試模式');
    for (const keyword of ['示範情境', '非真實客戶案例', '測試模式，資料未送出', '諮詢後報價', '模擬輸出']) {
      expect(text).toContain(keyword);
    }
  });

  it('AC-011 說明資料與個資政策（M1 不送出、不儲存；告知文字待確認）', () => {
    const text = section('## 資料與個資');
    expect(text).toMatch(/不會離開瀏覽器，也不會被儲存/);
    expect(text).toContain('待 Sean／法務確認');
    expect(text).toContain('test@example.com');
  });

  it('AC-011 列出相關 repo 與外部教材狀態', () => {
    const text = section('## 相關 repo 與外部教材狀態');
    for (const repo of [
      'openclawsean024-create/ai-landing-specialist',
      'openclawsean024-create/claude-code-training',
      'sean0407/enterprise-ai-adoption-course',
    ]) {
      expect(text).toContain(repo);
    }
    expect(text).toContain('尚未整合');
    expect(text).toContain('沒有讀取或複製其內容');
  });

  it('AC-011 README 不含未查證宣稱或外幣價格', () => {
    expect(readme).not.toMatch(/Product Hunt|800\+|87%|178%|4\.61 億|LTV\/CAC|實戰案例|USD|\$[0-9]/);
  });
});
