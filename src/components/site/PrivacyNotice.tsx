import { PRIVACY_NOTICE } from '@/content/privacy-notice';

/** 個資蒐集告知（M1 AC-005）。顯示在預約表單上方。 */
export default function PrivacyNotice({ id = 'privacy-notice' }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-testid="privacy-notice"
      className="rounded-[12px] bg-[var(--navy-50)] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${id}-title`} className="site-subheading m-0">
          {PRIVACY_NOTICE.title}
        </h2>
        <p className="text-body-sm m-0" data-testid="privacy-notice-version">
          版本 {PRIVACY_NOTICE.version}（{PRIVACY_NOTICE.reviewStatus}）
        </p>
      </div>
      <dl className="mt-3 space-y-3">
        {PRIVACY_NOTICE.sections.map((section) => (
          <div key={section.id}>
            <dt className="text-body-sm font-semibold text-[var(--navy-800)]">{section.heading}</dt>
            <dd className="text-body-sm m-0 text-[var(--navy-700)]">{section.body}</dd>
          </div>
        ))}
      </dl>
      <p className="text-body-sm mt-3 font-medium text-[var(--navy-800)]">
        {PRIVACY_NOTICE.testModeNote}
      </p>
    </section>
  );
}
