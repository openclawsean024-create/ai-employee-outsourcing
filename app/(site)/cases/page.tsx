import type { Metadata } from 'next';
import CasesContent from '@/components/site/CasesContent';

export const metadata: Metadata = {
  title: '案例（示範情境）',
  description: '以示範情境說明服務會怎麼進行；非真實客戶案例。',
};

export default function CasesPage() {
  return <CasesContent />;
}
