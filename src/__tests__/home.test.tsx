/**
 * M1 AC-010 首頁導覽與品牌。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import HomeContent from '@/components/site/HomeContent';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';
import { BRAND } from '@/content/brand';
import { FAQ_ITEMS } from '@/content/faq';
import { PAIN_POINTS } from '@/content/home';
import { FOUR_BLANKS, PILLARS } from '@/content/methodology';
import { NAV_LINKS } from '@/content/navigation';
import { PROCESS_STEPS } from '@/content/process';

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

function listSourceFiles(dir: string): string[] {
  return readdirSync(path.join(root, dir)).flatMap((entry) => {
    const rel = path.join(dir, entry);
    if (statSync(path.join(root, rel)).isDirectory()) return listSourceFiles(rel);
    return /\.(ts|tsx)$/.test(entry) ? [rel] : [];
  });
}

describe('M1 AC-010 首頁導覽', () => {
  it('AC-010 導覽列有 服務／案例／內訓／預約諮詢 4 個連結與正確 href', () => {
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: '主導覽' });
    const links = within(nav).getAllByRole('link');

    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['服務', '/services'],
      ['案例', '/cases'],
      ['內訓', '/training'],
      ['預約諮詢', '/contact'],
    ]);
    expect(NAV_LINKS).toHaveLength(4);
  });

  it('AC-010 導覽連到的 4 個路由都存在', () => {
    for (const link of NAV_LINKS) {
      expect(existsSync(path.join(root, 'app/(site)', link.href, 'page.tsx'))).toBe(true);
    }
  });

  it('AC-010 首頁含 hero、痛點、方法論、導入流程、FAQ、CTA', () => {
    render(<HomeContent />);

    const hero = screen.getByTestId('home-hero');
    expect(within(hero).getByRole('heading', { level: 1 }).textContent).toContain('推進到真正上線');
    expect(
      within(hero).getByRole('link', { name: '預約 30 分鐘免費診斷' }).getAttribute('href'),
    ).toBe('/contact');
    expect(within(hero).getByRole('link', { name: '看服務方案' }).getAttribute('href')).toBe(
      '/services',
    );

    const pain = screen.getByTestId('home-pain-points');
    for (const point of PAIN_POINTS) {
      expect(within(pain).getByRole('heading', { name: point.title })).toBeTruthy();
    }
    expect(screen.getByTestId('pain-points-note').textContent).toContain('並非統計數據');

    const methodology = screen.getByTestId('home-methodology');
    for (const pillar of PILLARS) {
      expect(within(methodology).getByRole('heading', { name: pillar.title })).toBeTruthy();
    }
    const blanks = within(screen.getByTestId('four-blanks')).getAllByTestId('blank');
    expect(blanks).toHaveLength(4);
    FOUR_BLANKS.forEach((blank, index) => {
      expect(blanks[index].textContent).toContain(blank.label);
    });

    const steps = within(screen.getByTestId('home-process')).getAllByTestId('process-step');
    expect(steps).toHaveLength(5);
    PROCESS_STEPS.forEach((step, index) => {
      expect(steps[index].textContent).toContain(step.title);
      expect(steps[index].textContent).toContain('規劃值，待確認');
    });

    const faqs = within(screen.getByTestId('home-faq')).getAllByTestId('faq-item');
    expect(faqs).toHaveLength(FAQ_ITEMS.length);
    FAQ_ITEMS.forEach((item, index) => {
      expect(faqs[index].textContent).toContain(item.question);
      expect(faqs[index].textContent).toContain(item.answer);
    });

    expect(screen.getByTestId('home-cta-link').getAttribute('href')).toBe('/contact');
  });

  it('AC-010 首頁各區塊標題可由錨點定位（#methodology、#process、#faq）', () => {
    const { container } = render(<HomeContent />);
    for (const id of ['pain', 'methodology', 'process', 'faq']) {
      const heading = container.querySelector(`#${id}`);
      expect(heading?.tagName).toBe('H2');
      expect(heading?.getAttribute('tabindex')).toBe('-1');
    }
  });

  it('AC-010 頁尾提供示範頁入口並說明網站為測試版', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('link', { name: /AI 員工示範/ }).getAttribute('href')).toBe('/demo');
    expect(screen.getByTestId('site-stage-notice').textContent).toContain('測試模式');
    expect(screen.getByTestId('site-stage-notice').textContent).toContain('示範情境');
  });
});

describe('M1 AC-010 品牌', () => {
  it('AC-010 品牌名集中在 src/content/brand.ts 的單一常數（暫定名，未確認）', () => {
    expect(BRAND.name).toBe('AI 員工外包與導入服務');
    expect(BRAND.nameConfirmed).toBe(false);
  });

  it('AC-010 導覽列與頁尾的品牌名來自 BRAND 常數', () => {
    render(<SiteHeader />);
    expect(screen.getByTestId('brand-name').textContent).toBe(BRAND.name);
    expect(screen.getByRole('link', { name: `${BRAND.name} 首頁` }).getAttribute('href')).toBe('/');
  });

  it('AC-010 品牌名字串沒有在其他檔案重複寫死（方便替換）', () => {
    const files = [
      ...listSourceFiles('app'),
      ...listSourceFiles('src/components'),
      ...listSourceFiles('src/content'),
    ].filter((file) => file !== path.join('src/content', 'brand.ts'));

    const offenders = files.filter((file) => read(file).includes(BRAND.name));
    expect(offenders).toEqual([]);
  });

  it('AC-010 app/layout.tsx 的 title 與 description 改為服務定位', () => {
    const layout = read('app/layout.tsx');
    expect(layout).not.toContain('144 種 AI Agent');
    expect(layout).not.toMatch(/144|Freemium|隨選即用/);
    expect(layout).toContain("from \"@/content/brand\"");
    expect(layout).toMatch(/default:\s*`\$\{BRAND\.name\}/);
    expect(layout).toMatch(/description:\s*BRAND\.description/);
    expect(BRAND.description).toContain('顧問／內訓');
    expect(BRAND.description).toContain('專案建置');
  });

  it('AC-010 首頁路由渲染 HomeContent，並套用含導覽列與頁尾的版型', () => {
    expect(read('app/(site)/page.tsx')).toContain('HomeContent');
    const layout = read('app/(site)/layout.tsx');
    expect(layout).toContain('SiteHeader');
    expect(layout).toContain('SiteFooter');
    expect(layout).toContain('跳至主要內容');
    expect(existsSync(path.join(root, 'app/page.tsx'))).toBe(false);
  });
});
