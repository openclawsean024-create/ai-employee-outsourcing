# AI Employee Outsourcing — Changelog

> 本檔記錄 ai-employee-outsourcing 規格書與工程交付物版本歷史。
> SPEC 主文件：`PRD/SPEC.md`（v3.0.2 fleet 補丁，v3.0 sweet-spot 內容完整保留）。
> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet。

---

## v3.0.2 — 2026-09-06 (fleet upgrade)

**類型**：fleet-level engineering contract 補丁
**升級執行**：Sean 10-repo-fleet（worker agent，rank #26）
**GitHub**：`https://github.com/openclawsean024-create/ai-employee-outsourcing`

### 動機

v3.0（2026-07-19 forced upgrade）完成 sweet-spot 體檢（7.0/10）、5 問量表、ADR 與市場驗證，文件強度達標；但 §7 部署契約僅口頭描述，缺可驗收的工程交付物：
- 缺標準化 4-job CI workflow
- 缺 Definition of Done 對齊 fleet 規範
- 缺 PRD/CHANGELOG.md 對齊版本歷史

v3.0.2 補齊這層工程契約，後續 sprint 才有可驗收的 CI 結果。

### Changed

- `PRD/SPEC.md`：頂部加 v3.0.2 banner + 新增 §A v3.0.2 增量章節（升級原因、§1–§15 對齊、工程交付物、Definition of Done、不變更項宣告）
- v3.0 既有 §0–§15 完整保留（sweet=7.0、商業化=79.0 不重做體檢）
- 安裝 `@testing-library/dom`（vitest 4 + @testing-library/react 16 的必要 peer dep）— 補上原 batch 2.3 漏裝的 test infra

### Added

- `PRD/CHANGELOG.md`：本檔（v1.0 / v2.0 / v2.2.1 / v3.0 / v3.0.2 五個條目）
- `.github/workflows/ci.yml`：4-job workflow
  - `lint`：`npm run lint`（0 error 容錯）
  - `test`：`npm test -- --run`（98 條 vitest AC）
  - `build`：`npm run build` + artifact upload
  - `deploy`：push to main → Vercel deploy（需 `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` secrets）

### Verified

- `npm install --legacy-peer-deps` → 286 packages（含新裝的 `@testing-library/dom`）
- `npm run lint` → 0 error
- `npm test` → **98/98 passed**（7 個 test file：acceptance 18 + agents-catalog 16 + sub-components-dashboard + sub-components-tasknew + sub-components-tasks + sub-components-usage + batch-2-1-ux）
- `npm run build` → Next.js 16.2.10 + Turbopack，Compiled successfully，3 static routes
- 不修改 domain 邏輯（Dexie 144 Agent catalog 架構、TaskLog 結構維持）
- 不引入 heavyweight dependency（僅裝 1 個 testing peer dep）

### DoD

- [x] `PRD/SPEC.md` v3.0.2 banner + §A 增量
- [x] `PRD/CHANGELOG.md` 5 條版本
- [x] `.github/workflows/ci.yml` 4 jobs
- [x] lint 0 error
- [x] test 98/98
- [x] build 0 error
- [x] deploy target = Vercel（既有 vercel.json 預設）

---

## v3.0 — 2026-07-19 (forced upgrade)

**類型**：sweet-spot-driven rewrite (2nd round)
**升級執行**：Sean PRD Rewrite Specialist
**升級路徑**：v2.2.1（kill 結論）→ v3.0（conditional kill + smoke test gate）

### 動機

依 OpenClaw 一人公司 12 SPEC v3.0 升級清單，本檔 v3.0 第二輪 forced upgrade。
v2.2.1 結論為 kill（sweet=3），本輪重新體檢後 sweet 提升至 7.0，行動建議改為 conditional kill + smoke test gate。

### Changed

- §0 文件資訊表（sweet 3 → 7.0、商業化 79.0、action=pivot-to-build）
- §0 Sweet Spot 5 問量表（Q1=8.0 / Q2=6.0 / Q3=6.5 / Q4=7.5 / Q5=7.0，加總 35.0/50 = sweet 7.0）
- 行動建議 kill → pivot-to-build（先跑 Stage 1.5 smoke test gate，達標轉 sprint）
- 保留 v2.2.1 的 kill 結論但加上觸發條件（§11 smoke test gate 30 天內未達標才 kill）

### Verified

- sweet 3 → 7.0（+4.0，5 問證據全面補強：PTT Soft_Job 2026 證據、Coze/Manus/Lindy/Relay 4 個 peer HTTP 200 驗證、定價 v3.0 暫訂 Solo NT$299 / Studio NT$899 / 代營運按成果包報價）

---

## v2.2.1 — 2026-07-19 (sweet-spot rewrite)

**類型**：sweet-spot-driven rewrite (1st round)
**升級執行**：Sean PRD Rewrite Specialist

### 動機

依 12 SPEC v3.0 升級協議，先做 sweet-spot 5 問體檢第一輪；本輪結論 sweet=3，建議 kill。

### Verified

- sweet 3/10
- 行動建議：kill（本次不執行；先驗證再開發）

---

## v2.0 — 2026-07-17 (Batch 2.3 production-ready)

**對應**：`PROJECT_STATE.md` 標 Phase `05_EVOLUTION — Batch 2.3 UX-2 已部署並完成活線驗證`

### Changed

- 程式碼完成度：0.90
- 測試：98/98 pass（7 test files）
- Lint：PASS（ESLint 9 flat config）
- Build：0 errors（Next.js 16.2.10）
- Production health：HTTP 200，Lighthouse desktop/mobile 四維 100

### Added

- Batch 2.3：mobile-only task card fallback
- Batch 2.2：Accessibility（sidebar collapse button accessible name、pricing current-plan CTA）、Contrast 改用 semantic token
- Batch 2.1：UX-1 成本超限警告改用 `--warning-soft`、UX-3 Agent filter sticky bar 保持 mobile container padding

### Verified

- 活線 390/768/1440px screenshots pass
- Live DOM：390px 單欄、768px 雙欄、1440px 四欄，body 無水平溢出
- Live console：0 error / 0 warn

---

## v1.0 — 2026-07-15 (initial MVP)

**對應**：Sprint 1 Day 19 完成 10 條 Acceptance Criteria（acceptance.test.ts）

### Added

- Dexie 144 Agent catalog（10 大類）
- 多 Agent 協作（runMultiAgentCollaboration 平行執行）
- 範本儲存（saveAsTemplate / deleteTemplate via IndexedDB）
- 任務歷史（時間/Agent/費用/結果摘要）
- 效益報表（100 任務 / 50 小時 / NT$120 計算）
- API 失敗降級（runAgent 5% 失敗率測試）
- Top 20 Agent system prompts（待升級）
