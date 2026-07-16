# AI 員工外包平台 — Architecture SSOT

> Canonical product specification: `PRD/SPEC.md`
> Active delivery scope: Batch 2.1, UX-1 + UX-3
> Ground truth: `/home/sean/Program/ai-employee-outsourcing`
> Updated: 2026-07-16

## 1. Scope boundary

Batch 2.1 is a presentation-only correction inside the existing client-side dashboard. It changes the cost-warning surface and the mobile spacing of the Agent filter bar. It does not add routes, API endpoints, authentication, billing, or persistence behavior.

## 2. Runtime path

```text
Next.js 16 App Router
  application shell
    NewTaskView
      task-new/TaskInputPanel
    AgentsView
      agents/AgentsFiltersBar

Design tokens
  app/globals.css :root
    semantic warning/surface tokens
    border and spacing primitives
```

## 3. Change ownership

- `src/components/views/task-new/TaskInputPanel.tsx` owns the UX-1 warning markup.
- `src/components/views/agents/AgentsFiltersBar.tsx` owns the UX-3 sticky bar and horizontal filter row.
- `app/globals.css` owns semantic design tokens; component code must consume tokens rather than duplicate hex values.
- `src/__tests__/sub-components-tasknew.test.tsx` and a focused Agent filter test own regression coverage.

## 4. Constraints

- Keep the pure frontend architecture.
- Preserve existing behavior and public routes.
- Do not add API keys, secrets, or third-party runtime dependencies.
- Keep TypeScript/TSX/CSS changes free of Unicode emoji.
- Preserve the Tailwind v3/PostCSS v3-compatible chain already validated by Batch 1.5.

## 5. Verification and deployment

1. Focused tests for UX-1 and UX-3.
2. Full `npm test`, `npm run lint`, and `npm run build`.
3. Static checks for secrets, emoji, and compiled responsive CSS.
4. Manual `vercel --prod --yes` from the ground-truth directory.
5. Redirect-aware curl and 390px, 768px, and 1440px live browser checks.
6. Notion update only after the live deployment evidence exists, followed by read-back verification.

## 5.1 Lint configuration

Next.js 16.2.10 no longer provides the `next lint` CLI. The project uses ESLint 9 flat config through `eslint.config.mjs` and the `eslint .` package script. TypeScript and TSX correctness remain covered by `next build` and Vitest.

## 6. Known risks

| Risk | Mitigation |
|---|---|
| Token change reduces warning contrast | Add a token-specific focused assertion and inspect all three viewport screenshots. |
| Mobile filter row overflows the viewport | Keep the row horizontally scrollable and use matching container padding. |
| Deploy points at stale Vercel project | Verify `.vercel/project.json`, deployment URL, final URL, title, and content before Notion sync. |
