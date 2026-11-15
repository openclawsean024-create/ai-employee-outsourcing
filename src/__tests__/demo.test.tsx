/**
 * M1 AC-009 既有 mock 工作台改為示範頁（/demo）。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DemoNotice, { DEMO_NOTICE_TEXT } from '@/components/demo/DemoNotice';
import DemoWorkbench from '@/components/demo/DemoWorkbench';
import SettingsView from '@/components/views/SettingsView';

const root = process.cwd();

describe('M1 AC-009 示範頁 /demo', () => {
  it('AC-009 示範標示文字為「示範：輸出為模擬內容，未呼叫真實 AI」', () => {
    expect(DEMO_NOTICE_TEXT).toBe('示範：輸出為模擬內容，未呼叫真實 AI');
    render(<DemoNotice />);
    expect(screen.getByTestId('demo-notice').textContent).toContain(DEMO_NOTICE_TEXT);
  });

  it('AC-009 工作台頁首顯示示範標示，且標示排在工作台內容之前', () => {
    const { container } = render(<DemoWorkbench />);
    const notice = screen.getByTestId('demo-notice');
    expect(notice.textContent).toContain('示範：輸出為模擬內容，未呼叫真實 AI');
    expect(container.firstElementChild?.firstElementChild).toBe(notice);
    // 既有工作台仍在：Dashboard hero
    expect(screen.getByText(/AI 員工團隊/)).toBeTruthy();
  });

  it('AC-009 示範標示提供回服務官網的連結', () => {
    render(<DemoNotice />);
    expect(screen.getByRole('link', { name: '回服務官網' }).getAttribute('href')).toBe('/');
  });

  it('AC-009 /demo 路由存在並渲染 DemoWorkbench；首頁不再是工作台', () => {
    const demoPage = path.join(root, 'app/demo/page.tsx');
    expect(existsSync(demoPage)).toBe(true);
    expect(readFileSync(demoPage, 'utf8')).toContain('DemoWorkbench');

    const homeCandidates = ['app/page.tsx', 'app/(site)/page.tsx'].filter((p) =>
      existsSync(path.join(root, p)),
    );
    expect(homeCandidates.length).toBe(1);
    const home = readFileSync(path.join(root, homeCandidates[0]), 'utf8');
    expect(home).not.toContain('useAIEOStore');
    expect(home).not.toContain('DashboardView');
  });

  it('AC-009 設定頁不再宣稱「僅使用平台預載金鑰」，改為如實描述 mock', () => {
    render(<SettingsView />);
    expect(screen.queryByText(/預載金鑰/)).toBeNull();
    expect(screen.getByText(/沒有連接任何 AI 服務/)).toBeTruthy();
    expect(screen.getByText(/所有輸出皆為模擬內容/)).toBeTruthy();
  });
});
