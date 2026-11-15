import type { Metadata } from 'next';
import TrainingContent from '@/components/site/TrainingContent';

export const metadata: Metadata = {
  title: '企業內訓',
  description: '基礎、進階與企業三種程度的 AI 內訓課程，可依公司需求包班。',
};

export default function TrainingPage() {
  return <TrainingContent />;
}
