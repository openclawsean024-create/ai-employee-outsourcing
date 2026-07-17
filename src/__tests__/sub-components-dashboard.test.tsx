import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DashboardFooter from '@/components/views/dashboard/DashboardFooter';
import DashboardPricing from '@/components/views/dashboard/DashboardPricing';
import { TIER_LIMITS } from '@/lib/utils';
import type { View } from '@/lib/types';

describe('DashboardPricing', () => {
  it('renders all four PRD-defined plans from the shared tier source', () => {
    render(<DashboardPricing currentTier="free" onNavigate={() => {}} />);

    for (const label of ['免費版', 'KOL 版', 'Pro 版', '企業版']) {
      expect(screen.getByText(label)).toBeTruthy();
    }

    for (const price of Object.values(TIER_LIMITS).map((tier) => tier.price)) {
      expect(screen.getByText(price)).toBeTruthy();
    }
  });

  it('marks the current tier and Pro recommendation truthfully', () => {
    render(<DashboardPricing currentTier="kol" onNavigate={() => {}} />);

    const currentPlan = screen.getByTestId('pricing-kol');
    expect(currentPlan.getAttribute('data-current')).toBe('true');
    expect(currentPlan.textContent).toContain('目前方案');
    expect(screen.getByTestId('pricing-pro').textContent).toContain('最多人選擇');
  });

  it('routes a paid-plan CTA to Settings instead of simulating checkout', () => {
    let view: View | null = null;
    render(<DashboardPricing currentTier="free" onNavigate={(next) => { view = next; }} />);

    fireEvent.click(screen.getByRole('button', { name: '查看 Pro 版方案' }));
    expect(view).toBe('settings');
  });

  it('keeps the visible current-plan CTA as its accessible name', () => {
    render(<DashboardPricing currentTier="pro" onNavigate={() => {}} />);

    expect(screen.getByRole('button', { name: '管理目前方案' })).toBeTruthy();
  });
});

describe('DashboardFooter', () => {
  it('shows an honest Beta and local-first limitation', () => {
    render(<DashboardFooter onNavigate={() => {}} />);

    expect(screen.getByText(/AI Employee Beta/)).toBeTruthy();
    expect(screen.getByText(/瀏覽器本機/)).toBeTruthy();
  });

  it.each([
    ['Agent 庫', 'agents'],
    ['建立任務', 'task_new'],
    ['用量', 'usage'],
    ['設定', 'settings'],
  ] as const)('routes %s to %s', (label, expected) => {
    let view: View | null = null;
    render(<DashboardFooter onNavigate={(next) => { view = next; }} />);

    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(view).toBe(expected);
  });
});
