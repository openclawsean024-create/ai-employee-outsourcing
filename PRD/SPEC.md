# AI 員工外包與導入服務 — 產品規格（PRD）v4.0

> 版本：v4.0（2026-11-16，PRD 與 GOAL 重建）
> 商業依據：Notion 資料庫「可產品化商品」→ 產品名稱「AI 員工外包與導入服務」，優先順序 **P1**，開發順位 **第 3 個**。
> 本版取代 v3.0.2「成果型微型營運助理」SaaS 規格。舊版內容可由 git 歷史查閱（`git show 4067b4b:PRD/SPEC.md`）；舊版的 sweet spot、商業化分數、定價與市場數字未經本次查證，不再沿用。
> 本次為**文件重建**，未修改任何功能程式碼。所有「已實作／部分／未實作」判定以 2026-11-16 各 repo 預設分支的實際程式碼為準，不以 README 推論。

---

## 1. 問題

台灣中小企業想導入 AI 自動化，常見卡點是：

1. 買了 AI 工具的帳號，但沒有人知道要用在哪個流程、怎麼接進既有系統（LINE、Email、試算表、CRM）。
2. 員工不會寫提示詞，也不確定客戶資料能不能丟進 AI 工具。
3. 顧問報告停在簡報，沒有人負責把流程做到上線並維護。

本產品是**服務型產品**：由 Sean 以「顧問／內訓」與「專案建置」兩種方式，協助企業把 AI 自動化落地。軟體（本 repo）的角色是**能接案的官網／服務頁**，不是 SaaS。

## 2. 目標客群

- 主要：想導入 AI 自動化的**台灣中小企業**（老闆、營運主管、IT 或行政窗口）。
- 次要：需要員工 AI 內訓的企業人資／訓練窗口。
- 不是目標：個人訂閱用戶、想自己挑 144 個 Agent 的自助使用者（這是舊版 SaaS 定位）。

## 3. 獲利模式

| 模式 | 內容 | 計價方式 | 狀態 |
|---|---|---|---|
| 顧問／內訓 | 企業 AI 導入諮詢、員工 AI 內訓（含 Claude Code 等工具課程） | 按時數、按場次或包班 | 價格待 Sean 確認 |
| 專案建置 | 單一流程自動化專案（例：客服 FAQ 自動回覆、會議紀錄→摘要→待辦） | 按專案報價 | 價格待 Sean 確認 |
| 後續維護（候選） | 上線後的監控、調整與月報 | 月費 | 是否提供待 Sean 決定 |

現有 repo 中出現過但**互相矛盾、未經確認**的價格（只列出處，不採用）：

- `ai-landing-specialist`（歷史版 `8e0625e:index.html`）：四階服務以 **USD** 標價（USD $100–500／小時、$500–3,000／案、$2,500–10,000／案、$3,000–10,000／月），但同頁 FAQ 又以 **NT$** 寫小型 PoC 3–8 萬、中型 15–50 萬、月度維護 10–30 萬。
- `claude-code-training`（`src/app/pricing/page.tsx`）：Free、NT$199／月、NT$999／月、企業包班 NT$5 萬／堂、顧問 NT$10 萬／月。
- 主 repo `src/lib/utils.ts`：SaaS 方案 免費／NT$299／NT$499／NT$4,999 每月；`DashboardHero.tsx` 又寫「每月 NT$99 起」，與前者不一致。

→ M1 必須把報價方式收斂成單一資料來源、統一幣別（NT$），實際數字由 Sean 提供；未提供前顯示「諮詢後報價」。

## 4. 競品與差異

> 以下競品名稱與分類僅供討論，**價格、市占、市場規模一律「待確認」**；本次未取得可靠出處，不填數字。

| 類型 | 代表（待確認） | 他們提供 | 本服務的差異假設（待驗證） |
|---|---|---|---|
| 通用 AI Agent／自動化平台（自助） | Lindy、Coze、Manus、Relay.app、Make、Zapier、n8n（舊版 SPEC 曾列出） | 工具本身，客戶自行設定 | 本服務替客戶設計流程並做到上線，工具可沿用這些平台 |
| 大型企管／數位轉型顧問 | 待確認 | 策略報告、大型專案 | 針對中小企業的小範圍、可快速上線專案 |
| 線上課程平台與企業內訓供應商 | 待確認 | 通用 AI 課程 | 課程結合實際導入案；繁體中文、Claude Code 等實作工具 |
| 個人接案者（外包平台） | 待確認 | 單次開發 | 從諮詢、建置到內訓的一條龍；有方法論（四個空格原則） |

差異化主張在有真實案例前不得寫成既成事實（見 §10 風險）。

## 5. 現況盤點（以程式碼為準）

### 5.1 主 repo `openclawsean024-create/ai-employee-outsourcing`（main @ `4067b4b`）

- 技術棧：Next.js 16（App Router，僅一個路由 `/`，整頁為 client component）、React 19、TypeScript、Tailwind CSS 3、zustand（persist 到 localStorage `aieo-storage`）、Dexie（IndexedDB `ai-employee-outsourcing`）、date-fns、lucide-react；測試 Vitest 4 + jsdom + Testing Library + fake-indexeddb；ESLint 9；部署設定 `vercel.json`（Vercel）。
- 實際功能：舊 SaaS 定位的「144 種 AI Agent」前端 Beta，以 store 切換 7 個 view：
  - Dashboard：hero、指標、分類、精選 Agent、上手步驟、4 個 SaaS 方案卡（Free/KOL/Pro/Enterprise）、最近任務。
  - Agent 庫：144 個 Agent、10 大類，搜尋與篩選（`src/lib/agents-catalog.ts`）。
  - 建立任務：選 Agent、輸入任務、成本上限；執行為 **mock**（`src/lib/orchestrator.ts` 隨機挑固定文案、延遲 1–4 秒、5% 機率模擬失敗），**沒有呼叫任何真實 AI API**。
  - 任務歷史（篩選、詳情 modal、行動版卡片）、範本（存／刪／套用）、用量報表、設定（工作區名稱、成本上限、JSON 匯出／匯入；API 金鑰欄位為 disabled）。
- 測試：7 個 test 檔（`src/__tests__/`），涵蓋 Agent 目錄、mock 協作、範本、歷史、子元件與 UX。
- **不存在**：服務方案頁、案例頁、報價說明、預約諮詢表單、內訓課程頁、後端 API、資料庫、登入、金流、寄信。
- 與文件不符處：
  - `README.md` 僅 2 行，未說明任何功能或啟動方式。
  - 舊 `PRD/SPEC.md` v3.0.2 描述「3 個成果型任務包 + landing + 表單 + 人工審核佇列」，程式碼**沒有**這些功能，仍是 144 Agent mock。
  - `DashboardHero.tsx` 顯示「4.9 在 Product Hunt · 已有 800+ 微型賣家使用」，無任何資料支持，屬未查證社會認同宣稱。
  - `SettingsView.tsx` 寫「目前 Beta 版僅使用平台預載金鑰」，實際上沒有任何金鑰或 API 呼叫，全為 mock。
  - 根目錄 `dashboard.html` 為通用模板（假指標），不在 Next.js 路由內，與產品無關。

### 5.2 要併入的 repo `openclawsean024-create/ai-landing-specialist`（main @ `9db33f4`，只讀）

- 技術棧：純靜態 HTML／CSS／JS，無 package.json、無測試、無 build；`vercel.json` 設定安全標頭。
- **重要**：目前 HEAD 的 `index.html` 只是一行 meta refresh，導向 `dashboard.html`（通用模板，假 API 用量指標）。真正的「AI 落地師」服務官網內容只存在於 git 歷史 `8e0625e:index.html`（v4 版）；`styles.css`、`script.js` 仍留在 HEAD，對應 v4 版。`STATUS.md` 宣稱 v4 已部署，與 HEAD 不符。
- v4 版實際內容：hero 與 CTA、3 個痛點場景、四階服務天梯（教育諮詢／付費業務審計／專項開發／月度維護）、「為什麼找我」、三大板塊與「四個空格原則」（對應板塊、具體 KPI、今日基準、60 天目標）、5 步導入流程、市場數據區、7 題 FAQ、預約 30 分鐘診斷表單（姓名、Email、公司、問題描述）。
- 表單實際行為：`script.js` 只 `console.log` 表單資料，500ms 後顯示「✓ 收到 — 24 小時內回信」，**沒有任何送出或儲存**。
- 未查證內容：「87% AI 專案死在 demo 階段」、IBM／Upwork／麥肯錫數據（無連結出處）、FAQ「電商、零售…都有實戰案例」。

### 5.3 要併入的 repo `openclawsean024-create/claude-code-training`（main @ `48e84a7`，只讀）

- 技術棧：Next.js 16.2.1、React 19.2.4、Tailwind CSS 4、Prisma 5（SQLite）、zod 4、bcryptjs；`stripe`、`@supabase/*` 列在 dependencies 但 `src/` 內**未使用**（Supabase 只有一份 migration SQL）。
- 頁面：`/`（內訓品牌首頁，「5 種變現引擎」）、`/pricing`（5 個方案）、`/courses`（呼叫 `/api/courses`，依程度篩選）、`/login`、`/register`、`/dashboard`。`/courses` 連到 `/courses/[id]`，但該頁面**不存在**（會 404）。
- API：註冊、登入（bcrypt + HMAC cookie、記憶體內 5 次失敗鎖定）、登出、課程列表與新增（`POST /api/courses` **未檢查登入或權限**）、課程詳情、報名（`stripePaymentId` 只是字串，沒有驗證付款）、課堂進度、學員 dashboard。
- 資料模型：9 張表（User、Course、Lesson、Exercise、Enrollment、Progress、Submission、Booking、Certificate）；Exercise／Submission／Booking／Certificate 沒有對應 API 或 UI。無 seed 資料，課程列表實際為空。
- 測試：1 個檔、4 個 bcrypt 雜湊單元測試。
- 未查證內容：首頁「NT$4.61 億 潛在 ARR」「5 萬 AI 工程師」「500 家企業內訓目標」「LTV/CAC 36」。
- 版控風險：`.env`（僅 `DATABASE_URL` 指向本機 SQLite 檔，不是憑證）與 `prisma/dev.db`（各表 0 筆）雖列在 `.gitignore` 仍被提交；`src/lib/auth.ts` 在缺少 `AUTH_SECRET` 時使用寫死的預設密鑰。

### 5.4 相關 repo（只讀，列為封存或併入候選）

| Repo | 實際內容 | 建議 |
|---|---|---|
| `openclawsean024-create/claude-code-enterprise-training`（master） | HEAD `index.html` 導向通用 `dashboard.html`；初版 `8add196:index.html` 為單頁課程落地頁（$99／$199／$299 seat，含「410K+ 觀看」等未查證宣稱與第三方課程名稱） | **封存候選**：內容已被 `claude-code-training` 涵蓋，無程式可搬 |
| `openclawsean024-create/ai-team-intro`（master） | 5 個 AI 代理人團隊介紹（Next.js 頁面 team／pricing／cost／dashboard、11 個獨立 HTML 小工具、Python 腳本）；`ContactForm.tsx` 以 EmailJS 送信但 key 為 placeholder，無測試 | **封存候選**；`ContactForm` 的欄位設計（公司規模、主要需求、感興趣方案）可作為 M1 表單欄位參考，不搬程式 |

封存、刪除、改名一律由 Sean 決定並親自執行，本規格不授權任何 repo 操作。

### 5.5 待整合的外部教材

- `sean0407/enterprise-ai-adoption-course`（私人 repo，本次無法讀取）：Sean 的企業 AI 內訓教材。需與本產品整合為**同一品牌**。內容、授權、是否公開皆待 Sean 提供；在取得前，M1 只放「教材整合中」的占位區塊，不得自行撰寫或推測其課綱。

## 6. 功能需求（FR）

優先級：P0 = M1 上線接案必要；P1 = M2；P2 = M3 或候選。
狀態欄位：已實作／部分／未實作（標所在 repo）。「部分」表示有素材或雛形，但未在主 repo 以可測方式完成。

| ID | 需求 | 優先 | 狀態 | 所在 repo／證據 |
|---|---|---|---|---|
| FR-001 | 服務方案頁：列出顧問／內訓、專案建置（及是否提供維護）方案，每案含適合對象、交付內容、時程、報價方式 | P0 | 部分 | ai-landing-specialist `8e0625e:index.html` 有四階服務天梯文案；主 repo 未實作 |
| FR-002 | 報價方式整合：單一資料來源、幣別統一 NT$、可顯示固定價／區間／諮詢後報價 | P0 | 部分 | 三處價格互相矛盾（見 §3）；主 repo 未實作 |
| FR-003 | 案例頁：列出案例；無真實案例時一律標示「示範情境」並附免責說明；真實案例需 Sean 提供並取得客戶同意 | P0 | 未實作 | 各 repo 皆無案例資料 |
| FR-004 | 預約諮詢表單：姓名、Email、公司、公司規模、需求類型（導入專案／內訓／諮詢）、需求說明、偏好聯絡時段；前端驗證；M1 僅測試模式送出 | P0 | 部分 | ai-landing-specialist 表單只 console.log；ai-team-intro 表單 EmailJS placeholder；claude-code-training `Booking` 模型可參考欄位 |
| FR-005 | 個資蒐集告知與同意：表單旁顯示蒐集目的、資料類別、利用期間與方式、當事人權利；未勾選同意不得送出 | P0 | 未實作 | — |
| FR-006 | 內訓課程介紹頁：課程程度（基礎／進階／企業）、企業包班形式、適合對象、預約內訓入口；外部教材占位區塊 | P0 | 部分 | claude-code-training `/pricing`、`/courses`、`Course.level`；內容需改為靜態資料 |
| FR-007 | 導入方法論與流程：5 步導入流程、三大板塊、四個空格原則 | P0 | 部分 | ai-landing-specialist `8e0625e` |
| FR-008 | FAQ（費用、時程、工具、資料安全、不懂程式能否導入） | P1 | 部分 | ai-landing-specialist `8e0625e`（需刪除未查證案例宣稱） |
| FR-009 | 品牌統一：網站名稱、標題、metadata 一致；與外部教材使用同一品牌名 | P0 | 未實作 | 現有名稱分散：「AI Employee」「AI 落地師 (AI Partner)」「Claude Code 內訓」；品牌名待 Sean 決定 |
| FR-010 | 文案真實性：使用者可見內容不得出現未查證的統計、評分、用戶數、實績 | P0 | 未實作 | 主 repo Hero「800+」「Product Hunt 4.9」；落地頁市場數據；training 首頁 ARR 數字 |
| FR-011 | README：產品定位、路由、本機開發、驗證指令、示範情境與資料政策 | P0 | 未實作 | 主 repo README 僅 2 行 |
| FR-012 | AI 員工示範 demo：既有 144 Agent mock 工作台保留為示範頁，明確標示「模擬輸出」 | P1 | 已實作（mock） | 主 repo `app/page.tsx`、`src/components/views/*`、`src/lib/orchestrator.ts` |
| FR-013 | 示範 demo 的任務範本、歷史、用量報表、JSON 匯出入 | P2 | 已實作（mock） | 主 repo `src/lib/store.ts`、`src/lib/db.ts` |
| FR-014 | 諮詢名單真實送達管道（Email／表單服務／CRM，需 Sean 授權與選定） | P1 | 未實作 | — |
| FR-015 | 隱私權政策頁（需法務或 Sean 審閱） | P1 | 未實作 | — |
| FR-016 | 外部企業 AI 內訓教材整合（`sean0407/enterprise-ai-adoption-course`） | P1 | 未實作 | 無法讀取，待 Sean 提供 |
| FR-017 | SEO 與流量分析（metadata、sitemap、分析工具，需同意機制） | P1 | 未實作 | — |
| FR-018 | 網站安全標頭（CSP、X-Frame-Options 等） | P1 | 部分 | ai-landing-specialist `vercel.json` 有 3 個標頭；主 repo 無 |
| FR-019 | 學員帳號註冊／登入 | P2 | 部分 | claude-code-training（自製 HMAC token、預設密鑰風險） |
| FR-020 | 線上課程報名、進度、練習、證書 | P2 | 部分 | claude-code-training：報名與進度 API 有；練習、證書只有 schema；無課程詳情頁 |
| FR-021 | 線上付款 | P2 | 未實作 | claude-code-training 只裝了 `stripe` 套件，未使用 |
| FR-022 | 報價單／專案管理後台 | P2 | 未實作 | — |

## 7. 非功能需求

- **NFR-01 真實性**：所有數字、評分、客戶名、案例都必須有出處或標示「示範情境」／「待確認」；以自動化檢查（禁用詞清單）把關。
- **NFR-02 隱私最小化**：表單只蒐集聯絡與需求所需欄位；M1 不落地儲存、不送往任何外部服務。
- **NFR-03 無障礙**：可鍵盤操作、表單欄位有 label、錯誤訊息以 `role="alert"` 或 `aria-live` 提示、尊重 `prefers-reduced-motion`（沿用落地頁 `script.js` 的作法）。
- **NFR-04 RWD**：390px／768px／1440px 無水平捲動；主 repo 既有行動版 tab bar 與卡片模式可沿用。
- **NFR-05 效能**：服務頁、案例頁、內訓頁以靜態產生（不需 client-side 資料庫）。
- **NFR-06 可測試性**：服務、案例、課程內容放在 `src/content/*` 的型別化資料檔，元件只讀資料，測試可直接斷言。
- **NFR-07 安全**：前端不得放任何 API 金鑰；憑證只透過部署平台環境變數；不提交 `.env`。
- **NFR-08 品質關卡**：`npm run lint`、`npm test`、`npm run build` 全數 exit 0；CI 不得以 `|| echo` 吞掉測試失敗（目前 `.github/workflows/ci.yml` 的 test job 會吞掉失敗，M1 需修正）。

## 8. 資料與個資處理

| 資料 | 來源 | M1 處理 | 之後 |
|---|---|---|---|
| 諮詢表單（姓名、Email、公司、規模、需求） | 訪客輸入 | 測試模式：只在記憶體中交給 mock adapter，不送出、不儲存、不寫 console 以外的地方；測試只用明顯假資料（如 `王測試`、`test@example.com`） | M2 由 Sean 選定送達管道，需補隱私權政策、保存期限與刪除流程 |
| 示範 demo 的任務、範本、設定 | 使用者在瀏覽器輸入 | 僅存瀏覽器 localStorage／IndexedDB（現況） | 不上雲 |
| 案例內容 | Sean 提供 | M1 僅示範情境 | 真實案例需客戶書面同意、去識別化 |
| 客戶專案資料（導入時接觸） | 客戶 | 不進入本網站 | 以 NDA 與資料處理協議約定，屬服務流程而非本 repo |

個資告知文案至少涵蓋：蒐集目的（回覆諮詢與安排會談）、資料類別、利用期間／地區／對象／方式、當事人可請求查詢、更正、刪除等權利、不提供的影響。確切文字需 Sean 或法務確認。

## 9. 法規與風險

| 項目 | 說明 | 對策 |
|---|---|---|
| 個人資料保護法 | 表單蒐集個資需履行告知義務並限於特定目的利用 | FR-005 告知與同意；M1 不儲存；M2 補隱私權政策 |
| 不實廣告／推薦見證 | 公平交易法對虛偽不實廣告的規範、推薦見證需真實 | FR-010 禁用未查證宣稱；案例標示示範情境 |
| 客戶資料與 AI 工具 | 導入時客戶資料可能進入第三方 AI 服務 | 服務合約載明資料處理方式；本 repo 不處理客戶資料 |
| 發票、營業登記與合約 | 顧問與專案收入的開票與合約形式 | 待 Sean 與會計確認，不在軟體範圍 |
| 第三方名稱與商標 | 舊落地頁提到其他課程或講師名稱 | 不搬入；如需引用需取得同意 |
| 商業風險：需要實績與信任度 | 沒有真實案例時信任度低 | 先用示範情境 + 免費診斷；Sean 取得首批客戶同意後替換為真實案例 |
| 商業風險：服務收入依賴個人時間 | 單人產能上限 | 以方法論、範本與內訓教材標準化；M3 評估線上課程與維護方案 |
| 技術風險：要併入的 repo 狀態與文件不符 | 落地頁 HEAD 已被模板覆蓋、training repo 有安全缺口 | 只搬內容與資料結構，不搬未審查的後端程式 |

## 10. 里程碑

### M1 — 能接案的官網／服務頁（詳見 `GOAL.md`）

- 主 repo 首頁改為服務官網：服務方案、報價方式、案例（示範情境）、內訓課程介紹、預約諮詢表單（測試模式）、FAQ、導入流程。
- 把 `ai-landing-specialist`（`8e0625e` 版內容）與 `claude-code-training`（課程與方案內容）中要搬的部分搬進主 repo（見 §12）。
- 既有 144 Agent mock 移到示範頁並標示模擬輸出；移除未查證宣稱。
- 補 README、`typecheck` script，修正 CI 吞錯。
- 不接真實金流、寄信、資料庫、登入。

### M2 — 真實接案與品牌整合

- Sean 選定並授權諮詢送達管道（FR-014）、隱私權政策（FR-015）。
- 整合 `sean0407/enterprise-ai-adoption-course` 教材（FR-016），統一品牌。
- 真實案例（客戶同意後）取代或並列示範情境。
- SEO、分析、安全標頭（FR-017、FR-018）；正式網域與部署。
- Sean 決定 `ai-landing-specialist`、`claude-code-training`、`claude-code-enterprise-training`、`ai-team-intro` 的封存時程。

### M3 — 規模化（視 M2 成果決定）

- 線上課程與學員系統（評估是否沿用 `claude-code-training` 的資料模型，需先補安全審查）。
- 測試模式→正式金流；報價單／專案管理後台；維護方案月報。
- 示範 demo 視需要接真實 AI（金鑰只在伺服器端）。

## 11. 成功指標

> 目標數值由 Sean 設定，本文件不預設數字。

| 階段 | 指標 | 量測方式 |
|---|---|---|
| M1 | GOAL.md 全部 AC 通過；lint／test／build exit 0；使用者可見內容無未查證宣稱 | CI 與本機指令 |
| M2 | 每月有效諮詢表單數、諮詢→付費轉換率、首批真實案例數 | 送達管道紀錄（M2 定義） |
| M3 | 顧問／內訓／專案營收占比、每案平均工時、課程或維護等非時數收入占比 | 帳務資料（不進 repo） |

## 12. 合併清單

### 12.1 從 `ai-landing-specialist` 搬入主 repo

| 搬入項目 | 來源 | 搬入方式 | 備註 |
|---|---|---|---|
| 四階服務天梯文案（教育諮詢、業務審計、專項開發、月度維護） | `8e0625e:index.html` | 轉為 `src/content/services.ts` 資料 | 價格改為待 Sean 確認的 NT$ 欄位，不沿用 USD 數字 |
| 3 個痛點場景 | `8e0625e:index.html` | 首頁區塊 | 「每天回 200 封」等描述改為示意，不當作統計 |
| 三大板塊 + 四個空格原則 | `8e0625e:index.html` | 方法論區塊／資料檔 | — |
| 5 步導入流程（免費診斷→業務審計→方案設計→PoC 部署→培訓迭代） | `8e0625e:index.html` | `src/content/process.ts` | 時程數字待 Sean 確認 |
| FAQ（7 題） | `8e0625e:index.html` | `src/content/faq.ts` | 刪除「都有實戰案例」、引用影片原話與未確認費用數字 |
| 預約診斷表單欄位與「不推長期合約」說明 | `8e0625e:index.html`、`script.js` | React 表單 + zod 驗證 + mock adapter | 移除「24 小時內回信」承諾，除非 Sean 確認 |
| 錨點平滑捲動、reduced-motion、標題 focus 的無障礙行為 | `script.js` | 以 React／CSS 重寫 | — |
| 安全標頭清單 | `vercel.json` | M2 移到主 repo 的 Next.js 設定 | M1 不改設定（FR-018） |

不搬：市場數據區（87%、IBM、Upwork、麥肯錫，無出處）；HEAD 的 `dashboard.html` 模板與 meta refresh；v1–v3 設計稿；`STATUS.md` 內的 Notion ID。

### 12.2 從 `claude-code-training` 搬入主 repo

| 搬入項目 | 來源 | 搬入方式 | 備註 |
|---|---|---|---|
| 課程程度分類（基礎／進階／企業）與課程卡欄位（標題、說明、程度、時長、價格） | `prisma/schema.prisma` `Course`、`src/app/courses/page.tsx` | 轉為 `src/content/training.ts` 的 TypeScript 型別與靜態資料 | 不搬 Prisma；課程實際內容待 Sean 或外部教材提供 |
| 企業包班形式（客製化 4 小時、10–50 人、實體＋線上、結業證書） | `src/app/pricing/page.tsx` | 內訓頁方案資料 | 價格 NT$5 萬／堂待 Sean 確認 |
| 顧問服務方案描述（每週會議、客製化 Claude Code 開發、AI 成熟度報告） | `src/app/pricing/page.tsx` | 併入 `services.ts` | 價格 NT$10 萬／月待 Sean 確認 |
| 預約欄位概念（類型 enterprise／consulting、人數、備註） | `prisma/schema.prisma` `Booking` | 轉為表單欄位「需求類型」「預估人數」 | 不建資料表 |
| zod 驗證模式 | `src/app/api/*/route.ts` | 用於表單 schema | 主 repo 需新增 `zod` 依賴 |

不搬（M1）：註冊／登入／session（`src/lib/auth.ts` 有寫死預設密鑰，且 M1 不需要帳號）；Prisma／SQLite 與 9 張表；報名、進度、練習、證書 API；`/dashboard`；NT$199／NT$999 月訂閱方案（與服務型定位不符，是否保留由 Sean 決定）；`stripe`、`@supabase/*` 依賴；首頁未查證營收數字；`.env` 與 `prisma/dev.db`。M3 若要做線上課程，再重新評估這些模組並先做安全審查。

### 12.3 主 repo 已有、不重複列

- 行動版 tab bar、卡片式 RWD 與設計 token（`app/globals.css`、`STYLE-NOTES.md`）。
- Vitest + Testing Library 測試基礎設施。
- 144 Agent mock 工作台（M1 移為示範頁）。

## 13. 待 Sean 決定

1. 對外品牌名稱（「AI 落地師」「AI 員工外包」或其他），以及與 `sean0407/enterprise-ai-adoption-course` 教材的品牌對應。
2. 各服務的實際價格或區間、是否提供月度維護、是否保留 NT$199／NT$999 個人訂閱方案。
3. 144 Agent mock 工作台：保留為示範頁（預設）或移除。
4. M2 諮詢送達管道（Email、Google 表單、CRM 等）與回覆承諾時效。
5. 是否有可公開的真實案例（需客戶同意）。
6. 外部教材的公開範圍與授權。
7. 四個相關 repo 的封存時程。
