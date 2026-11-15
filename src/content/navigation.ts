/** 網站導覽（M1 AC-010）。 */
export const NAV_LINKS = [
  { label: '服務', href: '/services' },
  { label: '案例', href: '/cases' },
  { label: '內訓', href: '/training' },
  { label: '預約諮詢', href: '/contact' },
] as const;

export const HOME_ANCHORS = [
  { label: '導入方法', href: '/#methodology' },
  { label: '導入流程', href: '/#process' },
  { label: '常見問題', href: '/#faq' },
] as const;

/** 既有 144 Agent mock 工作台（示範頁）。 */
export const DEMO_LINK = { label: 'AI 員工示範（模擬輸出）', href: '/demo' } as const;
