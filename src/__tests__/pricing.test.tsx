/**
 * M1 AC-002 報價方式整合：單一型別、幣別一律 TWD（NT$），未定價顯示「諮詢後報價」。
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingPolicy from '@/components/site/PricingPolicy';
import ServicesContent from '@/components/site/ServicesContent';
import TrainingContent from '@/components/site/TrainingContent';
import {
  PRICE_KINDS,
  PRICING_POLICY,
  QUOTE_LABEL,
  QUOTE_PRICE,
  formatPrice,
  isValidPrice,
  type Price,
} from '@/content/pricing';
import { SERVICE_PLANS } from '@/content/services';
import { CORPORATE_PACKAGE, COURSES } from '@/content/training';

const root = process.cwd();

const ALL_PRICES: Array<{ label: string; price: Price }> = [
  ...SERVICE_PLANS.map((plan) => ({ label: `service:${plan.id}`, price: plan.price })),
  ...COURSES.map((course) => ({ label: `course:${course.id}`, price: course.price })),
  { label: 'corporate-package', price: CORPORATE_PACKAGE.price },
];

describe('M1 AC-002 報價方式整合', () => {
  it.each(ALL_PRICES)('AC-002 $label 的 currency 為 TWD 且 kind 合法', ({ price }) => {
    expect(price.currency).toBe('TWD');
    expect(PRICE_KINDS).toContain(price.kind);
    expect(isValidPrice(price)).toBe(true);
  });

  it('AC-002 Sean 尚未提供數字：所有方案一律 kind: quote', () => {
    for (const { price } of ALL_PRICES) {
      expect(price.kind).toBe('quote');
    }
  });

  it('AC-002 quote 顯示「諮詢後報價」；fixed／range 以 NT$ 顯示', () => {
    expect(QUOTE_LABEL).toBe('諮詢後報價');
    expect(formatPrice(QUOTE_PRICE)).toBe('諮詢後報價');
    expect(formatPrice({ kind: 'fixed', currency: 'TWD', amount: 12000, unit: 'session' })).toBe(
      'NT$ 12,000／場',
    );
    expect(
      formatPrice({ kind: 'range', currency: 'TWD', min: 1000, max: 2500, unit: 'hour' }),
    ).toBe('NT$ 1,000 – NT$ 2,500／小時');
  });

  it('AC-002 isValidPrice 會擋下非 TWD 幣別與不合法的 kind', () => {
    expect(isValidPrice({ kind: 'quote', currency: 'US' + 'D' } as unknown as Price)).toBe(false);
    expect(isValidPrice({ kind: 'free', currency: 'TWD' } as unknown as Price)).toBe(false);
    expect(
      isValidPrice({ kind: 'range', currency: 'TWD', min: 500, max: 100, unit: 'hour' }),
    ).toBe(false);
  });

  it('AC-002 /services 畫面上的每個價格都是「諮詢後報價」、幣別 TWD', () => {
    render(<ServicesContent />);
    const tags = screen.getAllByTestId('price-tag');
    expect(tags).toHaveLength(SERVICE_PLANS.length);
    for (const tag of tags) {
      expect(tag.textContent).toBe('諮詢後報價');
      expect(tag.getAttribute('data-currency')).toBe('TWD');
    }
  });

  it('AC-002 /training 畫面上的每個價格都是「諮詢後報價」', () => {
    render(<TrainingContent />);
    const tags = screen.getAllByTestId('price-tag');
    expect(tags).toHaveLength(COURSES.length + 1);
    for (const tag of tags) {
      expect(tag.textContent).toBe('諮詢後報價');
    }
  });

  it('AC-002 頁面有一段報價方式說明', () => {
    render(<PricingPolicy />);
    const policy = screen.getByTestId('pricing-policy');
    expect(policy.textContent).toContain('報價方式');
    expect(policy.textContent).toContain('諮詢後報價');
    expect(policy.textContent).toContain('NT$');
    for (const point of PRICING_POLICY.points) {
      expect(policy.textContent).toContain(point);
    }
  });

  it('AC-002 /services 與 /training 都帶有報價方式說明', () => {
    const { unmount } = render(<ServicesContent />);
    expect(screen.getByTestId('pricing-policy')).toBeTruthy();
    unmount();
    render(<TrainingContent />);
    expect(screen.getByTestId('pricing-policy')).toBeTruthy();
  });

  it('AC-002 src/content 沒有外幣或寫死的金額（等同 grep -rnE "USD|\\$[0-9]" src/content 無輸出）', () => {
    const dir = path.join(root, 'src/content');
    const offenders: string[] = [];
    for (const file of readdirSync(dir)) {
      readFileSync(path.join(dir, file), 'utf8')
        .split('\n')
        .forEach((line, index) => {
          if (/USD|\$[0-9]/.test(line)) offenders.push(`${file}:${index + 1} ${line.trim()}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
