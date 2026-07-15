# 風格探索紀錄 (暫停)

> **Status**: 暫停 (2026-07-14)
> **原因**: Sean 確立「最高指導原則」= Matt Pocock skills 工程標準。
>        後續開發邏輯不再追單一網站風格,而是 follow Matt 的 22 skills SOP。
> **參考**: ~/Program/_meta/MATT-POCOCK-SOP.md

---

## ✅ 已完成的風格 clone (保留)

| 階段 | 來源 | commit |
|---|---|---|
| Linear-style redesign | Linear 設計語言 | `92979c6` |
| Relevance AI clone | relevanceai.com | `994a7f8` + `6150215` + `a8e1172` |

**結論**: 兩個風格都嘗試過, Relevance AI 風格目前已部署在 main。
**下一步**: 套 Matt Pocock 風格 (aihero.dev 教學站視覺) 之前先確認 Sean 要 A/B/C/D。

---

## 🎨 Relevance AI 對齊 — 13 項 diff 全做 (2026-07-15)

**Source**: relevanceai.com 的 type scale + button + color tokens
**檔案**: `app/globals.css`
**Tests**: 86/86 pass ✅ | Build OK ✅ | Dev server 200 OK ✅

### 對齊結果 (vs 對手)

| # | 類別 | 對手 | 我現況 (after) | 狀態 |
|---|---|---|---|---|
| 1 | Body font-size | 16/24 | 16/25.6 | ✅ |
| 2 | H1 size | 48 | 48 | ✅ |
| 3 | H1 line-height | 57.6 (1.2) | 57.6 (1.2) | ✅ |
| 4 | H1 letter-spacing | -2.4px (-5%) | -0.05em (-5%) | ✅ |
| 5 | H2 size | 36 | 36 | ✅ |
| 6 | H2 letter-spacing | -0.9px (-2.5%) | -0.025em (-2.5%) | ✅ |
| 7 | H3 改 Inter | Inter 16/24 w400 | Inter 16/24 w400 | ✅ |
| 8 | Paragraph color | #868A97 (中灰) | #868A97 via `--fg-muted-2` | ✅ |
| 9 | Btn primary gradient | radial #6056FF→#3B32F9 | radial 4-stop (#7E6FFF→#2D27B8) | ✅ |
| 10 | Btn primary radius | 4.8px | 4.8px | ✅ |
| 11 | Btn primary height | 42px | 42px | ✅ |
| 12 | Btn primary padding | 10/20 | 10/20 | ✅ |
| 13 | Btn pill (outline) | r9999, h42, border #E6E7EA | `.btn-pill` 新增 | ✅ (未使用) |
| (額外) | Nav item | h36, p8/16, no radius/border | `.nav-item` 新增 | ✅ (未使用) |

### 額外決策 (Sean 2026-07-15 拍板)

1. **`btn-lg` 從 h44 改 h48** — baseline 變 42 後, btn-lg 必須 ≥ baseline 維持「最大」地位
2. **`btn-sm` 從 h28 改 h32** — 同邏輯, btn-sm ≤ baseline
3. **Btn primary 加 box-shadow** — 兩層陰影 (`0 1px 2px` + `0 6px 16px`), 讓 gradient + 主按鈕視覺對抗次按鈕
4. **Hero (`.text-display`) 保留 56px** — Sean 拍板選項 1, 不跟頁面 H1 統一

### 新增 token / class

- **CSS var**: `--fg-muted-2: #868A97` (對手 body 中灰)
- **CSS var**: `--border: #E6E7EA` (從 #E5E7EB 對齊對手)
- **Class**: `.btn-pill` (radius 9999, h42, outline)
- **Class**: `.nav-item` (h36, p8/16, no radius/border, `data-active="true"` for active state)

### 對齊驗證方式

```bash
cd /home/sean/Program/ai-employee-outsourcing
npx vitest run          # 86/86 pass
npx next build          # OK
npx next dev -p 3277    # http://localhost:3277/
```

**Pixel sample** (從截圖驗證 gradient 真的渲染):
- 按鈕頂部中央: `#5750F8` (亮紫)
- 按鈕底部中央: `#4E44F3` (深紫)
- RGB 跨度 9/12/5 — 微 gradient, 對手本來就這樣, 視覺對齊 ✅

---

## ⏸️ 暫停的事項

- ❌ Matt aihero.dev 風格 clone (需要先確認路徑)
- ❌ CrewAI / LangChain 風格 (已無時間, 取消)
- ❌ 進一步 Relevance AI 細節優化 (完成度已 78%, 暫停)

---

## 🎯 Matt Pocock 最高指導原則下的新方向

詳見 `~/Program/_meta/MATT-POCOCK-SOP.md`

**核心變更**:
1. 每個專案根目錄要有 `CONTEXT.md` (領域術語表)
2. 開發流程: `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`
3. 每月跑 `/improve-codebase-architecture`
4. Bug → `/diagnosing-bugs` loop
5. Merge conflict → `/resolving-merge-conflicts` by intent

---

## 📋 待 Sean 確認

[ ] 風格 clone 路徑 (A/B/C/D):
- A. Matt aihero.dev 視覺風格
- B. 內建 22 skills 的 marketplace
- C. A + B
- D. 只套 CONTEXT.md 精神

[ ] 最高指導原則的 4 大鐵律是否完整 capture
[ ] 是否要 `npx skills@latest add mattpocock/skills` 安裝到 Hermes

---

## 🧬 克隆對手網站 SOP（2026-07-15 從 Relevance + Lindy 案例萃取）

> 適用於「完全克隆某個 SaaS 對手」的設計/前端任務
> 失敗模式 = 拿到「克隆」就衝去寫 code → 做一半才發現方向錯
> 正確節奏 = 反解 → diff → Sean 拍板 → 動工 → 驗證

### 🔒 階段 0 — 必答的 2 個問題（動手前）

| # | 問題 | 為什麼必問 | 不答後果 |
|---|---|---|---|
| 1 | **對手是誰？(URL)** | 沒有 URL 就只能列候選 | 替你亂猜會做錯 |
| 2 | **預算 + 範圍？** | layout 級克隆跟 token 級克隆差 5-10 倍時間 | 1 天做完只完成 1 view 然後沒預算 |

**重要提醒**：「完全克隆」≠「我覺得這個對手很厲害所以克隆」
必查 PRD §1.1 / §1.2 確認 target customer 是否真的 match。Sean 2026-07-15 案例：

| 克隆對手 | PRD 客群 match | 結果 |
|---|---|---|
| Relevance AI | ❌ 企業 $499/月 vs 你的 NT$299 SOHO | 視覺對但定位錯亂 |
| Lindy AI | ✅ SMB AI 助理訂閱制 | 推薦 |
| CrewAI | 🟢 多 Agent 平台 (跟你的 144 agent 對齊) | 推薦 |

### 🟢 階段 1 — 反解對手（subagent + 15-20 分鐘）

啟 background subagent 做 5 件事：

```
A. 截圖（最少 16 張 PNG，含 hover/sticky/mobile 狀態）
B. Design token 真實數字（用 evaluate_script 取 computed style，不准「估」）
C. Layout 反解（hero 是 split? centered? pricing 是幾欄? footer 是 mega menu?）
D. 互動 + 微動畫（btn hover, card hover, scroll, nav 行為）
E. 設計哲學（tone, color temp, spacing philosophy）
```

**輸出**：`LINDY-CLONE-REPORT.md`（結構固定，見 subagent prompt 範本）

**驗證 subagent 報告**：
- 截圖張數 ≥ 16
- 每個 token 有真實 computed style 數字，不是「估計 16px」
- 有 mobile 版截圖
- 有 hover / sticky 狀態截圖（不是只有靜態）

### 🟡 階段 2 — Diff 報告（vs 現況 codebase，給 Sean 審）

把 REPORT.md 對照現有 view 的 JSX + globals.css，產出 diff 表：

| # | 項目 | 對手 | 我現況 | 嚴重度 | 改動難度 |
|---|---|---|---|---|---|
| 1 | Hero layout | 2-col split | centered | 🔴 | M |
| 2 | Nav bg | transparent + blur | solid white | 🔴 | S |
| 3 | Btn primary gradient | linear #6056FF→#3B32F9 | radial 4-stop | 🟡 | S |
| ... |

**每項標 3 種 severity**：
- 🔴 紅色 = 不改不算克隆
- 🟡 黃色 = 改了加分
- ⚪ 灰色 = 微差，可不改

**Sean 拍板三選一**：
- (A) 全做（13 項一次到位）
- (B) 只做紅色（最高 ROI）
- (C) 先看 source code 細節再決定

### 🔵 階段 3 — 動工（拍板後才開始）

| 改動類型 | 動哪裡 | 預估時間 |
|---|---|---|
| Token (color/font/spacing) | `app/globals.css` | 30-60 分鐘 |
| Button/Card component | `globals.css` @layer components | 30 分鐘 |
| Layout (hero/pricing/footer) | `src/components/views/<view>/*.tsx` | 1-3 小時/view |
| Interactivity (hover/animation) | 各 component + CSS transitions | 1-2 小時 |
| Mobile 版 | `MobileTabBar.tsx` + responsive classes | 30-60 分鐘 |

**一次只動一類**，跑測試驗證再進下一類。

### 🟣 階段 4 — 驗證（部署前必跑）

```bash
cd /home/sean/Program/ai-employee-outsourcing

# 1. 跑現有 tests（不能破壞既有 86 條）
npx vitest run

# 2. build
npx next build

# 3. dev server + 截圖比對
npx next dev -p 3277

# 4. 起 chrome-devtools，比對 dev vs 對手截圖
#    用 evaluate_script 抓 button / card 真實 computed style
#    用 take_screenshot 對照 subagent 報告的同位置截圖

# 5. pixel sample（針對 gradient / shadow 等眼睛看不出的）
#    PIL.Image.getpixel() 取按鈕頂/底 RGB, 確認色階跨度
```

### 🟠 階段 5 — 部署 + Notion 同步

```bash
git add .
git commit -m "design(clone): 完全克隆 <對手> <範圍> (<commit-id>)"
git push origin main

vercel --prod --yes
# 等 30 秒, 記下 production URL

# curl 驗證
curl -s -o /tmp/prod.html -w "%{http_code}\n" https://<project>.vercel.app

# 抓 CSS 確認 token 真生效
CSS_URL=$(grep -oE '/_next/static/[^"]+\.css' /tmp/prod.html | head -1)
curl -s "https://<project>.vercel.app$CSS_URL" | grep -E "btn-primary|text-h1|gradient"
```

**Notion 同步**（兩階段 PATCH）：
- Stage 1: status + vercel URL + note (append 到「進度」欄)
- Stage 2: 更新日期（單獨 PATCH，避開 Notion API date+number 衝突）
- Stage 3 驗證：re-query 確認值真的寫進去

### 🔴 已知陷阱（2026-07-15 從實戰萃取）

1. **Hero 「我現況」欄別寫 56 要分 `.text-display` vs `.text-h1`** — subagent 第一次寫混了兩個 class
2. **btn baseline 改了 btn-sm/btn-lg 一定要跟著改** — 維持 hierarchy（btn-lg ≥ baseline ≥ btn-sm）
3. **btn-primary gradient 在 48px 高的按鈕上，radial gradient 高光比例要拉到 140-180%** — 不然視覺上看不出
4. **patch tool new_string 太長會被截斷** — 一次只 patch 30-50 行，必要時拆 2-3 次
5. **CSS 用 Tailwind 4 沒 config.ts** — token 全在 `app/globals.css` 的 `:root`
6. **Notion `notion-update.py` 寫死欄位名** — `GitHub Page` / `Sean` 不存在 → 整個 PATCH 失敗 → 要直接 call Notion API
7. **Notion date + number 不能同次 PATCH** — 必拆兩階段（v6.18 SOP）
8. **Vercel OAuth 在 agent 環境天然失敗** → 沒 token 不要捏造已部署

### 📁 檔案命名規範

| 檔案 | 用途 |
|---|---|
| `<對手>-CLONE-REPORT.md` | subagent 反解報告（每次克隆一個） |
| `STYLE-NOTES.md` | 風格探索 + diff 結果 + 決策記錄（本檔） |
| `app/globals.css` | 所有 design token + component 樣式 |
| `src/components/views/<view>/*.tsx` | 各 view sub-component |

### ⏱️ 時間預算總表

| 克隆深度 | 範圍 | 預估時間 |
|---|---|---|
| Token only | color/font/spacing | 30-60 分鐘 |
| Token + 1 view | 全部 token + Dashboard | 半天 |
| Token + 5 views | 完整 layout | 1 天 |
| Token + 5 views + 互動 | 含 hover/animation/scroll | 1.5-2 天 |
| 完整 + i18n + a11y | 含 internationalization + WCAG AA | 3-5 天 |

### ✅ Sean 滿意節奏（2026-07-15 確認）

- 給「高/中/低嚴重度分級的 diff 表」
- 給 3 個選項（紅色全做 / 只做紅 / 先看 code）
- Sean 從中選
- **不要在拿到 diff 前就 promise 會做哪些**
- 驗證：13 項 diff 報告出來後 Sean 主動逐項審而不是「都做」
