# AI 員工外包平台 — PROJECT_STATE

> **最後更新**：2026-07-15 02:08 (TW)
> **維護人**：Sophia (Sophia CPO)
> **Cron 接力 job**：`eea9f0ab6073` (每 5hr)

## 當前狀態

| 項目 | 值 |
|---|---|
| Phase | **Batch 1 完成 ✅ / Batch 1.5 待啟動** |
| Production URL | https://ai-employee-outsourcing.vercel.app |
| 最新 commit | `b29c868` (2026-07-15 01:58 TW) |
| 測試 | 86/86 ✅ |
| Build | ✅ 0 errors |
| 程式碼完成度 | 0.78 (78%) |
| PRD 規格分數 | 100 |
| 商業化分數 | 77 |
| Notion page | 364449ca-65d8-810d-a4dc-c89a533677ac |

## Batch 1 完成事項 (Phase 1 5 項 + Phase 2a)

- ✅ `globals.css` 加 marquee animation + mask-fade utility
- ✅ `DashboardHero.tsx` Lindy-style hero + G2 rating + marquee 10 個 Agent 類別
- ✅ `DashboardCategories.tsx` 修正類別視覺
- ✅ `DashboardMetrics.tsx` 修正 metrics 顯示
- ✅ `DashboardOnboardingSteps.tsx` 修正 onboarding steps
- ✅ `STYLE-NOTES.md` 風格決策紀錄

## Batch 1.5 執行中（Phase 2c + 2e）

> **狀態**：cron 已依自主推進鐵律啟動；只做 PRD 支援且符合 dashboard 定位的兩項。

| 階段 | 內容 | 決策 |
|---|---|---|
| 2b | iPhone mockup | 不做 — marketing landing 元件，不符合後台 dashboard |
| 2c | pricing card | 執行 — 依 PRD 四方案呈現；只導向設定，不假裝已接金流 |
| 2d | Wall of Love | 不做 — 無真實 testimonial，避免捏造社會證明 |
| 2e | footer | 執行 — 提供 in-app 導覽與 Beta/local-first 說明 |

**Batch 1.5 DoD**：TDD red/green、完整測試與 build、desktop/mobile E2E、手動 production deploy、curl + 內容驗證、Notion read-back。

## 下一步（cron 接力起點）

如果 Sean 沒明確指示，loop-engineering cron 自動接手時：
1. 跑 `npx vitest run` 確認 86/86
2. 跑 `git pull` 確認最新
3. 跑 `curl https://ai-employee-outsourcing.vercel.app/` 確認 200
4. 問 Sean：「要 Batch 1.5 (2c+2e) 嗎？」

## 待辦清單

- [ ] Batch 1.5 (Phase 2c pricing card + 2e footer) — 待 Sean 決策
- [ ] TypeScript pre-existing error: `sub-components-tasks.test.tsx:87` (id on never) — 不在 Batch 1.5 範圍
- [ ] Backlog 在 `STYLE-NOTES.md` 內

## 重要參考

- PRD: `PRD/SPEC.md`
- Vercel: `prj_NXcvjN0w2oGmao62kuuyaMoaW0IU`
- GitHub: `openclawsean024-create/ai-employee-outsourcing`
- Branch: `main`
- 上次 deploy log: see git log `b29c868`