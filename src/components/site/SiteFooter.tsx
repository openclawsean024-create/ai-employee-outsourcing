import Link from 'next/link';
import { BRAND, SITE_STAGE_NOTICE } from '@/content/brand';
import { DEMO_LINK, HOME_ANCHORS, NAV_LINKS } from '@/content/navigation';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container grid gap-8 md:grid-cols-[2fr_1fr_1fr] py-10">
        <div>
          <p className="font-bold text-[var(--navy-900)] m-0">{BRAND.name}</p>
          <p className="text-body-sm mt-2 max-w-md">{BRAND.tagline}</p>
          <p className="text-body-sm mt-4 max-w-md" data-testid="site-stage-notice">
            {SITE_STAGE_NOTICE}
          </p>
        </div>

        <nav aria-label="頁尾導覽：服務">
          <p className="text-micro mb-3">服務</p>
          <ul className="site-footer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="頁尾導覽：了解更多">
          <p className="text-micro mb-3">了解更多</p>
          <ul className="site-footer-links">
            {HOME_ANCHORS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href={DEMO_LINK.href}>{DEMO_LINK.label}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
