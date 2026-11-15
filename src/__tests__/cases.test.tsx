/**
 * M1 AC-003 案例頁（示範情境）/cases。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import CasesContent from '@/components/site/CasesContent';
import { CASES, validateCases, type CaseStudy } from '@/content/cases';
import { SERVICE_PLANS } from '@/content/services';

const root = process.cwd();

const base = {
  title: '測試用案例',
  setting: '測試情境',
  challenge: '測試問題',
  approach: ['步驟'],
  deliverables: ['交付'],
  relatedServiceId: 'automation-project',
  blanks: { pillar: '降低成本與時間', kpi: '指標', baseline: '基準', target: '目標' },
};

describe('M1 AC-003 案例頁（示範情境）', () => {
  it('AC-003 每筆案例都有 kind: demo | real', () => {
    expect(CASES.length).toBeGreaterThan(0);
    for (const item of CASES) {
      expect(['demo', 'real']).toContain(item.kind);
    }
  });

  it('AC-003 M1 沒有真實案例：全部為 demo', () => {
    expect(CASES.every((item) => item.kind === 'demo')).toBe(true);
  });

  it('AC-003 不存在缺少同意欄位或來源的 real 案例', () => {
    expect(validateCases(CASES)).toEqual([]);
    for (const item of CASES) {
      if (item.kind === 'real') {
        expect(item.consentConfirmedBySean).toBe(true);
        expect(item.source.trim()).not.toBe('');
      }
    }
  });

  it('AC-003 validateCases 會擋下缺少 consentConfirmedBySean 或來源的 real 案例', () => {
    expect(validateCases([{ ...base, id: 'r1', kind: 'real', source: '同意書' }])).toEqual([
      'r1：real 案例缺少 consentConfirmedBySean: true',
    ]);
    expect(
      validateCases([{ ...base, id: 'r2', kind: 'real', consentConfirmedBySean: false, source: '同意書' }]),
    ).toEqual(['r2：real 案例缺少 consentConfirmedBySean: true']);
    expect(
      validateCases([{ ...base, id: 'r3', kind: 'real', consentConfirmedBySean: true, source: ' ' }]),
    ).toEqual(['r3：real 案例缺少來源欄位']);
    expect(validateCases([{ ...base, id: 'r4', kind: 'testimonial' }])).toEqual([
      "r4：kind 必須是 'demo' 或 'real'",
    ]);
    expect(
      validateCases([{ ...base, id: 'r5', kind: 'real', consentConfirmedBySean: true, source: '同意書' }]),
    ).toEqual([]);
  });

  it('AC-003 每個 demo 卡片都顯示「示範情境」徽章與「非真實客戶案例」說明', () => {
    render(<CasesContent />);
    const demoCases = CASES.filter((item) => item.kind === 'demo');
    expect(demoCases.length).toBe(CASES.length);

    for (const item of demoCases) {
      const card = screen.getByTestId(`case-${item.id}`);
      expect(card.getAttribute('data-kind')).toBe('demo');
      expect(within(card).getByTestId('case-demo-badge').textContent).toBe('示範情境');
      expect(within(card).getByTestId('case-demo-disclaimer').textContent).toBe('非真實客戶案例');
      expect(within(card).getByRole('heading', { name: item.title })).toBeTruthy();
    }
    expect(screen.getAllByTestId('case-demo-badge')).toHaveLength(demoCases.length);
  });

  it('AC-003 頁面說明這些不是實際客戶、不代表成效保證', () => {
    render(<CasesContent />);
    expect(screen.getByText(/不是實際客戶，也不代表任何成效保證/)).toBeTruthy();
  });

  it('AC-003 示範情境不含客戶名稱稱謂、成效數字或推薦語', () => {
    for (const item of CASES) {
      const text = JSON.stringify(item);
      expect(text).not.toMatch(/\d+\s*(%|％|倍|小時|萬|元)/);
      expect(text).not.toMatch(/股份有限公司|有限公司|推薦|見證|好評/);
      expect(item.setting).toContain('虛構情境');
      expect(item.blanks.baseline).not.toMatch(/\d/);
      expect(item.blanks.target).not.toMatch(/\d/);
    }
  });

  it('AC-003 每筆案例對應到 services.ts 既有的方案', () => {
    const ids = SERVICE_PLANS.map((plan) => plan.id);
    for (const item of CASES) {
      expect(ids).toContain(item.relatedServiceId);
    }
  });

  it('AC-003 沒有案例時顯示「案例整理中」', () => {
    render(<CasesContent cases={[]} />);
    expect(screen.getByTestId('cases-empty').textContent).toBe('案例整理中');
  });

  it('AC-003 real 案例（已確認同意）顯示來源、不顯示示範徽章', () => {
    const real: CaseStudy = {
      ...base,
      id: 'real-fixture',
      kind: 'real',
      consentConfirmedBySean: true,
      source: '測試用來源（非真實）',
    };
    render(<CasesContent cases={[real]} />);
    const card = screen.getByTestId('case-real-fixture');
    expect(within(card).queryByTestId('case-demo-badge')).toBeNull();
    expect(within(card).getByTestId('case-real-source').textContent).toContain('測試用來源（非真實）');
  });

  it('AC-003 /cases 路由存在並渲染 CasesContent', () => {
    const page = path.join(root, 'app/(site)/cases/page.tsx');
    expect(existsSync(page)).toBe(true);
    expect(readFileSync(page, 'utf8')).toContain('CasesContent');
  });
});
