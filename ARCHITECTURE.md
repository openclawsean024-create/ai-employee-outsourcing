# AI 員工外包平台 — Architecture Control

> Canonical product specification: `PRD/SPEC.md`
> Active delivery scope: Batch 2.1, UX-1 + UX-3
> Ground truth: `/home/sean/Program/ai-employee-outsourcing`
> Updated: 2026-07-16

## 1. Runtime architecture

```text
Next.js 16 App Router
  app/page.tsx
    application shell
      DashboardView
        existing dashboard sections
        DashboardPricing
        DashboardFooter

State and domain
  Zustand store
    current view
    user settings and current tier
  Dexie / IndexedDB
    tasks
    templates
  pricing model
    TIER_LIMITS and TIER_LABELS
    presentation metadata for four plans
```

This batch remains a client-side product prototype. Pricing is informational and routes users to Settings. It does not create a payment or subscription backend.

## 2. Relevant directory structure

```text
ai-employee-outsourcing/
├── PRD/SPEC.md
├── REQUIREMENTS.md
├── ARCHITECTURE.md
├── PROJECT_STATE.md
├── app/
│   └── globals.css
├── src/
│   ├── __tests__/
│   │   └── sub-components-dashboard.test.tsx
│   ├── components/views/
│   │   ├── DashboardView.tsx
│   │   └── dashboard/
│   │       ├── DashboardPricing.tsx
│   │       ├── DashboardFooter.tsx
│   │       └── index.ts
│   └── lib/
│       ├── types.ts
│       └── utils.ts
└── vercel.json
```

## 3. Component interfaces

```ts
type Navigate = (view: View) => void;

DashboardPricingProps = {
  currentTier: UserTier;
  onNavigate: Navigate;
};

DashboardFooterProps = {
  onNavigate: Navigate;
};
```

`DashboardView` is the composition root. It reads `settings.tier` and `setView` from Zustand, then passes narrow props to leaf components. Leaf components do not import the store, which keeps them deterministic and directly testable.

## 4. Data ownership

- `src/lib/utils.ts` owns tier labels, task limits, agent limits, and monthly price values.
- Presentation metadata may be local to `DashboardPricing`, but price and limit numbers must be derived from the shared tier constants.
- `PRD/SPEC.md` remains the authority when product copy conflicts with code.
- `PROJECT_STATE.md` remains the authority for cross-session execution state.

## 5. API and persistence

No new API endpoint is added in Batch 1.5.

Existing client persistence remains:

```text
Zustand settings state -> localStorage persistence
Task/template records -> Dexie IndexedDB
```

No billing record, payment token, checkout session, or webhook is introduced.

## 6. Deployment

- Platform: Vercel production.
- Build: `npm run build`.
- Deploy: manual `vercel --prod --yes` from `/home/sean/Program/ai-employee-outsourcing`.
- Verification: redirect-aware curl, title/content check, and live browser interaction.

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Pricing conflicts with PRD | Derive amounts and limits from shared tier constants and verify against SPEC sections 1 and 15. |
| CTA implies real checkout | Route only to Settings and explicitly label the Beta limitation. |
| Dashboard becomes a marketing landing page | Add only the two approved sections; exclude phone mockups and testimonials. |
| New leaf components become store-coupled | Pass current tier and navigation callbacks as props. |
| Visual regression on mobile | Use mobile-first grid and verify at desktop plus mobile viewport. |
| Deployment URL reaches Vercel SSO | Check `url_effective`, title, and product content after redirects. |
| Notion batch update silently fails | GET true property keys, PATCH only existing fields, then GET and compare values. |

## 8. Verification layers

1. Inner Dev loop: focused red/green tests, full suite, typecheck, build.
2. Outer Deploy loop: manual production deploy, HTTP/content checks, live browser interaction.
3. Meta Evolution loop: code review, state update, Notion read-back, and next-batch handoff.
