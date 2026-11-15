import Link from 'next/link';
import { FlaskConical } from 'lucide-react';

/** M1 AC-009：/demo 頁首固定顯示的示範標示。 */
export const DEMO_NOTICE_TEXT = '示範：輸出為模擬內容，未呼叫真實 AI';

export default function DemoNotice() {
  return (
    <div
      role="note"
      aria-label="示範頁說明"
      data-testid="demo-notice"
      className="flex-none flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 bg-[var(--highlight-soft)] border-b border-[var(--border)] text-[13px] text-[var(--navy-900)]"
    >
      <p className="flex items-center gap-2 font-semibold m-0">
        <FlaskConical className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
        {DEMO_NOTICE_TEXT}
      </p>
      <p className="m-0 text-[var(--navy-700)]">
        頁內的方案、金額與指標皆為舊版介面示意，並非本服務的報價或實績。
        <Link href="/" className="ml-2 underline font-medium text-[var(--brand)]">
          回服務官網
        </Link>
      </p>
    </div>
  );
}
