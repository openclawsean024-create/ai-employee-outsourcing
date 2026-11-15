import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatPrice, type Price } from '@/content/pricing';
import { TIMELINE_PENDING_LABEL, type Timeline } from '@/content/types';

/** 服務官網共用的小元件。價格與時程文字一律來自 src/content。 */

export function Container({
  children,
  narrow = false,
  className = '',
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return (
    <div className={`site-container ${narrow ? 'site-container-narrow' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="pt-12 pb-8 md:pt-16 md:pb-10 max-w-3xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-h1 text-balance">{title}</h1>
      {intro && <p className="text-body-lg mt-4 text-pretty">{intro}</p>}
    </header>
  );
}

export function SectionHeading({
  id,
  title,
  intro,
}: {
  id: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl mb-8">
      <h2 id={id} className="text-h3 text-balance" tabIndex={-1}>
        {title}
      </h2>
      {intro && <p className="text-body mt-3 text-[var(--navy-600)] text-pretty">{intro}</p>}
    </div>
  );
}

/** 價格顯示：文字一律由 src/content/pricing.ts 的 formatPrice 產生。 */
export function PriceTag({ price, className = '' }: { price: Price; className?: string }) {
  return (
    <span
      data-testid="price-tag"
      data-price-kind={price.kind}
      data-currency={price.currency}
      className={`font-semibold text-[var(--navy-900)] ${className}`}
    >
      {formatPrice(price)}
    </span>
  );
}

/** 時程顯示：未確認的規劃值會加註「規劃值，待確認」。 */
export function TimelineText({ timeline }: { timeline: Timeline }) {
  return (
    <span data-testid="timeline" data-confirmed={timeline.confirmed}>
      {timeline.text}
      {!timeline.confirmed && (
        <span className="text-[var(--navy-500)]">（{TIMELINE_PENDING_LABEL}）</span>
      )}
    </span>
  );
}

export function CtaLink({
  href,
  children,
  variant = 'primary',
  testId,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  testId?: string;
}) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className={`btn btn-lg ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
    >
      {children}
    </Link>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="site-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
