# Sprint 2 Backlog — AI 員工外包平台

> **Date**: 2026-07-14
> **Source**: SPEC §X.6 已知限制 + §X.7 接力點 + 架構報告 v2 (56cef03) + E2E 驗收 (本次 #3) 綜合產出
> **Mode**: 純前端 SaaS（localStorage 模擬，**不接真實 API**）

---

## 🎯 Sprint 2 目標

**從「Demo / 展示用」升級到「可上線驗證的早期產品」**：
1. 改善「真實感」——目前預載的 144 個 Agent 太多是占位，需要把 Top 20 補到 production-quality
2. 改善「持久化」——目前 store + Dexie 沒規劃資料遷移，未來 schema 改會掉資料
3. 改善「品質工程」——Lighthouse 未實測、Lighthouse 100 是 V3 SOP 強制要求

---

## ✅ Sprint 1 已完成（2026-07-14）

| 項目 | 狀態 | Commit |
|---|---|---|
| agents.ts deep module 重構 | ✅ | `5ae52ae` |
| DashboardView 拆 6 sub-components | ✅ | `af7c2fb` |
| NewTaskView/TasksView/UsageView 拆 sub-components | ✅ | `7a3a4cb` |
| sub-component 測試 (38→86) | ✅ | `d996375` |
| 架構評分 B+ → A- | ✅ | `56cef03` |
| AgentsView 拆解（最後一根獨苗） | ✅ | `fe7ab29` |
| **Production deploy** | ✅ | `https://ai-employee-outsourcing.vercel.app` |
| **E2E 驗收（6/6 全綠）** | ✅ | 本次 #3 |
| **Notion 看板同步** | ✅ | 本次 #2 |

---

## 🚦 Sprint 2 待辦（5 條）

### 🟡 P1 — 修 UX 視覺瑕疵（本次 E2E 發現）

| # | 問題 | 位置 | 工時 |
|---|---|---|---|
| UX-1 | `NewTaskView` overLimit warning 硬寫 `#FEF3C7` | TaskInputPanel.tsx:113 | 0.5h |
| UX-2 | `TaskTable` mobile 隱藏欄位後整列可讀性下降 | tasks/TaskTable.tsx | 2h（加 mobile card view fallback） |
| UX-3 | `AgentsFiltersBar` sticky bar mobile 沒設 padding 對齊 | agents/AgentsFiltersBar.tsx | 0.5h |

### ✅ P1 — UX-2 mobile task card fallback（已完成 2026-07-17）

- **問題**：TaskTable 在 mobile 隱藏 Agent / duration 欄後，任務列資訊密度與可讀性下降。
- **決策**：新增 mobile-only card layout；desktop 保留 table layout，避免破壞既有寬螢幕 workflow。
- **驗證**：focused 15/15、full 98/98、lint pass、build pass。
- **Implementation**：待本批 commit

### ✅ P1 — Run Lighthouse 100/100/100/100（V3 SOP 強制，已完成 2026-07-17）

- **範圍**: 4 維 — Performance / Accessibility / Best Practices / SEO
- **SOP**: `~/.hermes/skills/devops/lighthouse-100-recipe`
- **基線**: desktop Accessibility 89 / Agentic Browsing 50；mobile Accessibility 96 / Agentic Browsing 100
- **交付**: desktop/mobile 四維均 100，50/50 audits pass；production screenshots + DOM + console evidence 已保存
- **Implementation commit**: `d8cd65e`
- **Deployment**: `https://ai-employee-outsourcing.vercel.app`

### 🟢 P2 — Top 20 Agent 內容升級（Demo → 真實感）

- **現況**: 144 Agent 預載但 systemPrompt 都是模板化字串（`"你是客服專員..."`）
- **目標**: 把 Top 20（業務類 + 客服類 + 行銷類前 5）改寫成 production system prompt：
  - 明確角色定位（"你是台灣電商客服專員，習慣用繁中、重視隱私"）
  - 具體行為規範（"用對話框格式回答，每段不超過 50 字"）
  - 邊界處理（"不知道時說『我會請客服主管回覆』，不擅自猜"）
- **工時**: 1 天
- **不做**: 不接真實 LLM API（純前端，mock 邏輯保留）

### 🟡 P3 — Dexie 資料遷移 SOP

- **現況**: `db.ts` 的 Dexie schema v1 定義穩定，**但**當資料 schema 需要擴充時（e.g. 加 `templateUsageCount` 欄位），使用者已有資料會壞掉
- **目標**: 寫 migration function，每改 schema 加 `db.version(2).upgrade()` block
- **工時**: 2h
- **延後理由**: 目前 schema 穩定，等真的需要改時再做

### ⚪ P3 — JSON 化 agents-catalog（架構報告 v2 列的 P3）

- **現況**: 144 物件寫在 TS 檔
- **目標**: 移到 `data/agents.json`，build-time validate
- **不做理由**: 是「非工程師編輯」用例，Sprint 2 還不需要

---

## ❌ Sprint 2 **不**做（明確排除）

| 項目 | 排除理由 |
|---|---|
| 接真實 LLM API | 不在 Sprint 2 範圍（需要 Supabase Auth + Rate limit + cost control） |
| 接 Stripe / 付費 | SPEC §X.6 列為 Sprint 3 |
| Mobile App | Next.js PWA 已夠，不需要 native |
| i18n | 台灣市場單一繁中就夠 |
| 新的 view（像 NotificationsView） | 7 views 已足，需求驅動再加 |

---

## 📦 可立即開工（無依賴）

排序 = 落地後立刻看到改進的可見度：

1. **Top 20 Agent 內容升級**（1 天，Demo 升級）
2. **UX-1 / UX-3**（共 1h，純前端、低風險、立即可見）
3. **Dexie migration SOP**（2h，預防性）

---

## 🔮 Sprint 3 預期

- 接 Supabase（auth + DB）
- 接真實 LLM（OpenAI / Claude API）
- Stripe 付費機制
- PWA 完整化（offline mode + push notification）
