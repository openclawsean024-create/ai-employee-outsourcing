import { PRICING_POLICY } from '@/content/pricing';
import { BulletList } from './primitives';

/** 報價方式說明（M1 AC-002）。 */
export default function PricingPolicy({ headingId = 'pricing-policy' }: { headingId?: string }) {
  return (
    <section
      aria-labelledby={headingId}
      data-testid="pricing-policy"
      className="card-soft p-6 md:p-8 bg-[var(--brand-soft)] border-transparent"
    >
      <h2 id={headingId} className="text-h4" tabIndex={-1}>
        {PRICING_POLICY.title}
      </h2>
      <p className="text-body mt-2 font-medium">{PRICING_POLICY.summary}</p>
      <div className="mt-4">
        <BulletList items={PRICING_POLICY.points} />
      </div>
      <p className="text-body-sm mt-4">{PRICING_POLICY.pendingNote}</p>
    </section>
  );
}
