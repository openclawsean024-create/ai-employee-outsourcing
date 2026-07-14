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
