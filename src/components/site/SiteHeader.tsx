import Link from 'next/link';
import { Zap } from 'lucide-react';
import { BRAND } from '@/content/brand';
import { NAV_LINKS } from '@/content/navigation';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3">
        <Link
          href="/"
          aria-label={`${BRAND.name} 首頁`}
          className="flex items-center gap-2 font-bold text-[var(--navy-900)] no-underline min-h-[44px]"
        >
          <span className="w-8 h-8 rounded-[8px] bg-[var(--brand)] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span data-testid="brand-name">{BRAND.name}</span>
        </Link>

        <nav aria-label="主導覽" className="flex flex-wrap items-center gap-1 -mx-2 md:mx-0">
          {NAV_LINKS.map((link, index) => {
            const isCta = index === NAV_LINKS.length - 1;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isCta ? 'btn btn-primary ml-1' : 'nav-item site-nav-item'}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
