import Link from 'next/link';
import { BRAND } from '@/content/brand';
import { FAQ_ITEMS } from '@/content/faq';
import {
  CLOSING_CTA,
  HERO,
  PAIN_POINTS,
  PAIN_POINTS_HEADING,
  PAIN_POINTS_INTRO,
  PAIN_POINTS_NOTE,
} from '@/content/home';
import {
  FOUR_BLANKS,
  FOUR_BLANKS_INTRO,
  FOUR_BLANKS_TITLE,
  PILLARS,
} from '@/content/methodology';
import { QUOTE_LABEL } from '@/content/pricing';
import { PROCESS_STEPS } from '@/content/process';
import { SERVICE_CATEGORIES, plansByCategory } from '@/content/services';
import { BulletList, Container, CtaLink, SectionHeading, TimelineText } from './primitives';

function Hero() {
  return (
    <section aria-labelledby="hero-title" data-testid="home-hero" className="site-hero">
      <Container>
        <div className="max-w-3xl py-16 md:py-24">
          <p className="eyebrow mb-4">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="text-display text-balance">
            {HERO.titleLead}
            <br />
            <span className="text-[var(--brand)]">{HERO.titleEmphasis}</span>
          </h1>
          <p className="text-body-lg mt-6 max-w-2xl text-pretty">{HERO.lede}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <CtaLink href={HERO.primaryCta.href}>{HERO.primaryCta.label}</CtaLink>
            <CtaLink href={HERO.secondaryCta.href} variant="secondary">
              {HERO.secondaryCta.label}
            </CtaLink>
          </div>
          <p className="text-body-sm mt-6">
            {BRAND.name}｜服務對象：{BRAND.audience}
          </p>
        </div>
      </Container>
    </section>
  );
}

function PainPoints() {
  return (
    <section aria-labelledby="pain" data-testid="home-pain-points" className="site-section">
      <Container>
        <SectionHeading id="pain" title={PAIN_POINTS_HEADING} intro={PAIN_POINTS_INTRO} />
        <ul className="grid gap-5 md:grid-cols-3 list-none p-0 m-0">
          {PAIN_POINTS.map((point) => (
            <li key={point.id} data-testid={`pain-${point.id}`} className="card-soft p-6">
              <h3 className="text-h4">{point.title}</h3>
              <p className="text-body mt-3 text-[var(--navy-600)]">{point.description}</p>
            </li>
          ))}
        </ul>
        <p className="text-body-sm mt-4" data-testid="pain-points-note">
          {PAIN_POINTS_NOTE}
        </p>
      </Container>
    </section>
  );
}

function ServicesOverview() {
  return (
    <section
      aria-labelledby="services-overview"
      data-testid="home-services"
      className="site-section site-section-alt"
    >
      <Container>
        <SectionHeading
          id="services-overview"
          title="兩種合作方式"
          intro={`依你現在的階段選擇。所有方案目前一律「${QUOTE_LABEL}」。`}
        />
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICE_CATEGORIES.map((category) => (
            <article key={category.id} className="card-soft p-6">
              <h3 className="text-h4">{category.label}</h3>
              <p className="text-body mt-2 text-[var(--navy-600)]">{category.summary}</p>
              <div className="mt-4">
                <BulletList items={plansByCategory(category.id).map((plan) => plan.name)} />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/services" className="site-link">
            查看完整服務方案與報價方式
          </Link>
        </p>
      </Container>
    </section>
  );
}

function Methodology() {
  return (
    <section aria-labelledby="methodology" data-testid="home-methodology" className="site-section">
      <Container>
        <SectionHeading
          id="methodology"
          title="三個板塊，涵蓋 AI 自動化的切入點"
          intro={FOUR_BLANKS_INTRO}
        />
        <ol className="grid gap-5 md:grid-cols-3 list-none p-0 m-0">
          {PILLARS.map((pillar, index) => (
            <li key={pillar.id} data-testid={`pillar-${pillar.id}`} className="card-soft p-6">
              <p className="site-step-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="text-h4 mt-2">{pillar.title}</h3>
              <p className="text-body mt-2 text-[var(--navy-600)]">{pillar.description}</p>
              <div className="mt-4">
                <BulletList items={pillar.examples} />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[12px] bg-[var(--navy-900)] text-white p-6 md:p-8" data-testid="four-blanks">
          <h3 className="text-[18px] font-bold m-0 text-white">「{FOUR_BLANKS_TITLE}」</h3>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 mt-5 mb-0">
            {FOUR_BLANKS.map((blank) => (
              <li key={blank.label} data-testid="blank">
                <p className="text-[13px] font-semibold opacity-70 m-0">空格 {blank.order}</p>
                <p className="text-[18px] font-bold mt-1 mb-0">{blank.label}</p>
                <p className="text-[14px] leading-relaxed opacity-80 mt-1 mb-0">{blank.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function Process() {
  return (
    <section
      aria-labelledby="process"
      data-testid="home-process"
      className="site-section site-section-alt"
    >
      <Container>
        <SectionHeading id="process" title="導入流程：5 個步驟" />
        <ol className="site-process list-none p-0 m-0">
          {PROCESS_STEPS.map((step) => (
            <li key={step.step} data-testid="process-step" className="card-soft p-5">
              <p className="site-step-num" aria-hidden="true">
                {step.step}
              </p>
              <h3 className="text-[18px] font-bold text-[var(--navy-900)] mt-2 mb-0">
                <span className="sr-only">步驟 {step.step}：</span>
                {step.title}
              </h3>
              <p className="text-body-sm mt-2">{step.description}</p>
              <p className="text-body-sm mt-3 font-medium text-[var(--navy-800)]">
                <TimelineText timeline={step.duration} />
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq" data-testid="home-faq" className="site-section">
      <Container narrow>
        <SectionHeading id="faq" title="常見問題" />
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <details key={item.id} className="site-faq" data-testid="faq-item" open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ClosingCta() {
  return (
    <section aria-labelledby="home-cta" data-testid="home-cta" className="site-section">
      <Container narrow>
        <div className="site-cta">
          <h2 id="home-cta" className="text-h3 text-balance" tabIndex={-1}>
            {CLOSING_CTA.title}
          </h2>
          <p className="text-body mt-3 max-w-xl mx-auto text-[var(--navy-600)]">{CLOSING_CTA.body}</p>
          <div className="mt-6">
            <CtaLink href={CLOSING_CTA.primaryCta.href} testId="home-cta-link">
              {CLOSING_CTA.primaryCta.label}
            </CtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** / 服務官網首頁（M1 AC-010）：hero、痛點、方法論、導入流程、FAQ、CTA。 */
export default function HomeContent() {
  return (
    <>
      <Hero />
      <PainPoints />
      <ServicesOverview />
      <Methodology />
      <Process />
      <Faq />
      <ClosingCta />
    </>
  );
}
