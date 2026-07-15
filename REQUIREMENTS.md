# AI 員工外包平台 — Requirements Control

> Canonical product specification: `PRD/SPEC.md`
> Active delivery scope: Batch 1.5, Phase 2c + Phase 2e
> Updated: 2026-07-15

## 1. Product requirements

The product requirements, personas, user stories, acceptance criteria, pricing model, and commercialization assumptions are defined exclusively in `PRD/SPEC.md`. This control document does not duplicate or override that source.

## 2. Batch 1.5 functional scope

### FR-B15-01 Pricing section

- Display the four PRD-defined tiers: Free, KOL, Pro, and Enterprise.
- Reuse the existing tier limits and prices from `src/lib/utils.ts`; do not introduce conflicting price literals in UI components.
- Visually emphasize Pro as the recommended tier using the existing Lindy-inspired warm highlight token.
- Paid-plan calls to action must not claim that payment is active. They may route to Settings for plan information only.
- The current tier must be distinguishable from other plans.

### FR-B15-02 Dashboard footer

- Add a compact footer at the end of the dashboard.
- Provide working in-app navigation to Agent Library, New Task, Usage, and Settings.
- State the Beta/local-first data limitation truthfully.
- Do not add non-existent legal pages, social proof, customer quotes, or external links.

## 3. Non-functional requirements

- Preserve the Lindy-inspired design tokens in `app/globals.css`.
- Responsive layout: one column on mobile, two columns on tablet, four columns on desktop where practical.
- Interactive controls must use semantic `button` elements and visible focus behavior inherited from the design system.
- No Unicode emoji in TypeScript, TSX, CSS, or new Markdown content.
- No API keys, secrets, OAuth tokens, or hard-coded credentials in frontend code.
- Keep the application pure frontend for this batch; no Supabase, Stripe, auth, server API, or new route.

## 4. Scope exclusions

- Phase 2b iPhone mockup.
- Phase 2d Wall of Love or testimonials.
- Real checkout, Stripe integration, billing state, or payment success claims.
- New marketing landing page or new navigation view.
- Existing unrelated TypeScript issue in `sub-components-tasks.test.tsx` unless it blocks the required build.

## 5. Definition of Done

- New pricing and footer components have tests written before implementation.
- Focused tests pass, followed by the complete Vitest suite.
- TypeScript check and production build pass with zero errors.
- Desktop and mobile browser verification show correct layout and at least one working CTA/navigation path.
- Production is deployed manually with `vercel --prod --yes`.
- Production responds HTTP 200 after redirects, final URL is not a Vercel login page, and page title/content match this product.
- Git commit is pushed to `origin/main`.
- `PROJECT_STATE.md` records the completed batch, test/build/deploy evidence, unresolved issues, and next autonomous action.
- Notion fields are updated using actual page property keys and verified with a read-back.
