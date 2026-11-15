# Status — ai-employee-outsourcing

- 產品：AI 員工外包與導入服務
- Repo：`openclawsean024-create/ai-employee-outsourcing`（預設分支 `main`）
- State：🟢 **M1 開發完成，待 Sean 覆審**（分支 `feat/m1`，2026-11-16；尚未合併、尚未部署）
- Spec：`PRD/SPEC.md` v4.0；目前目標：`GOAL.md`（M1）

## M1 AC 進度（分支 `feat/m1`）

每條 AC 完成時更新本表（依開發順序排列）；完整指令與 exit code 見下方「M1 驗證紀錄」。

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
| AC-006 | 內訓課程介紹頁 | ✅ 完成 | `training.test.tsx` | `/training` 由 `src/content/training.ts` 渲染基礎／進階／企業三種程度、企業包班形式；內訓 CTA 連到 `/contact?type=training`；「企業 AI 導入教材整合中」占位區塊指向待整合的外部教材，未讀取、未撰寫其課綱（課程皆標「課綱整理中」） |
| AC-010 | 首頁導覽與品牌 | ✅ 完成 | `home.test.tsx` | `/` 為服務官網首頁（hero、痛點、兩種合作方式、方法論、5 步流程、FAQ、CTA）；導覽列 4 個連結 `/services`、`/cases`、`/training`、`/contact`；`app/layout.tsx` title／description 取自 `src/content/brand.ts` 的 `BRAND`（暫定名「AI 員工外包與導入服務」，`nameConfirmed: false`）；`grep -n "144 種 AI Agent" app/layout.tsx` 無輸出 |
| AC-011 | README 補齊 | ✅ 完成 | `readme.test.ts` | `README.md` 含產品定位、路由、本機開發、驗證、示範情境與測試模式、資料與個資、相關 repo 與外部教材狀態；GOAL 指定的章節檢查迴圈無輸出 |

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

## M1 驗證紀錄（2026-11-16，分支 `feat/m1`，本機 Node v26.13.1）

### SOP 檢查（從乾淨安裝開始，依序執行）

| Command | Exit | 結果 |
|---|---:|---|
| `npm ci --legacy-peer-deps` | 0 | 安裝完成 |
| `npm run lint` | 0 | ESLint 無錯誤 |
| `npm run typecheck` | 0 | `tsc --noEmit` 無錯誤 |
| `npm test` | 0 | 18 files、231 tests passed（既有 7 檔 98 個＋M1 新增 11 檔 133 個），0 failed |
| `npm run build` | 0 | 路由 `/`、`/_not-found`、`/cases`、`/contact`、`/demo`、`/services`、`/training`，全部靜態 |

CI（GitHub Actions，Node 20）結果以 PR 上的檢查為準；本機未以 Node 20 重跑。

### 各 AC 的測試數與 GOAL 指定的驗證指令

| AC | 測試（通過／總數） | GOAL 指定的額外驗證 | Exit |
|---|---|---|---:|
| AC-001 | `npm test -- services`：7／7 | `npm run build` 路由表含 `/services` | 0 |
| AC-002 | `npm test -- pricing`：18／18 | `grep -rnE 'USD\|\$[0-9]' src/content` 無輸出 | 1（無符合） |
| AC-003 | `npm test -- cases`：11／11 | — | 0 |
| AC-004 | `npm test -- contact`：10／10（AC-004 部分） | — | 0 |
| AC-005 | `npm test -- contact`：7／7（AC-005 部分） | — | 0 |
| AC-006 | `npm test -- training`：7／7 | — | 0 |
| AC-007 | `npm test -- content`：16／16 | `gh api repos/openclawsean024-create/ai-landing-specialist/commits/main --jq .sha` → `9db33f403fe3…`；`…/claude-code-training/…` → `48e84a7f14bf…`（皆未變動） | 0 |
| AC-008 | `npm test -- no-unverified-claims`：18／18 | `grep -rnE "Product Hunt\|800\+\|87%\|178%\|4\.61 億\|LTV/CAC\|實戰案例" app src --include=*.tsx --include=*.ts \| grep -v __tests__` 無輸出 | 1（無符合） |
| AC-009 | `npm test -- demo`：5／5；`npm test` 總數 231 ≥ 98＋133 | `git diff main -- src/__tests__ \| grep -E "^-.*expect\("` 無輸出；`git diff main --name-status -- src/__tests__` 只有新增檔案（既有 7 個測試檔零修改） | 1（無符合） |
| AC-010 | `npm test -- home`：10／10 | `grep -n "144 種 AI Agent" app/layout.tsx` 無輸出 | 1（無符合） |
| AC-011 | `npm test -- readme`：15／15 | GOAL 的 README 章節檢查迴圈無 `missing` 輸出 | 0 |
| AC-012 | `npm test -- quality-gate`：9／9 | `npm run lint && npm run typecheck && npm test && npm run build` 皆 exit 0；`grep -n 'no test script' .github/workflows/ci.yml` 無輸出 | 0／1（無符合） |

其他檢查：

- 瀏覽器實測（`next start`）：6 個路由皆 HTTP 200；375px 寬無水平捲動；導覽連結高度 44px；`/contact?type=training` 預選「內訓」；以假資料送出後新增網路請求 0 筆、localStorage 無新增鍵，畫面顯示「測試模式，資料未送出」；`/demo` 頁首顯示示範標示；console 無錯誤。
- 變異檢查：暫時讓 mock adapter 呼叫 `localStorage.setItem` 與 `fetch` 時，`contact` 測試有 3 個失敗（之後已還原），確認外洩檢查不是空檢查。
- 憑證與個資：本分支新增內容沒有 `.env`、金鑰或 token；出現的 Email 只有 `test@example.com`、`you@example.com`（假資料與 placeholder）。

### 本次沒有做的事（依硬性規則）

- 沒有 push 到 `main`、沒有合併 PR、沒有部署、沒有封存或修改任何其他 repo。
- 沒有讀取或複製 `sean0407/enterprise-ai-adoption-course`。
- 沒有刪除、修改或放寬任何既有測試；沒有做會員、付款、報名或後端資料庫。

## 待 Sean 覆審與決定（Exit gate）

覆審項目（GOAL.md Exit gate）：服務方案文字、報價方式、個資告知文字、示範案例標示。

| 項目 | 目前處理方式 | 要改的地方 |
|---|---|---|
| 品牌名稱 | 暫定「AI 員工外包與導入服務」 | `src/content/brand.ts` |
| 各方案實際價格 | 一律「諮詢後報價」 | `src/content/services.ts`、`training.ts` 的 `price` |
| 時程數字（1–2 小時、7–14 天、30–60 天等） | 搬自舊頁面，畫面標「規劃值，待確認」 | 各資料檔 `confirmed: true` |
| 月度維護是否提供 | 標「候選方案，是否提供待確認」 | `services.ts` 的 `availability` |
| 示範情境文案 | 3 筆虛構情境（客服 FAQ、會議紀錄、企業內訓），無客戶名與數字 | `src/content/cases.ts` |
| 個資告知文字 | v0.1 草稿；保存期限與行使權利聯絡方式寫「正式開放前載明」 | `src/content/privacy-notice.ts` |
| 課程課綱 | 未撰寫，標「課綱整理中」 | `src/content/training.ts` |
| `/demo` 去留 | 依預設保留為示範頁 | — |

沒有搬入、需 Sean 確認後才能加回的承諾：30 天保固、Slack 4 小時 SLA、24 小時內回信、「最受歡迎」標籤。

## FR 對照（詳見 SPEC §6）

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 服務方案頁 | P0 | 已實作（M1，價格待確認） | 主 repo `/services` |
| FR-002 | 報價方式整合 | P0 | 已實作（M1，一律諮詢後報價） | 主 repo `src/content/pricing.ts` |
| FR-003 | 案例頁（示範情境） | P0 | 已實作（M1，僅示範情境） | 主 repo `/cases` |
| FR-004 | 預約諮詢表單 | P0 | 已實作（M1，測試模式 mock；「偏好聯絡時段」未列入 AC-004，未做） | 主 repo `/contact` |
| FR-005 | 個資告知與同意 | P0 | 已實作（M1，文字待 Sean／法務確認） | 主 repo `/contact` |
| FR-006 | 內訓課程介紹頁 | P0 | 已實作（M1，課綱待提供） | 主 repo `/training` |
| FR-007 | 導入方法論與流程 | P0 | 已實作（M1，時程待確認） | 主 repo 首頁 |
| FR-008 | FAQ | P1 | 已實作（M1） | 主 repo 首頁 |
| FR-009 | 品牌統一 | P0 | 部分（暫定名集中於單一設定檔；正式名稱待 Sean 決定） | 主 repo `src/content/brand.ts` |
| FR-010 | 文案真實性 | P0 | 已實作（M1，禁用詞掃描） | 主 repo `no-unverified-claims.test.ts` |
| FR-011 | README | P0 | 已實作（M1） | 主 repo `README.md` |
| FR-012 | AI 員工示範 demo | P1 | 已實作（mock，移至 `/demo` 並標示模擬輸出） | 主 repo `/demo` |
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

M1 後仍存在、需要 Sean 知道的事項：

- `/demo` 的 `DashboardPricing` 仍顯示舊 SaaS 方案（NT$299／NT$499／NT$4,999 每月）與「最多人選擇」標籤：既有測試對這些文字有斷言，依規則不能改動；目前靠頁首的示範標示說明「頁內的方案、金額與指標皆為舊版介面示意」。要徹底移除需 Sean 同意調整既有測試。
- `src/lib/orchestrator.ts` 的模擬輸出文案含有看似實績的句子（例如「已有 10,000+ 用戶好評推薦」）。那是 mock AI 產生的範例文字，只出現在 `/demo` 的模擬輸出裡，不在 AC-008 的掃描目錄內；未更動。
- ESLint 設定（`eslint.config.mjs`）只套用 JS 規則，實際上不會檢查 `.ts`／`.tsx`；型別錯誤由 `npm run typecheck` 把關。要加 TypeScript／React lint 規則屬另一項工作。
- 本機以 Node v26.13.1 驗證，CI 使用 Node 20；以 PR 上的 CI 結果為準。
- CI 的 deploy job 在 push 到 `main` 時會部署到 Vercel production；合併本 PR 等同部署，合併前請先完成 Exit gate 覆審。
- 本分支建立在未合併的 Draft PR #2（`chore/prd-rebuild`）之上，因此對 `main` 的 PR 會包含 #2 的文件 commit。
- `ai-landing-specialist`：HEAD `index.html` 已被通用模板導向覆蓋，服務官網內容只在 `8e0625e`。
- `claude-code-training`：`.env`（僅本機 SQLite 路徑）與 `prisma/dev.db`（空表）被提交；`AUTH_SECRET` 有寫死預設值；這些模組沒有搬入。

## 下一步

1. Sean 覆審 PR：服務方案文字、報價方式、個資告知文字、示範案例標示（Exit gate）。
2. Sean 決定上表「待 Sean 覆審與決定」各項後，更新 `src/content/*`。
3. M2：選定諮詢送達管道、隱私權政策、外部教材整合、真實案例（需客戶同意）。
