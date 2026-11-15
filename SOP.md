# AI 員工外包與導入服務 — 開發 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 與 `GOAL.md`（M1）已依實際程式碼重建；舊 v3.0.2 SaaS 規格不再適用。
- ⚠️ 程式碼仍是舊定位的 144 Agent mock 工作台；M1 的服務官網功能尚未開發。
- ⚠️ CI test job 使用 `npm test -- --run 2>&1 || echo "no test script"`，測試失敗不會讓 CI 失敗（M1 AC-012 修正）。

## 環境

- Node.js：CI 使用 Node 20（`.github/workflows/ci.yml`）。本次文件重建時以本機 Node v26.13.1 驗證，指令皆可執行。
- 安裝：`npm ci --legacy-peer-deps`（與 CI、`vercel.json` 的 `--legacy-peer-deps` 一致）。
- repo 同時存在 `package-lock.json` 與 `pnpm-lock.yaml`；CI 與 Vercel 使用 npm，請以 `package-lock.json` 為準。

## 驗證指令

以下指令皆來自 `package.json` scripts，並於 2026-11-16 在 `main@4067b4b` 實跑：

```bash
npm ci --legacy-peer-deps   # exit 0
npm run lint                # exit 0（eslint .）
npm test                    # exit 0（vitest run：7 files, 98 tests passed）
npm run build               # exit 0（next build；路由 / 與 /_not-found，皆為靜態）
```

可執行但**尚未配置成 npm script**：

```bash
npx tsc --noEmit            # exit 0（M1 AC-012 改為 npm run typecheck）
```

**尚未配置**（不得當作已通過）：

- `npm run typecheck` — 尚未配置
- E2E（Playwright 等）— 尚未配置
- Integration test — 尚未配置
- Format（Prettier 等）— 尚未配置

其他 scripts：`npm run dev`（本機開發伺服器）、`npm run start`（啟動 build 結果）、`npm run test:watch`（Vitest watch 模式）。

## M1 開發順序建議

1. 建 `src/content/*` 型別與資料檔，先寫內容測試（AC-002、AC-007）。
2. 搬入 `ai-landing-specialist@8e0625e` 的服務天梯、流程、方法論、FAQ（用 `git show 8e0625e:index.html` 在該 repo 本機 clone 讀取，不修改該 repo）。
3. 搬入 `claude-code-training` 的課程程度與企業包班內容（只搬資料結構與文案，不搬 Prisma、auth、API）。
4. 做 `/services`、`/cases`、`/training`、`/contact` 頁面與測試（AC-001～AC-006）。
5. 既有工作台移到 `/demo` 並加示範標示（AC-009），首頁改為服務官網（AC-010）。
6. 新增禁用詞測試（AC-008）、README（AC-011）、typecheck script 與 CI 修正（AC-012）。
7. 每一步跑完整驗證指令，結果與 exit code 寫進 `STATUS.md`。

## 故意不做（M1）

- ❌ 真實金流、真實寄信、真實個資儲存、資料庫、登入。
- ❌ 真實 AI API 呼叫與任何金鑰。
- ❌ 虛構案例、評分、用戶數或市場數字。
- ❌ 修改要併入或相關的 repo；封存、刪除、改名 repo。
- ❌ 改 production 部署、網域或 repo 設定。

## 已知 blocker／待決定

- 品牌名稱、服務價格、是否保留 demo、諮詢送達管道、真實案例：待 Sean 決定（見 SPEC §13）。
- 外部教材 `sean0407/enterprise-ai-adoption-course` 無法讀取，M1 只做占位區塊。
