import type { Metadata } from 'next';
import ContactContent from '@/components/site/ContactContent';

export const metadata: Metadata = {
  title: '預約諮詢',
  description: '預約免費診斷。目前為測試模式，表單資料不會送出或儲存。',
};

export default function ContactPage() {
  return <ContactContent />;
}
