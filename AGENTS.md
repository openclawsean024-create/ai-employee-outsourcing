# AGENTS.md — AI 員工外包與導入服務

## 1. 權威規格與範圍

- Single Source of Truth：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0；目前里程碑：[`GOAL.md`](./GOAL.md)（M1）。
- 本產品是**服務型產品**（顧問／內訓、專案建置）。M1 產出是能接案的官網／服務頁，不是 SaaS。
- 所有實作必須對應 SPEC §6 的 FR 編號與 GOAL.md 的 AC 編號。
- 舊文件 `ARCHITECTURE*.md`、`LINDY-CLONE-REPORT.md`、`PROJECT_STATE.md`、`REQUIREMENTS.md`、`STYLE-NOTES.md`、`PRD/ARCHITECTURE.md`、`PRD/DECISIONS.md`、`PRD/SPRINT-2-BACKLOG.md` 描述的是舊 SaaS 定位，僅供參考，與 SPEC v4.0 衝突時以 SPEC 為準。

## 2. 專案結構（2026-11-16 實際狀態）

```
app/
  layout.tsx          # 根 layout（Manrope 字型、metadata）
  page.tsx            # 唯一路由 "/"，client component，依 store 的 currentView 切換 7 個 view
  globals.css         # 設計 token 與元件 class
src/
  components/
    Sidebar.tsx, MobileTabBar.tsx
    views/            # Dashboard / Agents / NewTask / Tasks / Templates / Usage / Settings 與子元件
  lib/
    agents-catalog.ts # 144 個 Agent、10 大類（靜態資料 + 查詢函式）
    agents.ts         # 向後相容 re-export
    orchestrator.ts   # mock 多 Agent 執行（隨機文案、延遲、5% 模擬失敗），不呼叫真實 AI
    store.ts          # zustand（persist 到 localStorage "aieo-storage"）
    db.ts             # Dexie（IndexedDB "ai-employee-outsourcing"：tasks、templates）
    types.ts, utils.ts
  __tests__/          # 7 個 Vitest 測試檔
PRD/                  # SPEC.md 與舊版文件
dashboard.html        # 通用模板，不在 Next.js 路由內，與產品無關
.github/workflows/ci.yml
```

M1 預計新增 `src/content/`（services、cases、training、process、faq、methodology、brand 等型別化資料檔）與 `/services`、`/cases`、`/training`、`/contact`、`/demo` 路由，詳見 GOAL.md。

## 3. 技術棧

- Next.js 16（App Router）、React 19、TypeScript 5、Tailwind CSS 3
- 狀態與本機資料：zustand 5、Dexie 4（IndexedDB）
- 測試：Vitest 4、jsdom、@testing-library/react、fake-indexeddb
- Lint：ESLint 9（flat config `eslint.config.mjs`）
- 部署：Vercel（`vercel.json`；CI deploy job 只在 push 到 main 時執行）

## 4. 開發規則

1. 修改前先讀本檔、`SOP.md`、`STATUS.md`、`GOAL.md` 與 SPEC 對應章節。
2. **只用假資料**：測試與示範一律使用明顯的假資料（如 `王測試`、`test@example.com`、`範例股份有限公司`）。不得寫入真實姓名、電話、Email、客戶名稱或客戶資料。
3. **不得提交憑證**：API 金鑰、token、密碼、`.env` 一律不進 repo；需要時只透過部署平台環境變數，並在文件中只寫變數名稱。發現疑似憑證時停止並回報，不要複製內容。
4. **測試不可為了通過而刪改斷言**：既有測試失敗時修正程式或與 Sean 確認需求變更；不得刪除、放寬或 skip 斷言。新增功能必須附測試。
5. **不得虛構實績**：案例、評分、用戶數、市場數字必須有出處；沒有就標「示範情境」或「待確認」。`no-unverified-claims` 測試（M1 新增）必須保持通過。
6. **M1 不接外部服務**：不接真實金流、寄信、資料庫、CRM、AI API；表單送出走 mock adapter。
7. 要併入的 repo（`ai-landing-specialist`、`claude-code-training`）與相關 repo（`claude-code-enterprise-training`、`ai-team-intro`）只讀；不得 push、封存、刪除、改名或改設定。
8. 不得 push 到 `main`、不得 force push、不得自行合併 PR；變更以分支 + PR 提交，由 Sean 審核。
9. auth、金流、個資儲存、寄信、secrets、部署設定的變更需 Sean 人審。

## 5. 驗證命令

| 類型 | 命令 | 現況 |
|---|---|---|
| Lint | `npm run lint` | 已配置（`eslint .`） |
| Typecheck | `npx tsc --noEmit` | 可執行，但尚未配置成 npm script（M1 AC-012 新增 `npm run typecheck`） |
| Unit | `npm test` | 已配置（`vitest run`），7 檔 98 測試 |
| E2E | — | 尚未配置 |
| Build | `npm run build` | 已配置（`next build`） |

詳細步驟與注意事項見 `SOP.md`。

## 6. Commit 規則

使用 `<type>(scope): <說明>`，在說明或內文引用 FR／AC 編號，例如 `feat(contact): AC-004 預約諮詢表單 mock adapter`。
