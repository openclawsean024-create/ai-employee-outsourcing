import {
  CORPORATE_PACKAGE,
  COURSE_LEVELS,
  COURSES,
  EXTERNAL_MATERIAL_PLACEHOLDER,
  SYLLABUS_PENDING_LABEL,
  TRAINING_CTA,
  type Course,
} from '@/content/training';
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

function formatDuration(minutes: number | null): string {
  if (minutes === null) return '時長待確認';
  return minutes % 60 === 0 ? `${minutes / 60} 小時` : `${minutes} 分鐘`;
}

function CourseCard({ course }: { course: Course }) {
  return (
    <li data-testid={`course-${course.id}`} className="rounded-[12px] bg-[var(--navy-50)] p-4">
      <p className="font-semibold text-[var(--navy-900)] m-0">{course.title}</p>
      <p className="text-body-sm mt-1">{course.description}</p>
      <dl className="site-dl-inline mt-3">
        <div>
          <dt>時長</dt>
          <dd>{formatDuration(course.durationMinutes)}</dd>
        </div>
        <div>
          <dt>報價方式</dt>
          <dd>
            <PriceTag price={course.price} />
          </dd>
        </div>
      </dl>
      {course.syllabusStatus === 'pending' && (
        <p className="text-body-sm mt-2" data-testid="course-syllabus-pending">
          {SYLLABUS_PENDING_LABEL}
        </p>
      )}
    </li>
  );
}

/** /training 內訓課程介紹頁（M1 AC-006）。 */
export default function TrainingContent() {
  return (
    <Container>
      <PageHeader
        eyebrow="企業內訓"
        title="讓團隊學會自己用 AI"
        intro="課程分為基礎、進階與企業三種程度，可以依公司需求以包班形式進行。課程內容會結合實際的導入流程，而不是只教工具操作。"
      />

      <div className="space-y-14">
        <section aria-labelledby="training-levels">
          <SectionHeading id="training-levels" title="課程程度" />
          <div className="grid gap-5 md:grid-cols-3">
            {COURSE_LEVELS.map((level) => {
              const courses = COURSES.filter((course) => course.level === level.id);
              return (
                <article
                  key={level.id}
                  data-testid={`training-level-${level.id}`}
                  aria-labelledby={`level-${level.id}`}
                  className="card-soft p-6"
                >
                  <span className="badge badge-brand mb-3">{level.label}</span>
                  <h3 id={`level-${level.id}`} className="text-h4">
                    {level.label}課程
                  </h3>
                  <p className="text-body mt-2 text-[var(--navy-600)]">{level.summary}</p>
                  <p className="text-body-sm mt-3">
                    <span className="font-semibold text-[var(--navy-700)]">適合對象：</span>
                    {level.audience}
                  </p>
                  <ul className="list-none p-0 mt-4 space-y-3">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="training-corporate" data-testid="training-corporate">
          <SectionHeading
            id="training-corporate"
            title={CORPORATE_PACKAGE.title}
            intro={CORPORATE_PACKAGE.summary}
          />
          <div className="card-soft p-6 md:p-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="site-subheading">包班形式</h3>
              <BulletList items={CORPORATE_PACKAGE.features} />
            </div>
            <dl className="site-dl">
              <div>
                <dt>適合對象</dt>
                <dd>{CORPORATE_PACKAGE.audience}</dd>
              </div>
              <div>
                <dt>時程</dt>
                <dd>
                  <TimelineText timeline={CORPORATE_PACKAGE.timeline} />
                </dd>
              </div>
              <div>
                <dt>報價方式</dt>
                <dd>
                  {CORPORATE_PACKAGE.pricingBasis}
                  <span aria-hidden="true"> · </span>
                  <PriceTag price={CORPORATE_PACKAGE.price} />
                </dd>
              </div>
            </dl>
            <div className="md:col-span-2">
              <CtaLink href={TRAINING_CTA.href} testId="training-cta">
                {TRAINING_CTA.label}
              </CtaLink>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="training-external"
          data-testid="training-external-placeholder"
          data-status={EXTERNAL_MATERIAL_PLACEHOLDER.status}
          className="rounded-[12px] border border-dashed border-[var(--navy-300)] p-6 md:p-8"
        >
          <span className="badge badge-neutral mb-3">整合中</span>
          <h2 id="training-external" className="text-h4" tabIndex={-1}>
            {EXTERNAL_MATERIAL_PLACEHOLDER.title}
          </h2>
          <p className="text-body mt-2 text-[var(--navy-600)] max-w-2xl">
            {EXTERNAL_MATERIAL_PLACEHOLDER.body}
          </p>
          <p className="text-body-sm mt-3">
            {EXTERNAL_MATERIAL_PLACEHOLDER.referenceLabel}：
            <code className="site-code">{EXTERNAL_MATERIAL_PLACEHOLDER.reference}</code>
          </p>
        </section>

        <PricingPolicy headingId="training-pricing-policy" />
      </div>
    </Container>
  );
}
