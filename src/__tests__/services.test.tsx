/**
 * M1 AC-001 服務方案頁 /services。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ServicesContent from '@/components/site/ServicesContent';
import { QUOTE_LABEL } from '@/content/pricing';
import { CANDIDATE_LABEL, SERVICE_CATEGORIES, SERVICE_PLANS } from '@/content/services';

const root = process.cwd();

function listSourceFiles(dir: string): string[] {
  const abs = path.join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs).flatMap((entry) => {
    const rel = path.join(dir, entry);
    if (statSync(path.join(root, rel)).isDirectory()) return listSourceFiles(rel);
    return /\.(ts|tsx)$/.test(entry) ? [rel] : [];
  });
}

describe('M1 AC-001 服務方案頁', () => {
  it('AC-001 資料檔至少有「顧問／內訓」「專案建置」兩類方案', () => {
    expect(SERVICE_CATEGORIES.map((c) => c.label)).toEqual(['顧問／內訓', '專案建置']);
    for (const category of SERVICE_CATEGORIES) {
      expect(SERVICE_PLANS.some((plan) => plan.category === category.id)).toBe(true);
    }
  });

  it('AC-001 資料檔每一筆欄位完整（適合對象、交付內容、時程、報價方式）', () => {
    expect(new Set(SERVICE_PLANS.map((p) => p.id)).size).toBe(SERVICE_PLANS.length);
    for (const plan of SERVICE_PLANS) {
      expect(plan.name.trim()).not.toBe('');
      expect(plan.audience.trim()).not.toBe('');
      expect(plan.deliverables.length).toBeGreaterThan(0);
      expect(plan.timeline.text.trim()).not.toBe('');
      expect(plan.pricingBasis.trim()).not.toBe('');
      expect(plan.price).toBeTruthy();
    }
  });

  it('AC-001 資料檔的每一筆方案都被渲染，且四個欄位都顯示', () => {
    render(<ServicesContent />);

    for (const plan of SERVICE_PLANS) {
      const card = screen.getByTestId(`service-${plan.id}`);
      const scoped = within(card);

      expect(scoped.getByRole('heading', { name: plan.name })).toBeTruthy();
      for (const label of ['適合對象', '交付內容', '時程', '報價方式']) {
        expect(scoped.getByText(label)).toBeTruthy();
      }
      expect(card.querySelector('[data-field="audience"]')?.textContent).toBe(plan.audience);
      for (const deliverable of plan.deliverables) {
        expect(scoped.getByText(deliverable)).toBeTruthy();
      }
      expect(card.querySelector('[data-field="timeline"]')?.textContent).toContain(plan.timeline.text);
      expect(card.querySelector('[data-field="pricing-basis"]')?.textContent).toBe(plan.pricingBasis);
      expect(scoped.getByTestId('price-tag').textContent).toBe(QUOTE_LABEL);
    }

    expect(screen.getAllByTestId(/^service-(?!category-|candidate-)/)).toHaveLength(SERVICE_PLANS.length);
  });

  it('AC-001 兩類方案各自成區，方案放在正確的類別下', () => {
    render(<ServicesContent />);
    for (const category of SERVICE_CATEGORIES) {
      const section = screen.getByTestId(`service-category-${category.id}`);
      expect(within(section).getByRole('heading', { name: category.label })).toBeTruthy();
      const expected = SERVICE_PLANS.filter((p) => p.category === category.id);
      expect(section.querySelectorAll('article')).toHaveLength(expected.length);
    }
  });

  it('AC-001 未確認的時程標示「規劃值，待確認」；候選方案標示待確認', () => {
    render(<ServicesContent />);
    for (const plan of SERVICE_PLANS.filter((p) => !p.timeline.confirmed)) {
      const card = screen.getByTestId(`service-${plan.id}`);
      expect(card.querySelector('[data-field="timeline"]')?.textContent).toContain('規劃值，待確認');
    }
    const candidates = SERVICE_PLANS.filter((p) => p.availability === 'candidate');
    expect(candidates.map((p) => p.id)).toEqual(['monthly-maintenance']);
    expect(
      within(screen.getByTestId('service-monthly-maintenance')).getByTestId('service-candidate-badge')
        .textContent,
    ).toBe(CANDIDATE_LABEL);
  });

  it('AC-001 元件內沒有寫死的價格字串（價格只來自 src/content）', () => {
    const files = [...listSourceFiles('src/components/site'), ...listSourceFiles('app/(site)')];
    expect(files.length).toBeGreaterThan(5);
    const offenders: string[] = [];
    for (const file of files) {
      const lines = readFileSync(path.join(root, file), 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (/NT\$|TWD|諮詢後報價|\$\s*\d|\d[\d,]*\s*(元|萬)/.test(line)) {
          offenders.push(`${file}:${index + 1} ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it('AC-001 /services 路由存在並渲染 ServicesContent', () => {
    const page = path.join(root, 'app/(site)/services/page.tsx');
    expect(existsSync(page)).toBe(true);
    expect(readFileSync(page, 'utf8')).toContain('ServicesContent');
  });
});
