# Architecture Report v2 — P0/P1/P2 重構後

> **Date**: 2026-07-14
> **Methodology**: Matt Pocock — A Philosophy Of Software Design (Deep Modules)
> **Baseline**: v1 報告 (b52ffc0) 綜合 B+，1 個 shallow module 待修。
> **當前**: 跑完 P0 + P1 + P2 + sub-component tests 後重新評分。

---

## 🏆 整體評分（v2）

| 維度 | v1 | v2 | 變化 | 說明 |
|---|---|---|---|---|
| **檔案大小分布** | 🟢 A | 🟢 **A+** | ↑ | 最大檔從 314 → 292 行；最大 view 從 315 → 202 行（+33% 改善） |
| **目錄結構** | 🟢 A | 🟢 **A** | → | app / components / lib / __tests__ + 新增 4 個 view 子資料夾 |
| **型別系統** | 🟢 A | 🟢 **A** | → | 84 行 types.ts 完整保留，所有 sub-component 強型別 props |
| **模組邊界** | 🟡 B+ | 🟢 **A-** | ↑↑ | agents.ts 從 ball of mud → 拆出 catalog；所有 view 主檔都 ≤ 220 行 |
| **可測試性** | 🟢 A | 🟢 **A+** | ↑ | 38 → 86 tests (+126%)，11/16 sub-components 有 unit test |
| **Deep modules** | 🟡 B | 🟢 **A-** | ↑ | agents-catalog.ts 是教科書等級 deep module（對外 6 個 pure fn） |
| **Git hygiene** | — | 🟢 **A** | 新增 | 16 個 commit，全部原子化、訊息遵循 conventional commits |

**綜合**: 🟢 **A-**（從 B+ 升一個半 grade）

---

## 📊 量化改善總結

| 指標 | v1 | v2 | Δ |
|---|---|---|---|
| 最大檔案 LOC | 314 (DashboardView) | 292 (agents-catalog) | −7% |
| 最大 view LOC | 315 (DashboardView) | 202 (AgentsView) | −36% |
| View 主檔 > 200 行 | 4 個 | **1 個**（只剩 AgentsView） | −75% |
| Sub-components（純元件） | 0 | **16 個** | +∞ |
| Sub-component 平均 LOC | — | 56 行 | 可一眼看完 |
| Test 總數 | 38 | **86** | +126% |
| Test/Source ratio | ~13% | **33%** | +20pp |
| Commit 數 | — | 16（本次 sprint） | atomic 化 |

---

## 🎯 新發現（小，記下，不急）

### 1. `AgentsView` 仍是 202 行
- **原因**: agents 列表/篩選邏輯複雜（search + category filter + selected state），沒納入 P2 拆分清單
- **建議**: 拆 3 子檔：AgentsHeader / AgentGrid / AgentDetailPanel
- **工時**: 15 min
- **優先級**: P2 candidate（一致性）

### 2. `agents-catalog.ts` 仍 292 行
- **原因**: 144 物件 + 6 個 query function，全在同一檔
- **建議**: 方案 B（JSON 化）會降到 50 行以內，但需要 build-time validation
- **工時**: 6h
- **優先級**: P3（功能正確，規模可控）

### 3. `__tests__/acceptance.test.ts` 324 行
- **原因**: Sprint 1 Day 19 累積的 10 條 AC 整合測試，全塞一起
- **建議**: 按 AC-001 ~ AC-010 拆檔
- **優先級**: P3（測試規模 OK，視覺清潔）

### 4. Tier B sub-components 沒測試
- 受 useLiveQuery 影響的有 5 個（DashboardMetrics, DashboardOnboardingSteps, DashboardCategories, DashboardRecentTasks, NewTaskView 主檔 + TasksView 主檔 + UsageView 主檔）
- 需 fake-indexeddb 設定才穩定
- 暫跳過，留給 Playwright e2e

---

## 🚦 行動優先級（v2 → v3）

| 優先 | 動作 | 工時 | 理由 |
|---|---|---|---|
| 🟢 P1 | 拆 AgentsView | 15 min | 唯一 > 200 行 view，保持一致性 |
| 🟡 P3 | 方案 B：agents-catalog JSON 化 | 6h | 未來擴充需要 |
| 🟡 P3 | 拆 acceptance.test.ts by AC | 30 min | 視覺清潔 |

**下個 sprint 推薦做 P1**，其他 P3 等時機。

---

## 🏅 亮點（值得記錄）

1. **agents-catalog.ts 是 deep module 教科書範例**
   - 對外暴露：`findAgentById`, `listAgentsByCategory`, `searchAgents`, `countAgentsByCategory`, `totalAgentCount`, `listAllAgents` 共 6 個 query
   - 內部封裝：144 個物件 + category label map
   - 「Interface is the test surface」：從測試就可推 API

2. **view 主檔降到 26-126 行（除 AgentsView）**
   - 之前的 shallow「view = 巨型檔」反模式消失
   - 每個 view 主檔現在的角色只有兩個：組合 sub-components + 取 store data

3. **Git commit 訊息品質**
   - 16 個 commit 都有 conventional commit prefix + 量化結果在 body
   - 例：`refactor(dashboard): 拆 DashboardView (315 行) → 6 sub-components`
   - 適合未來 AI agent 餵歷史 commit 做 prompt

---

**結論**: 從 v1 B+ 升到 v2 A-，最弱項（agents.ts shallow）已解，次弱項（view 過大）解決 75%。剩 AgentsView 一根獨苗 + JSON 化的策略選擇，可依商業節奏決定。
