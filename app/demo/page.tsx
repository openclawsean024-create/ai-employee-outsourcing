import type { Metadata } from 'next';
import DemoWorkbench from '@/components/demo/DemoWorkbench';

export const metadata: Metadata = {
  title: 'AI 員工示範（模擬輸出）',
  description: '示範頁：輸出為模擬內容，未呼叫真實 AI。',
};

export default function DemoPage() {
  return <DemoWorkbench />;
}
