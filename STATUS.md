# Status — ai-employee-outsourcing

- 產品：AI 員工外包與導入服務
- Repo：`openclawsean024-create/ai-employee-outsourcing`（預設分支 `main`）
- State：🟡 **M1 開發中**（分支 `feat/m1`，2026-11-16）
- Spec：`PRD/SPEC.md` v4.0；目前目標：`GOAL.md`（M1）

## M1 AC 進度（分支 `feat/m1`）

每條 AC 完成時更新本表；完整指令輸出與 exit code 見文末「M1 驗證紀錄」。

| AC | 內容 | 狀態 | 測試檔（`src/__tests__/`） | 證據 |
|---|---|---|---|---|
| AC-012 | 品質關卡 | ✅ 完成 | `quality-gate.test.ts` | `npm run typecheck` exit 0；`grep -n 'no test script' .github/workflows/ci.yml` 無輸出；CI 新增 typecheck job，lint 移除 `continue-on-error`，test 改為 `npm test` |
| AC-009 | mock 工作台移到 `/demo` | ✅ 完成 | `demo.test.tsx`（既有 7 檔 98 測試原樣保留） | 工作台改由 `app/demo/page.tsx` → `src/components/demo/DemoWorkbench.tsx` 渲染，頁首 `DemoNotice` 固定顯示「示範：輸出為模擬內容，未呼叫真實 AI」；`SettingsView` 改為「沒有連接任何 AI 服務，也沒有使用任何 API 金鑰」；Sean 未指示移除 demo，依預設保留 |
| AC-008 | 移除未查證宣稱 | ✅ 完成（搬入內容於 AC-007 起持續由掃描把關） | `no-unverified-claims.test.ts` | `DashboardHero` 移除「4.9 在 Product Hunt · 已有 800+ 微型賣家使用」與「每月 NT$99 起」；`DashboardMetrics` 假指標標示為示意數字並改 NT$；禁用詞清單掃描 `app/`、`src/components/`、`src/content/`；GOAL 指定的 grep 無輸出 |
| AC-007 | 合併內容搬遷 | ✅ 完成 | `content.test.ts` | `src/content/`：`services.ts`（四階服務天梯＋顧問方案）、`home.ts`（3 個痛點，改為示意）、`methodology.ts`（三大板塊＋四個空格）、`process.ts`（5 步）、`faq.ts`（7 題）、`training.ts`（課程程度、課程卡、企業包班）、`contact.ts`＋`src/lib/inquiry/schema.ts`（預約欄位、zod）；未搬 auth／Prisma／報名／Stripe／Supabase；來源 repo HEAD 仍為 `9db33f4`、`48e84a7`（`gh api …/commits/main --jq .sha`） |
| AC-001 | 服務方案頁 | ✅ 完成 | `services.test.tsx` | `/services` 由 `src/content/services.ts` 渲染兩類共 6 個方案，每案顯示適合對象、交付內容、時程、報價方式；元件內無寫死價格字串（測試掃描 `src/components/site`、`app/(site)`）；build 路由表含 `/services` |
| AC-002 | 報價方式整合 | ✅ 完成 | `pricing.test.tsx` | 單一 `Price` 型別（`src/content/pricing.ts`），所有方案 `currency: TWD`、`kind: quote`，畫面顯示「諮詢後報價」；`/services`、`/training` 皆有「報價方式」說明；`grep -rnE "USD\|\\$[0-9]" src/content` 無輸出（exit 1） |
| AC-003 | 案例頁（示範情境） | ✅ 完成 | `cases.test.tsx` | `/cases` 由 `src/content/cases.ts` 渲染 3 筆 `kind: demo`，每張卡片有「示範情境」徽章與「非真實客戶案例」說明；無客戶名稱、成效數字或推薦語；`validateCases` 會擋下缺少 `consentConfirmedBySean: true` 或來源的 `real` 案例 |
| AC-004 | 預約諮詢表單（測試模式） | ✅ 完成 | `contact.test.tsx` | `/contact` 表單 7 個欄位以 zod 驗證；送出交給可替換的 `submitInquiry`（M1 = `mockSubmitInquiry`）；假資料送出時 adapter 1 次、`fetch`／XHR／`sendBeacon` 0 次、localStorage／sessionStorage／IndexedDB 無寫入；成功畫面顯示「測試模式，資料未送出」；瀏覽器實測送出後新增網路請求 0 筆 |
| AC-005 | 個資告知與同意 | ✅ 完成 | `contact.test.tsx` | 表單上方顯示個資蒐集告知（蒐集目的、資料類別、利用期間與方式、當事人權利、不提供的影響），標註「版本 v0.1 草稿（待 Sean／法務確認）」；同意核取方塊必勾，未勾選時 adapter 0 次 |
| AC-006 | 內訓課程介紹頁 | ⏳ 未開始 | — | — |
| AC-010 | 首頁導覽與品牌 | ⏳ 未開始 | — | — |
| AC-011 | README 補齊 | ⏳ 未開始 | — | — |

## 與 Notion 商品資料庫的對應

| Notion「可產品化商品」欄位 | 值 |
|---|---|
| 產品名稱 | AI 員工外包與導入服務 |
| 優先順序 | P1 |
| 開發順位 | 第 3 個 |
| 主 repo | `openclawsean024-create/ai-employee-outsourcing` |
| 要併入的 repo | `openclawsean024-create/ai-landing-specialist`、`openclawsean024-create/claude-code-training` |
| 獲利模式 | 顧問／內訓、專案建置 |
| 目標客群 | 想導入 AI 自動化的台灣中小企業 |
| 現況完成度（Notion 記錄） | 50 |
| 上市前要補 | README 與案例、官網整合報價方式；與 `sean0407/enterprise-ai-adoption-course` 內訓教材整合為同一品牌 |
| 主要風險 | 需要實績與信任度；服務型收入依賴個人時間 |

註：Notion 的完成度 50 是商品層級的估計。以 M1「能接案的官網」來看，主 repo 目前沒有任何服務頁功能，P0 需求只有素材散落在要併入的 repo（見下表）。

## 本次增量（2026-11-16）

- 只做文件：重寫 `PRD/SPEC.md`（v4.0），新增 `GOAL.md`、`AGENTS.md`、`STATUS.md`，改寫 `SOP.md`。
- 未修改任何功能程式碼、設定檔或測試；未修改要併入的 repo。

## 程式基準（main @ `4067b4b`）

| Command | Exit | 結果 |
|---|---:|---|
| `npm ci --legacy-peer-deps` | 0 | 安裝完成 |
| `npm run lint` | 0 | ESLint 無錯誤 |
| `npx tsc --noEmit` | 0 | 型別檢查通過（尚無 npm script） |
| `npm test` | 0 | 7 files、98 tests passed |
| `npm run build` | 0 | Next.js build，路由 `/`、`/_not-found` |

## FR 對照（詳見 SPEC §6）

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 服務方案頁 | P0 | 部分 | ai-landing-specialist（僅歷史版 `8e0625e` 文案） |
| FR-002 | 報價方式整合 | P0 | 部分 | 三個 repo 價格互相矛盾 |
| FR-003 | 案例頁（示範情境） | P0 | 未實作 | — |
| FR-004 | 預約諮詢表單 | P0 | 部分 | ai-landing-specialist（只 console.log） |
| FR-005 | 個資告知與同意 | P0 | 未實作 | — |
| FR-006 | 內訓課程介紹頁 | P0 | 部分 | claude-code-training（需資料庫、無 seed） |
| FR-007 | 導入方法論與流程 | P0 | 部分 | ai-landing-specialist（歷史版） |
| FR-008 | FAQ | P1 | 部分 | ai-landing-specialist（歷史版） |
| FR-009 | 品牌統一 | P0 | 未實作 | — |
| FR-010 | 文案真實性 | P0 | 未實作 | 主 repo Hero 有未查證宣稱 |
| FR-011 | README | P0 | 未實作 | 主 repo README 僅 2 行 |
| FR-012 | AI 員工示範 demo | P1 | 已實作（mock） | ai-employee-outsourcing |
| FR-013 | demo 範本／歷史／用量／匯出入 | P2 | 已實作（mock） | ai-employee-outsourcing |
| FR-014 | 諮詢真實送達管道 | P1 | 未實作 | — |
| FR-015 | 隱私權政策頁 | P1 | 未實作 | — |
| FR-016 | 外部內訓教材整合 | P1 | 未實作 | 待 Sean 提供 |
| FR-017 | SEO 與分析 | P1 | 未實作 | — |
| FR-018 | 安全標頭 | P1 | 部分 | ai-landing-specialist `vercel.json` |
| FR-019 | 學員註冊／登入 | P2 | 部分 | claude-code-training |
| FR-020 | 線上課程報名／進度／證書 | P2 | 部分 | claude-code-training |
| FR-021 | 線上付款 | P2 | 未實作 | — |
| FR-022 | 報價單／專案管理後台 | P2 | 未實作 | — |

## 已知風險與發現

- 主 repo `src/components/views/dashboard/DashboardHero.tsx`：「4.9 在 Product Hunt · 已有 800+ 微型賣家使用」無資料支持（M1 AC-008 移除）。
- 主 repo `src/components/views/SettingsView.tsx`：「僅使用平台預載金鑰」與實際 mock 行為不符（M1 AC-009 修正）。
- 主 repo CI test job 會吞掉測試失敗（M1 AC-012 修正）。
- `ai-landing-specialist`：HEAD `index.html` 已被通用模板導向覆蓋，服務官網內容只在 `8e0625e`；`STATUS.md` 宣稱的部署狀態與 HEAD 不符。
- `claude-code-training`：`.env`（僅本機 SQLite 路徑）與 `prisma/dev.db`（空表）被提交；`AUTH_SECRET` 有寫死預設值；`POST /api/courses` 無權限檢查；`/courses/[id]` 頁面不存在。這些模組 M1 不搬。
- 未在任何 repo 發現真實 API 金鑰；未在 `prisma/dev.db` 發現使用者資料（各表 0 筆）。

## 下一步

1. Sean 決定 SPEC §13 的待決事項（至少品牌名、價格或「諮詢後報價」、demo 去留）。
2. 依 `GOAL.md` 開發 M1，每個 AC 完成後在本檔記錄指令與 exit code。
