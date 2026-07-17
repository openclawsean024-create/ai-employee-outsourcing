# AI 員工外包平台 — Decision Log

> Canonical product specification: `PRD/SPEC.md`
> Ground truth: `/home/sean/Program/ai-employee-outsourcing`

## D-001 — Batch 2.1 scope

- (A) 問題陳述：Batch 1.5 已完成並通過健康檢查，但 Sprint 2 仍有多個未完成項目；直接挑任一項會造成 scope creep。
- (B) 考慮的選項：維持 Healthy-Idle；先做 UX-1 + UX-3；先做 Lighthouse；先升級 Top 20 Agent 內容。
- (C) 最後決策：依 `PRD/SPRINT-2-BACKLOG.md` 的立即開工排序，執行 Batch 2.1 = UX-1 + UX-3。這是最小、低風險、可立即驗證的同批任務。
- (D) 日期：2026-07-16
- 取捨：暫不處理 Lighthouse、內容升級、UX-2、Dexie migration，避免擴大本次變更面。

## D-002 — Ground truth directory

- (A) 問題陳述：`openclaw-pwd-check` 發現可能存在多個本地 reality，但 `/home/sean/Program/ai-employee-outsourcing` 具備 Git remote、最新 Batch 1.5 commit、production 對應 URL 與狀態文件。
- (B) 考慮的選項：Program 目錄、其他 projects 目錄、直接以 GitHub 或 Vercel 為修改來源。
- (C) 最後決策：本次只在 `/home/sean/Program/ai-employee-outsourcing` 修改、測試、commit 與 deploy；GitHub 與 Vercel 只作同步與驗證 reality。
- (D) 日期：2026-07-16
- 取捨：不碰其他專案目錄，不用 `/tmp` 作為 source of truth。

## D-003 — Semantic warning surface

- (A) 問題陳述：成本警告元件硬編 `#FEF3C7`，繞過既有 design token，造成 theme/token 演進時的視覺漂移。
- (B) 考慮的選項：保留 hex；新增 semantic warning surface token；改用 Tailwind 任意值但集中在 component。
- (C) 最後決策：新增/使用 semantic token，讓 component 只表達意圖，並以 focused test + live viewport 檢查對比。
- (D) 日期：2026-07-16
- 取捨：不在本批次重做整套色彩系統。

## D-004 — ESLint command on Next.js 16

- (A) 問題陳述：`npm run lint` 原本指向 `next lint`，但 Next.js 16.2.10 已移除該 CLI，導致驗證命令失效。
- (B) 考慮的選項：刪除 lint script；保留失效的 `next lint`；改用 ESLint 9 flat config 與 `eslint .`。
- (C) 最後決策：採用 ESLint 9 flat config（`eslint.config.mjs`），讓 `npm run lint` 成為可重複執行的 parser-level baseline；完整 TypeScript/TSX 驗證由 `next build` 與 Vitest 負責。
- (D) 日期：2026-07-16
- 取捨：本次不引入 Next.js ESLint plugin，避免在 Next.js 16 migration 期間增加設定耦合；後續可另開 lint rules hardening batch。

## D-005 — Batch 2.2 accessibility quality gate

- (A) 問題陳述：Batch 2.1 已完成 UX 修正，但 Lighthouse baseline 仍顯示 desktop Accessibility 89、Agentic Browsing 50，mobile Accessibility 96；production 仍有 accessible name 與 color contrast 缺陷。
- (B) 考慮的選項：只接受 mobile ≥85；只修 button labels；修正 semantic brand/success tokens、sidebar toggle accessible name、visible label mismatch，並以 desktop/mobile Lighthouse 重跑驗收。
- (C) 最後決策：執行 Batch 2.2 accessibility hardening。brand token 改用通過對比門檻的深藍，active surface 改為較淺 token，success 改為深綠，current-plan CTA 保留可見文字作 accessible name，sidebar collapse button 加 aria-label。
- (D) 日期：2026-07-17
- 取捨：不擴張到 Top 20 Agent 內容或 Dexie migration；以最小視覺/語意變更取得 Lighthouse 四維全綠。
