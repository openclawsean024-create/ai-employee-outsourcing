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
