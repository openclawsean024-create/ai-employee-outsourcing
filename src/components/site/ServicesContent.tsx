import Link from 'next/link';
import {
  CANDIDATE_LABEL,
  SERVICE_CATEGORIES,
  plansByCategory,
  type ServicePlan,
} from '@/content/services';
import { CLOSING_CTA } from '@/content/home';
import PricingPolicy from './PricingPolicy';
import {
  BulletList,
  Container,
  CtaLink,
  PageHeader,
  PriceTag,
  SectionHeading,
  TimelineText,
} from './primitives';

function ServiceCard({ plan }: { plan: ServicePlan }) {
  const headingId = `service-${plan.id}-title`;
  return (
    <article
      aria-labelledby={headingId}
      data-testid={`service-${plan.id}`}
      data-category={plan.category}
      className="card-soft p-6 flex flex-col"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {plan.ladderStep !== null && (
          <span className="badge badge-brand">階段 {plan.ladderStep}</span>
        )}
        {plan.availability === 'candidate' && (
          <span className="badge badge-warning" data-testid="service-candidate-badge">
            {CANDIDATE_LABEL}
          </span>
        )}
      </div>
      <h3 id={headingId} className="text-h4">
        {plan.name}
      </h3>
      <p className="text-body mt-2 text-[var(--navy-600)]">{plan.summary}</p>

      <dl className="site-dl mt-5">
        <div>
          <dt>適合對象</dt>
          <dd data-field="audience">{plan.audience}</dd>
        </div>
        <div>
          <dt>交付內容</dt>
          <dd data-field="deliverables">
            <BulletList items={plan.deliverables} />
          </dd>
        </div>
        <div>
          <dt>時程</dt>
          <dd data-field="timeline">
            <TimelineText timeline={plan.timeline} />
          </dd>
        </div>
        <div>
          <dt>報價方式</dt>
          <dd data-field="pricing">
            <span data-field="pricing-basis">{plan.pricingBasis}</span>
            <span aria-hidden="true"> · </span>
            <PriceTag price={plan.price} />
          </dd>
        </div>
      </dl>

      {plan.href && (
        <Link href={plan.href} className="site-link mt-4 inline-block">
          了解{plan.name}
        </Link>
      )}
    </article>
  );
}

/** /services 服務方案頁（M1 AC-001、AC-002）。 */
export default function ServicesContent() {
  return (
    <Container>
      <PageHeader
        eyebrow="服務方案"
        title="顧問／內訓與專案建置"
        intro="從一次諮詢到單一流程的自動化專案，挑現在需要的階段開始。每個方案都列出適合對象、交付內容、時程與報價方式。"
      />

      <div className="space-y-14">
        {SERVICE_CATEGORIES.map((category) => {
          const plans = plansByCategory(category.id);
          return (
            <section
              key={category.id}
              aria-labelledby={`category-${category.id}`}
              data-testid={`service-category-${category.id}`}
            >
              <SectionHeading
                id={`category-${category.id}`}
                title={category.label}
                intro={category.summary}
              />
              <div className="grid gap-5 md:grid-cols-2">
                {plans.map((plan) => (
                  <ServiceCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>
          );
        })}

        <PricingPolicy />

        <section aria-labelledby="services-cta" className="site-cta">
          <h2 id="services-cta" className="text-h3 text-balance" tabIndex={-1}>
            {CLOSING_CTA.title}
          </h2>
          <p className="text-body mt-3 max-w-xl mx-auto text-[var(--navy-600)]">{CLOSING_CTA.body}</p>
          <div className="mt-6">
            <CtaLink href={CLOSING_CTA.primaryCta.href}>{CLOSING_CTA.primaryCta.label}</CtaLink>
          </div>
        </section>
      </div>
    </Container>
  );
}
