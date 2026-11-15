# AI 員工外包與導入服務

> 品牌名稱為暫定名，尚未由 Sean 確認。確認後只需修改 `src/content/brand.ts`。

## 產品定位

這是**服務型產品**的官網，不是 SaaS。由 Sean 以兩種方式協助台灣中小企業把 AI 自動化做到實際上線：

- **顧問／內訓**：AI 導入諮詢、業務審計、顧問服務、員工 AI 內訓（企業包班）。
- **專案建置**：單一流程的自動化專案，以及上線後的月度維護（候選方案，是否提供待確認）。

目前是 **M1（能接案的官網／服務頁）**：訪客可以看懂服務方案與報價方式、看到標示清楚的示範案例、了解內訓課程，並送出預約諮詢（測試模式）。M1 尚未接上任何真實金流、寄信或個資儲存，**還不能對外宣傳為正式接案網站**（見 `GOAL.md` 的 Exit gate）。

規格以 [`PRD/SPEC.md`](./PRD/SPEC.md) v4.0 與 [`GOAL.md`](./GOAL.md) 為準；進度與驗證紀錄見 [`STATUS.md`](./STATUS.md)。

## 路由

| 路由 | 內容 | 資料來源 |
|---|---|---|
| `/` | 首頁：hero、痛點、兩種合作方式、三大板塊與四個空格原則、5 步導入流程、FAQ、CTA | `src/content/home.ts`、`methodology.ts`、`process.ts`、`faq.ts` |
| `/services` | 服務方案：適合對象、交付內容、時程、報價方式 | `src/content/services.ts`、`pricing.ts` |
| `/cases` | 案例（全部為示範情境） | `src/content/cases.ts` |
| `/training` | 內訓課程：基礎／進階／企業、企業包班、外部教材占位區塊 | `src/content/training.ts` |
| `/contact` | 預約諮詢表單（測試模式）與個資蒐集告知；`?type=training` 可預選需求類型 | `src/content/contact.ts`、`privacy-notice.ts`、`src/lib/inquiry/` |
| `/demo` | 舊版 144 Agent 工作台，頁首標示「示範：輸出為模擬內容，未呼叫真實 AI」 | `src/components/demo/`、`src/components/views/`、`src/lib/` |

所有路由都是靜態頁面，沒有後端 API、資料庫或登入。

### 內容怎麼改

文案、方案、價格、案例、課程都放在 `src/content/*.ts` 的型別化資料檔，元件只負責顯示：

- 品牌名：`src/content/brand.ts` 的 `BRAND`。
- 價格：`src/content/pricing.ts` 的 `Price` 型別。Sean 提供數字前一律 `QUOTE_PRICE`（顯示「諮詢後報價」）；提供後改成 `{ kind: 'fixed' | 'range', currency: 'TWD', ... }`。
- 時程：`confirmed: false` 的時程會在畫面上加註「規劃值，待確認」，確認後改為 `true`。

## 本機開發

需求：Node.js 20 以上（CI 使用 Node 20）。套件管理以 npm 與 `package-lock.json` 為準。

```bash
npm ci --legacy-peer-deps
npm run dev        # http://localhost:3000
```

其他指令：`npm run build`（正式建置）、`npm run start`（啟動建置結果）、`npm run test:watch`（Vitest watch 模式）。

本專案不需要任何環境變數或 API 金鑰，也不要提交 `.env`。

## 驗證

提交前依序執行，四個指令都必須 exit 0（CI 會執行同一組檢查，任何一項失敗 CI 就失敗）：

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

每條驗收條件（`GOAL.md` 的 AC-001～AC-012）都有對應測試，測試名稱標有 AC 編號，可以單獨執行：

| AC | 指令 |
|---|---|
| AC-001 服務方案頁 | `npm test -- services` |
| AC-002 報價方式 | `npm test -- pricing` |
| AC-003 案例頁 | `npm test -- cases` |
| AC-004 預約表單、AC-005 個資告知 | `npm test -- contact` |
| AC-006 內訓課程頁 | `npm test -- training` |
| AC-007 內容搬遷 | `npm test -- content` |
| AC-008 未查證宣稱 | `npm test -- no-unverified-claims` |
| AC-009 示範頁 | `npm test -- demo` |
| AC-010 首頁導覽與品牌 | `npm test -- home` |
| AC-011 README | `npm test -- readme` |
| AC-012 品質關卡 | `npm test -- quality-gate` |

尚未配置：E2E 測試、格式化工具（Prettier）。

## 示範情境與測試模式

這個網站目前沒有任何真實實績，所有可能被誤認為實績的內容都有標示：

- **示範情境**：`/cases` 的每個案例都是 `kind: 'demo'`，卡片上顯示「示範情境」徽章與「非真實客戶案例」。情境中的公司是虛構的，沒有客戶名稱、成效數字或推薦語。要放真實案例時，資料必須帶 `consentConfirmedBySean: true` 與來源，否則測試會失敗。
- **測試模式**：`/contact` 表單通過驗證後交給 `src/lib/inquiry/adapter.ts` 的 `submitInquiry`。M1 的實作是 mock：不發任何網路請求、不寫入任何儲存空間，成功畫面顯示「測試模式，資料未送出」。
- **諮詢後報價**：所有方案的價格都顯示「諮詢後報價」，幣別一律新台幣（NT$）。實際價格待 Sean 提供。
- **規劃值，待確認**：服務時程與流程天數搬自舊版頁面，尚未經 Sean 確認。
- **模擬輸出**：`/demo` 的任務輸出是固定文案（`src/lib/orchestrator.ts`），沒有呼叫任何 AI 服務；頁內的方案、金額與指標是舊版介面示意，不是本服務的報價或實績。
- **禁用詞掃描**：`src/__tests__/no-unverified-claims.test.ts` 會掃描 `app/`、`src/components/`、`src/content/`，出現未查證的評分、用戶數、市場統計或實績說法時測試失敗。

## 資料與個資

- 諮詢表單（姓名、Email、公司、公司規模、需求類型、預估人數、需求說明）在 M1 **不會離開瀏覽器，也不會被儲存**；送出後表單會清空。
- 表單上方有個資蒐集告知（蒐集目的、資料類別、利用期間與方式、當事人權利、不提供的影響）與必勾的同意核取方塊。告知文字是 `v0.1 草稿`，**尚待 Sean／法務確認**，不是正式的隱私權政策。
- `/demo` 的任務、範本與設定只存在使用者自己瀏覽器的 localStorage／IndexedDB。
- 測試與示範只使用明顯的假資料（`王測試`、`test@example.com`、`範例股份有限公司`）。repo 內不得出現真實姓名、聯絡方式、客戶名稱或任何憑證。
- 接上真實送達管道（Email、表單服務、CRM）前，必須先由 Sean 選定並授權管道，並補上隱私權政策、保存期限與刪除流程（`PRD/SPEC.md` FR-014、FR-015，屬 M2）。

## 相關 repo 與外部教材狀態

| Repo | 與本 repo 的關係 | 狀態 |
|---|---|---|
| `openclawsean024-create/ai-landing-specialist` | 內容來源：`8e0625e` 版的服務天梯、痛點、方法論、導入流程、FAQ、預約表單欄位 | 已搬入內容；原 repo 未修改，封存時程由 Sean 決定 |
| `openclawsean024-create/claude-code-training` | 內容來源：課程程度、課程卡欄位、企業包班、顧問方案描述、zod 驗證 | 已搬入內容；登入、Prisma、報名、付款相關模組沒有搬；原 repo 未修改 |
| `openclawsean024-create/claude-code-enterprise-training`、`openclawsean024-create/ai-team-intro` | 相關 repo，沒有搬入程式 | 封存候選，由 Sean 決定 |
| `sean0407/enterprise-ai-adoption-course` | Sean 的企業 AI 內訓教材（私人 repo） | **尚未整合**。本 repo 沒有讀取或複製其內容，`/training` 只有「企業 AI 導入教材整合中」占位區塊；內容、授權與公開範圍待 Sean 提供（M2） |

## 待 Sean 決定

品牌名稱、各方案實際價格、是否提供月度維護、時程數字、`/demo` 去留、諮詢送達管道、可公開的真實案例、個資告知文字、外部教材的整合方式。詳見 `PRD/SPEC.md` §13 與 `STATUS.md`。
