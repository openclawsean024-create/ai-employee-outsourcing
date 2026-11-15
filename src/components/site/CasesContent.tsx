import {
  CASES,
  CASES_EMPTY_LABEL,
  CASES_INTRO,
  DEMO_BADGE_LABEL,
  DEMO_DISCLAIMER,
  REAL_BADGE_LABEL,
  type CaseStudy,
} from '@/content/cases';
import { FOUR_BLANKS, FOUR_BLANKS_TITLE } from '@/content/methodology';
import { SERVICE_PLANS } from '@/content/services';
import { BulletList, Container, CtaLink, PageHeader } from './primitives';

function CaseCard({ item }: { item: CaseStudy }) {
  const headingId = `case-${item.id}-title`;
  const service = SERVICE_PLANS.find((plan) => plan.id === item.relatedServiceId);
  const blankValues = [item.blanks.pillar, item.blanks.kpi, item.blanks.baseline, item.blanks.target];

  return (
    <article
      aria-labelledby={headingId}
      data-testid={`case-${item.id}`}
      data-kind={item.kind}
      className="card-soft p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {item.kind === 'demo' ? (
          <>
            <span className="badge badge-warning" data-testid="case-demo-badge">
              {DEMO_BADGE_LABEL}
            </span>
            <span className="text-body-sm" data-testid="case-demo-disclaimer">
              {DEMO_DISCLAIMER}
            </span>
          </>
        ) : (
          <>
            <span className="badge badge-success" data-testid="case-real-badge">
              {REAL_BADGE_LABEL}
            </span>
            <span className="text-body-sm" data-testid="case-real-source">
              來源：{item.source}
            </span>
          </>
        )}
      </div>

      <h2 id={headingId} className="text-h4">
        {item.title}
      </h2>
      <p className="text-body-sm mt-1">{item.setting}</p>
      <p className="text-body mt-4">{item.challenge}</p>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div>
          <h3 className="site-subheading">進行方式</h3>
          <BulletList items={item.approach} />
        </div>
        <div>
          <h3 className="site-subheading">交付內容</h3>
          <BulletList items={item.deliverables} />
          {service && (
            <p className="text-body-sm mt-3">
              對應方案：<span className="font-semibold text-[var(--navy-800)]">{service.name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-[12px] bg-[var(--navy-50)] p-4">
        <h3 className="site-subheading">{FOUR_BLANKS_TITLE}的填法示範</h3>
        <dl className="grid gap-3 sm:grid-cols-2 mt-2">
          {FOUR_BLANKS.map((blank, index) => (
            <div key={blank.label}>
              <dt className="text-body-sm font-semibold text-[var(--navy-700)]">{blank.label}</dt>
              <dd className="text-body m-0">{blankValues[index]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

/** /cases 案例頁（M1 AC-003）。 */
export default function CasesContent({ cases = CASES }: { cases?: readonly CaseStudy[] }) {
  return (
    <Container>
      <PageHeader eyebrow="案例" title="示範情境" intro={CASES_INTRO} />

      {cases.length === 0 ? (
        <p className="card-soft p-8 text-center text-body" data-testid="cases-empty">
          {CASES_EMPTY_LABEL}
        </p>
      ) : (
        <div className="space-y-6">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <section aria-labelledby="cases-cta" className="site-cta mt-14">
        <h2 id="cases-cta" className="text-h3 text-balance" tabIndex={-1}>
          想知道你的流程適不適合？
        </h2>
        <p className="text-body mt-3 max-w-xl mx-auto text-[var(--navy-600)]">
          先從免費診斷開始，一起把四個空格填起來。
        </p>
        <div className="mt-6">
          <CtaLink href="/contact">預約諮詢</CtaLink>
        </div>
      </section>
    </Container>
  );
}
