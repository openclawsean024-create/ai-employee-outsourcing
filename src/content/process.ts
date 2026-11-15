/**
 * 5 步導入流程（M1 AC-007）。
 * 搬自 ai-landing-specialist@8e0625e:index.html「導入流程」區塊。
 * 時程數字為原頁面的規劃值，尚未經 Sean 確認（confirmed: false）。
 */
import type { ContentSource, Timeline } from './types';

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: Timeline;
}

export const PROCESS_SOURCE: ContentSource = 'ai-landing-specialist@8e0625e';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: '免費診斷',
    description: '線上會議，了解業務、痛點與現有工具。',
    duration: { text: '30 分鐘', confirmed: false },
  },
  {
    step: 2,
    title: '業務審計',
    description: '深度訪談與流程盤點，產出書面審計報告。',
    duration: { text: '7–14 天', confirmed: false },
  },
  {
    step: 3,
    title: '方案設計',
    description: '選工具、設計提示詞、規劃工作流、定義 KPI。',
    duration: { text: '3–5 天', confirmed: false },
  },
  {
    step: 4,
    title: 'PoC 與部署',
    description: '以 Claude／ChatGPT API 搭配 Make／Zapier／n8n，接上實際系統並部署上線。',
    duration: { text: '14–30 天', confirmed: false },
  },
  {
    step: 5,
    title: '培訓與迭代',
    description: '教團隊監督、接手與調整提示詞，並定期回報成效。',
    duration: { text: '持續進行', confirmed: false },
  },
];
