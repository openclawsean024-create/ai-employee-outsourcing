'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CONTACT_COPY, parseInquiryType } from '@/content/contact';
import ContactForm from './ContactForm';
import { Container, PageHeader } from './primitives';

/** 讀取網址的 ?type= 參數並預選需求類型（例如 /contact?type=training → 內訓）。 */
function ContactFormFromQuery() {
  const params = useSearchParams();
  const initialType = parseInquiryType(params.get('type'));
  return <ContactForm key={initialType} initialType={initialType} />;
}

/** /contact 預約諮詢頁（M1 AC-004、AC-005）。 */
export default function ContactContent() {
  return (
    <Container narrow>
      <PageHeader eyebrow="預約諮詢" title={CONTACT_COPY.title} intro={CONTACT_COPY.intro} />
      <Suspense fallback={<ContactForm />}>
        <ContactFormFromQuery />
      </Suspense>
    </Container>
  );
}
