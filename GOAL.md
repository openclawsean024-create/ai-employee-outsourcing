# Goal — AI 員工外包與導入服務 M1

## Objective

把主 repo 從「144 Agent SaaS mock」改成**能接案的服務官網**：訪客能看懂服務方案與報價方式、看到明確標示的示範案例、了解企業內訓課程，並送出預約諮詢（測試模式）。同時把 `ai-landing-specialist` 與 `claude-code-training` 中要搬的內容搬進主 repo（清單見 `PRD/SPEC.md` §12）。全程只用假資料，不接真實金流、寄信或個資儲存，不虛構任何實績。

## Acceptance criteria

- AC-001：**服務方案頁**。`/services` 從單一資料檔 `src/content/services.ts` 渲染至少「顧問／內訓」「專案建置」兩類方案（內容取自 `ai-landing-specialist@8e0625e` 四階服務天梯與 `claude-code-training` 顧問方案），每案顯示適合對象、交付內容、時程、報價方式；元件內不得寫死價格字串。
  驗證：`npm test -- services` 斷言資料檔每一筆都被渲染且欄位完整；`npm run build` 輸出的路由表含 `/services`。
- AC-002：**報價方式整合**。所有價格欄位使用同一型別 `{ kind: 'fixed' | 'range' | 'quote'; currency: 'TWD'; ... }`；Sean 未提供數字的方案一律 `kind: 'quote'`，畫面顯示「諮詢後報價」；頁面有一段報價方式說明。
  驗證：`npm test -- pricing` 斷言每個方案的 `currency === 'TWD'` 且 `kind` 合法；`grep -rnE 'USD|\$[0-9]' src/content` 無輸出（exit 1）。
- AC-003：**案例頁（示範情境）**。`/cases` 從 `src/content/cases.ts` 渲染案例；每筆有 `kind: 'demo' | 'real'`。`demo` 案例在卡片上顯示「示範情境」徽章與「非真實客戶案例」說明；`real` 案例必須帶 `consentConfirmedBySean: true` 與來源欄位，否則測試失敗。M1 若 Sean 未提供真實案例，全部為 `demo`，或頁面顯示「案例整理中」。
  驗證：`npm test -- cases` 斷言每個 `demo` 卡片含「示範情境」文字、不存在缺少同意欄位的 `real` 案例。
- AC-004：**預約諮詢表單（測試模式）**。`/contact` 表單含姓名、Email、公司、公司規模、需求類型（導入專案／內訓／諮詢）、預估人數（選填）、需求說明；以 zod schema 驗證；送出交給可替換的 `submitInquiry` adapter，M1 預設實作為 mock（不發任何網路請求、不寫入 storage），成功畫面明示「測試模式，資料未送出」。
  驗證：`npm test -- contact` 以 Testing Library 斷言：空白送出顯示各欄錯誤訊息；以假資料（`王測試`、`test@example.com`）送出時 adapter 被呼叫 1 次、`fetch` 被呼叫 0 次、`localStorage` 無新增鍵。
- AC-005：**個資告知與同意**。表單上方或旁邊顯示個資蒐集告知（目的、資料類別、利用期間與方式、當事人權利），並有必勾的同意核取方塊；未勾選不能送出。告知文字標註「待 Sean／法務確認」的版本號。
  驗證：`npm test -- contact` 斷言告知區塊含「蒐集目的」「當事人權利」字樣，未勾選同意時 adapter 呼叫 0 次。
- AC-006：**內訓課程介紹頁**。`/training` 從 `src/content/training.ts` 渲染課程程度（基礎／進階／企業）、企業包班形式與預約內訓入口（連到 `/contact` 並預選需求類型「內訓」）；另有一個「企業 AI 導入教材整合中」占位區塊，指向待整合的外部教材，不得自行撰寫該教材課綱。
  驗證：`npm test -- training` 斷言三種程度都被渲染、占位區塊存在、內訓 CTA 的連結含 `type=training`。
- AC-007：**合併內容搬遷完成**。`PRD/SPEC.md` §12.1、§12.2 列為「搬入」的每一項都已在主 repo 有對應資料檔或元件（5 步導入流程、三大板塊與四個空格原則、FAQ、服務天梯、課程程度、企業包班、預約欄位）；要併入的 repo 沒有任何 commit。
  驗證：`npm test -- content` 斷言 `process.ts` 有 5 步、`faq.ts` 至少 5 題、`methodology.ts` 含 4 個空格；`gh api repos/openclawsean024-create/ai-landing-specialist/commits/main --jq .sha` 與 `.../claude-code-training/commits/main --jq .sha` 分別仍為 `9db33f4…`、`48e84a7…` 開頭。
- AC-008：**移除未查證宣稱**。使用者可見內容（`app/`、`src/components/`、`src/content/`）不得出現未查證的評分、用戶數、市場統計或「實戰案例」說法。新增 `src/__tests__/no-unverified-claims.test.ts`，以禁用詞清單掃描上述目錄。
  驗證：`npm test -- no-unverified-claims` 通過；`grep -rnE "Product Hunt|800\+|87%|178%|4\.61 億|LTV/CAC|實戰案例" app src --include=*.tsx --include=*.ts | grep -v __tests__` 無輸出。
- AC-009：**既有 mock 工作台改為示範頁**。144 Agent 工作台移到 `/demo`，頁首固定顯示「示範：輸出為模擬內容，未呼叫真實 AI」；設定頁「僅使用平台預載金鑰」的不實說法改為正確描述。既有 98 個測試全部保留並通過，不得刪改既有斷言。
  驗證：`npm test` 總數 ≥ 98 + 新增數且全過；`git diff main -- src/__tests__ | grep -E "^-.*expect\("` 無輸出；`npm test -- demo` 斷言示範標示存在。（若 Sean 在 M1 開工前決定移除 demo，此 AC 改為「移除並保留測試紀錄」，需在 `STATUS.md` 記錄決定。）
- AC-010：**首頁導覽與品牌**。`/` 為服務官網首頁（hero、痛點、方法論、導入流程、FAQ、CTA），導覽列可到 服務／案例／內訓／預約諮詢；`app/layout.tsx` 的 title 與 description 改為服務定位，品牌名使用 Sean 確認的名稱（未確認前用 `src/content/brand.ts` 的單一常數，便於替換）。
  驗證：`npm test -- home` 斷言導覽 4 個連結的 href；`grep -n "144 種 AI Agent" app/layout.tsx` 無輸出。
- AC-011：**README 補齊**。`README.md` 至少包含：產品定位、路由一覽、本機開發、驗證指令、示範情境與測試模式說明、資料與個資政策、相關 repo 與外部教材狀態。
  驗證：`for h in "## 產品定位" "## 路由" "## 本機開發" "## 驗證" "## 示範情境與測試模式" "## 資料與個資"; do grep -q "$h" README.md || echo "missing $h"; done` 無輸出。
- AC-012：**品質關卡**。新增 `typecheck` script（`tsc --noEmit`）；`.github/workflows/ci.yml` 的 test job 移除 `|| echo "no test script"`，讓測試失敗會使 CI 失敗；lint、typecheck、test、build 全數通過。
  驗證：依序執行 `npm run lint && npm run typecheck && npm test && npm run build`，皆 exit 0；`grep -n 'no test script' .github/workflows/ci.yml` 無輸出；PR 的 GitHub Actions 檢查全綠。

## Out of scope

- 真實金流（Stripe 或任何付款）、真實寄信（SMTP、EmailJS、LINE、Slack 通知）、真實個資儲存（資料庫、Google 表單、CRM）——M1 一律以 mock adapter 與假資料處理。
- 會員註冊／登入、線上課程播放、報名、進度、練習、證書（`claude-code-training` 的後端模組不搬）。
- 真實 AI API 呼叫、任何 API 金鑰。
- 虛構或改寫成「真實」的客戶案例、評分、用戶數、市場數字。
- 撰寫或推測 `sean0407/enterprise-ai-adoption-course` 的教材內容。
- 封存、刪除、改名任何 repo；修改要併入的 repo；改 repo 設定、網域、DNS 或 production 部署設定。
- 隱私權政策正式版、SEO、分析工具、安全標頭（M2）。

## Exit gate

M1 完成前需：AC-001～AC-012 全部有指令或測試證據（記錄在 `STATUS.md`，含 exit code）；Sean 覆審服務方案文字、報價方式、個資告知文字與示範案例標示；確認 repo 內沒有真實個資或憑證。未通過不得接上真實寄信、金流或個資儲存，也不得對外宣傳為正式接案網站。
