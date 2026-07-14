# Architecture Improvement Report

> **Skill**: `/improve-codebase-architecture`
> **Date**: 2026-07-14
> **Codebase**: `ai-employee-outsourcing` (16 files, 2627 LOC)
> **Methodology**: Matt Pocock — A Philosophy Of Software Design (Deep Modules)

---

## 🏆 整體評分

| 維度 | 分數 | 說明 |
|---|---|---|
| **檔案大小分布** | 🟢 A | 最大 314 行, 沒有失控檔案 |
| **目錄結構** | 🟢 A | app / components / lib / __tests__ 乾淨 |
| **型別系統** | 🟢 A | 84 行 types.ts, 全專案共用 |
| **模組邊界** | 🟡 B+ | 有 1 個明顯 ball of mud |
| **可測試性** | 🟢 A | 23/23 tests pass |
| **Deep modules** | 🟡 B | store 跟 orchestrator 是 deep, 但 agents.ts 是 shallow |

**綜合**: 🟢 **B+** — 健康但有 1 個明顯的 shallow module 待重構。

---

## 🔴 Critical Issue: `lib/agents.ts` (207 行 / 144 物件 / 42 KB)

### 現況
- 144 個 AI agents **手寫在 TS 檔**作為 catalog
- 每個 agent 9 欄: `id, name, displayName, category, categoryLabel, description, systemPrompt, modelType, isActive`
- **`categoryLabel` 重複 144 次** — 明明有 `CAT_LABELS` lookup function 卻手動填入
- 物件陣列, 沒有結構化 (沒 category 索引)

### 為什麼這是 Ball of Mud

#### ❌ 1. Shallow Module (Ousterhout 反模式)
> "Modules should be deep: a lot of functionality behind a small interface."
> — A Philosophy Of Software Design

**現在**: 144 個物件全部 export 給整個程式用
```typescript
import { ALL_AGENTS } from './agents'  // 直接接觸到 144 個資料
```

**應該**: Deep module 只暴露「意圖」
```typescript
import { findAgentById, listAgentsByCategory } from './catalog'  // 只暴露查詢功能
```

#### ❌ 2. 重複資料 (DRY 違反)
每個 agent 都寫 `categoryLabel: '客服類'` — 但 `category` 已經夠了，label 可以 lookup。

#### ❌ 3. 不可序列化 / 不可編輯
- 加新 agent = 改 TS 程式碼
- 應該是 JSON / YAML / DB

#### ❌ 4. type 系統沒發揮作用
`id: 'a001'` 是字串, 但沒驗證唯一性

---

## 🎯 建議重構方案

### 方案 A: **拆出 catalog** (推薦, 4 小時)

```
src/lib/
├── agents.ts          ← 只保留 buildPrompt helper + CAT_LABELS
├── agents-catalog.ts  ← 新建, 144 物件搬到這
└── types.ts           ← 不動
```

**改動**:
- 把 144 個物件移到 `agents-catalog.ts` (只 export data, 不 export 邏輯)
- 寫 `findAgentById(id)`, `listAgentsByCategory(cat)`, `agentsById: Map<string, AIAgent>` 工具
- 移除 `categoryLabel` 重複 (從 `category` lookup 自動算出)
- 加 `isValidAgentId()` type guard

### 方案 B: **JSON 化** (更乾淨, 6 小時)

```
data/agents.json       ← 144 物件的 JSON
src/lib/
└── agents.ts          ← 只 import + 提供 query functions
```

**優點**:
- 非工程師也能編輯
- 可以 build-time validate JSON schema
- 可以分檔 (per category)

### 方案 C: **維持現狀** (不做)

**理由**:
- MVP 階段還沒接真實 AI
- 144 個是 mock data
- 重構成本 > 收益 (短期)

---

## 🟡 Minor Issues (記下, 不急)

### 1. 重複 className 字串 (Tailwind utility)
DashboardView / TasksView 都用 `rounded-lg border border-slate-200 bg-white p-6` 多次。

**建議**: 抽 `<Card>` 元件

### 2. 重複的 mock executeTask 邏輯
- `lib/orchestrator.ts` (106 行)
- `lib/store.ts` (160 行)

可能有 mock 邏輯重複 — 待查

### 3. View 元件都 > 200 行
- DashboardView: 314
- NewTaskView: 286
- TasksView: 212
- UsageView: 211

每個 view 元件如果繼續膨脹, 該拆成 sub-components。

---

## 🚦 行動優先級

| 優先 | 動作 | 工時 |
|---|---|---|
| 🔴 P0 | 重構 `agents.ts` (方案 A) | 4h |
| 🟡 P1 | 抽 `<Card>` 共用元件 | 1h |
| 🟡 P1 | 查 orchestrator / store 重複 | 1h |
| 🟢 P2 | 拆大型 view (sub-components) | 2h |

---

## 📚 Matt Pocock 原則引用

1. **Deep Modules** (Ousterhout): `agents.ts` 現在 shallow → 應該 deep
2. **Small Steps**: 一次只重構一個檔案
3. **Feedback Loops**: 重構後跑全部 23 tests 確認沒破壞
4. **Shared Language**: `AIAgent`, `AgentCategory` 命名已經對齊

---

## ❓ 待 Sean 決定

- (a) 立即做方案 A (重構 agents.ts)
- (b) 移到方案 B (JSON 化)
- (c) 維持現狀, 這是 MVP, 以後再說
- (d) 先做 minor issues (Card + orchestrator/store 重複)
