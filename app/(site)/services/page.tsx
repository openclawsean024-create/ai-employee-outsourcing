import type { Metadata } from 'next';
import ServicesContent from '@/components/site/ServicesContent';

export const metadata: Metadata = {
  title: '服務方案',
  description: '顧問／內訓與專案建置的服務方案：適合對象、交付內容、時程與報價方式。',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
