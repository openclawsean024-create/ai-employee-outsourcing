/**
 * M1 AC-006 內訓課程介紹頁 /training。
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TrainingContent from '@/components/site/TrainingContent';
import { parseInquiryType } from '@/content/contact';
import {
  CORPORATE_PACKAGE,
  COURSE_LEVELS,
  COURSES,
  EXTERNAL_MATERIAL_PLACEHOLDER,
  TRAINING_CTA,
} from '@/content/training';

const root = process.cwd();

describe('M1 AC-006 內訓課程介紹頁', () => {
  it('AC-006 基礎／進階／企業三種程度都被渲染', () => {
    render(<TrainingContent />);
    expect(COURSE_LEVELS.map((l) => l.label)).toEqual(['基礎', '進階', '企業']);

    for (const level of COURSE_LEVELS) {
      const card = screen.getByTestId(`training-level-${level.id}`);
      expect(within(card).getByRole('heading', { name: `${level.label}課程` })).toBeTruthy();
      expect(card.textContent).toContain(level.summary);
      expect(card.textContent).toContain(level.audience);
    }
  });

  it('AC-006 資料檔的每一張課程卡都被渲染在對應程度下', () => {
    render(<TrainingContent />);
    for (const course of COURSES) {
      const levelCard = screen.getByTestId(`training-level-${course.level}`);
      const card = within(levelCard).getByTestId(`course-${course.id}`);
      expect(card.textContent).toContain(course.title);
      expect(card.textContent).toContain(course.description);
    }
    for (const level of COURSE_LEVELS) {
      expect(COURSES.some((c) => c.level === level.id)).toBe(true);
    }
  });

  it('AC-006 企業包班形式被渲染', () => {
    render(<TrainingContent />);
    const section = screen.getByTestId('training-corporate');
    expect(within(section).getByRole('heading', { name: '企業包班' })).toBeTruthy();
    for (const feature of CORPORATE_PACKAGE.features) {
      expect(within(section).getByText(feature)).toBeTruthy();
    }
  });

  it('AC-006 內訓 CTA 連到 /contact 並帶 type=training（預選「內訓」）', () => {
    render(<TrainingContent />);
    const cta = screen.getByTestId('training-cta');
    const href = cta.getAttribute('href') ?? '';
    expect(cta.tagName).toBe('A');
    expect(href).toBe(TRAINING_CTA.href);
    expect(href.startsWith('/contact')).toBe(true);
    expect(href).toContain('type=training');

    const type = new URLSearchParams(href.split('?')[1]).get('type');
    expect(parseInquiryType(type)).toBe('training');
  });

  it('AC-006 「企業 AI 導入教材整合中」占位區塊存在，並指向待整合的外部教材', () => {
    render(<TrainingContent />);
    const placeholder = screen.getByTestId('training-external-placeholder');
    expect(within(placeholder).getByRole('heading', { name: '企業 AI 導入教材整合中' })).toBeTruthy();
    expect(placeholder.getAttribute('data-status')).toBe('pending');
    expect(placeholder.textContent).toContain('sean0407/enterprise-ai-adoption-course');
    expect(placeholder.textContent).toContain('待 Sean 提供');
    // 占位區塊只有說明，沒有任何課綱列表或連結
    expect(placeholder.querySelectorAll('li, a')).toHaveLength(0);
  });

  it('AC-006 沒有自行撰寫外部教材的課綱：課程皆標示課綱待提供', () => {
    expect(EXTERNAL_MATERIAL_PLACEHOLDER.status).toBe('pending');
    expect(Object.keys(EXTERNAL_MATERIAL_PLACEHOLDER).sort()).toEqual(
      ['body', 'reference', 'referenceLabel', 'status', 'title'].sort(),
    );
    for (const course of COURSES) {
      expect(course.syllabusStatus).toBe('pending');
      expect(Object.keys(course)).not.toContain('syllabus');
      expect(Object.keys(course)).not.toContain('lessons');
    }
    render(<TrainingContent />);
    expect(screen.getAllByTestId('course-syllabus-pending')).toHaveLength(COURSES.length);
  });

  it('AC-006 /training 路由存在並渲染 TrainingContent', () => {
    const page = path.join(root, 'app/(site)/training/page.tsx');
    expect(existsSync(page)).toBe(true);
    expect(readFileSync(page, 'utf8')).toContain('TrainingContent');
  });
});
