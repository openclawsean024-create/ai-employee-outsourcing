// 成果工作台 store（純前端示範）
// - 純記憶體 Zustand store；不寫入 IndexedDB、不寫入 localStorage、不持久化任何狀態
// - 不呼叫任何外部 API 或 AI 模型；所有資料皆來自 SAMPLE_OUTCOMES（mock）
// - 重新整理後會回到 SAMPLE_OUTCOMES 預設；當前 session 內的操作（建立 / 編輯 / 核准 / 撤回）在記憶體中生效
// - 所有工作流程規則（擷取 → 草稿 → 待人工核准 → 已交付）與核准 gate
//   都在 store boundary 強制執行；UI 不能繞過。
//   updateDraft / updateEntryText / setState_ / approve / revokeApproval / requestApproval
//   都會先通過對應 guard 才會更新狀態。

'use client';

import { create } from 'zustand';
import { SAMPLE_OUTCOMES, buildEmptyCapturingArtifact } from './mock';
import type { OutcomeApproval, OutcomeArtifact, OutcomePackId, OutcomeState } from './types';

interface OutcomeStateShape {
  artifacts: OutcomeArtifact[];
  selectedId: string;
  acknowledgedDemo: boolean; // 使用者是否已看過「這是前端示範」的提示

  select: (id: string) => void;
  startNewPack: (packId: OutcomePackId, weekLabel: string, weekRange: string) => string; // 回傳新 id
  updateDraft: (id: string, markdown: string) => void;
  // v3 對齊：在條目層級編輯單則草稿；同時 bump 版本並把狀態退回 draft
  updateEntryText: (id: string, index: number, text: string) => void;
  // v3 對齊：依 enterStatus 變更（draft / awaiting-approval / captured）的合法轉移
  setState_: (id: string, state: OutcomeState) => void;
  // v3 對齊：原子「送交人工核准」動作
  requestApproval: (id: string) => void;
  // v3 對齊：核准（需兩項勾選皆為 true）
  approve: (id: string, approval: OutcomeApproval) => void;
  // v3 對鍵：撤銷；已交付 → draft；版本遞增以便 audit
  revokeApproval: (id: string) => void;
  // demo 工具：以 mock 內容補條目；僅限非 delivered
  simulateAiEntries: (id: string) => void;
  acknowledgeDemo: () => void;
  resetAll: () => void;
}

// 合法工作流程轉移：
//  - 已交付 (delivered) 只能由 revokeApproval 處理，setState_ 不允許覆寫
//  - awaiting-approval 可進入 delivered（由 approve 處理）或回到 draft
const allowedTransitions: Record<OutcomeState, readonly OutcomeState[]> = {
  captured: ['draft', 'awaiting-approval'],
  draft: ['awaiting-approval', 'draft', 'captured'],
  'awaiting-approval': ['delivered', 'draft'],
  delivered: [], // 只允許由 revokeApproval 處理
};

const hasValidApproval = (
  a: OutcomeArtifact,
  approval: OutcomeApproval,
): boolean =>
  approval.acknowledgedCheck === true && approval.contentCheck === true;

const findIndex = (state: OutcomeStateShape, id: string) =>
  state.artifacts.findIndex(a => a.id === id);

const updateOne = (
  state: OutcomeStateShape,
  id: string,
  patch: Partial<OutcomeArtifact>,
): OutcomeArtifact[] =>
  state.artifacts.map(a => (a.id === id ? { ...a, ...patch } : a));

const detectRichEdit = (text: string): string =>
  String(text ?? '');

const hasSubmittableDraft = (artifact: OutcomeArtifact): boolean => {
  if (artifact.entries.length > 0) {
    return artifact.entries.every(entry => entry.text.trim().length > 0);
  }
  return artifact.draftMarkdown.trim().length > 0;
};

export const useOutcomeStore = create<OutcomeStateShape>((set, get) => ({
  artifacts: SAMPLE_OUTCOMES,
  selectedId: SAMPLE_OUTCOMES[0]?.id ?? '',
  acknowledgedDemo: false,

  select: id => {
    const exists = get().artifacts.some(a => a.id === id);
    if (!exists) return;
    set({ selectedId: id });
  },

  startNewPack: (packId, weekLabel, weekRange) => {
    const draft = buildEmptyCapturingArtifact(packId, weekLabel, weekRange);
    set(s => ({ artifacts: [draft, ...s.artifacts], selectedId: draft.id }));
    return draft.id;
  },

  // updateDraft：原 markdown 介面，保留向後相容。
  // 已交付的 artifact 拒絕變更；其餘狀態（captured / draft / awaiting-approval）允許更新。
  updateDraft: (id, markdown) =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const target = s.artifacts[i];
      if (target.state === 'delivered') return s;
      return {
        artifacts: updateOne(s, id, { draftMarkdown: detectRichEdit(markdown) }),
      };
    }),

  // v3 對齊：在條目層級編輯單則草稿。
  // 已交付拒絕；其餘狀態允許，並 bump 版本 + 把 awaiting-approval → draft。
  updateEntryText: (id, index, text) =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const target = s.artifacts[i];
      if (target.state === 'delivered') return s;
      if (index < 0 || index >= target.entries.length) return s;
      const nextEntries = target.entries.map((e, ei) =>
        ei === index ? { ...e, text } : e,
      );
      // 修改後一律回到 draft（即使原本是 awaiting-approval），並 bump 版本
      const nextState: OutcomeState =
        target.state === 'captured' ? 'captured' : 'draft';
      return {
        artifacts: updateOne(s, id, {
          entries: nextEntries,
          draftMarkdown: nextEntries.map(entry => `${entry.title}\n${entry.text}`).join('\n\n'),
          version: target.version + 1,
          state: nextState,
          subtitle:
            nextState === 'draft'
              ? '內容已修改 · 草稿'
              : target.subtitle,
          description:
            nextState === 'draft'
              ? '內容已修改，請重新檢查草稿與來源，再送交人工核准。'
              : target.description,
          notice:
            '草稿內容有變更，必須重新送交並完成兩項人工確認。',
        }),
      };
    }),

  // setState_：強制合法工作流程轉移；進入 delivered 需 awaiting-approval + 非空 draft + 有效 approval。
  setState_: (id, state) =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const a = s.artifacts[i];

      if (state === 'delivered') {
        if (a.state !== 'awaiting-approval') return s;
        if (!hasSubmittableDraft(a)) return s;
        if (!a.approval) return s;
        if (!hasValidApproval(a, a.approval)) return s;
      } else {
        const allowed = allowedTransitions[a.state] ?? [];
        if (!allowed.includes(state)) return s;
      }
      return { artifacts: updateOne(s, id, { state }) };
    }),

  // requestApproval：原子動作；captured → draft（無條目）或 → awaiting-approval，
  // draft → awaiting-approval。同一次 set() 內讀寫，避免 stale 覆蓋。
  requestApproval: id =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const a = s.artifacts[i];
      if (a.state === 'delivered' || a.state === 'awaiting-approval') return s;
      // 沒有任何條目：僅允許 captured → draft
      if (a.entries.length === 0) {
        if (a.state === 'captured' && a.draftMarkdown.trim() === '') {
          return { artifacts: updateOne(s, id, { state: 'draft' as const }) };
        }
        if (a.draftMarkdown.trim() === '') return s;
      } else if (!hasSubmittableDraft(a)) {
        return s;
      }
      return { artifacts: updateOne(s, id, { state: 'awaiting-approval' as const }) };
    }),

  // approve：要求 awaiting-approval + 非空草稿 + 兩項勾選皆為 true
  approve: (id, approval) =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const a = s.artifacts[i];
      if (a.state !== 'awaiting-approval') return s;
      if (!hasSubmittableDraft(a)) return s;
      if (approval.acknowledgedCheck !== true) return s;
      if (approval.contentCheck !== true) return s;
      return {
        artifacts: updateOne(s, id, {
          approval,
          state: 'delivered',
        }),
      };
    }),

  // revokeApproval：僅 delivered 可撤銷；回 draft + bump 版本 + 清 approval
  revokeApproval: id =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const a = s.artifacts[i];
      if (a.state !== 'delivered') return s;
      return {
        artifacts: updateOne(s, id, {
          approval: null,
          version: a.version + 1,
          state: 'draft',
          subtitle: '核准已撤銷 · 可編輯',
          description: '核准已撤銷，現在可以修改內容；變更後需再次完成來源與內容確認。',
          notice: '此範例的核准已撤銷，複製與下載已鎖定。',
        }),
      };
    }),

  simulateAiEntries: id =>
    set(s => {
      const i = findIndex(s, id);
      if (i < 0) return s;
      const a = s.artifacts[i];
      if (a.state === 'delivered') return s;
      // 提供與三種任務包對應的樣板條目；不呼叫任何模型，只 mock 內容
      const templates: Record<OutcomePackId, { entries: NonNullable<OutcomeArtifact['entries']>; sources: OutcomeArtifact['sources']; kicker: string; description: string; subtitle: string; countLabel: string; modelLabel: string; estimatedCostNtd: number }> = {
        'cs-faq': {
          entries: [
            {
              title: '週末可以到店自取咖啡豆嗎？',
              source: 1,
              text: '可以的！週六自取時段為 10:00–18:00，週日暫不開放。請提供訂單編號與預計到店時間，我們會先為你備妥咖啡豆。',
              foot: '已參照本週營業公告；使用前請再次確認。',
            },
            {
              title: '咖啡豆開封後，應該怎麼保存？',
              source: 1,
              text: '請保留原包裝，取用後封緊袋口，放在陰涼乾燥、避免日照的位置。每次取豆後盡快密封，並依包裝標示的賞味期限飲用。',
              foot: '依店內保存說明整理，未額外補充期限。',
            },
          ],
          sources: [
            {
              name: '客服對話_0921-0924.csv',
              type: 'CSV',
              details: '42 則對話 · 示範資料',
              quote: '「這週六能自取嗎？」／「開封後要放冰箱嗎？」',
            },
          ],
          kicker: '把常見問題，變成下次可用的回答',
          description: '從本週客服對話整理出兩個常見問題。回覆內容可直接編輯；每一則都能對照右側來源。',
          subtitle: '42 則對話 · 2 個主要問題',
          countLabel: '2 則回覆草稿',
          modelLabel: 'MiniMax（模型示例）',
          estimatedCostNtd: 8,
        },
        'order-anomalies': {
          entries: [
            {
              title: '訂單 #SG-0923-017｜收件地址缺漏',
              source: 1,
              text: '第 18 列的收件地址只有縣市與行政區，未包含街道及門牌。建議先核對原始訂單，確認完整地址後再安排出貨。',
              foot: '來源欄位：shipping_address；尚未判定出貨狀態。',
            },
          ],
          sources: [
            {
              name: 'orders_0921-0924.csv',
              type: 'CSV',
              details: '68 筆訂單 · 示範資料',
              quote: '第 18 列：地址欄位未含街道門牌。',
            },
          ],
          kicker: '讓需要留意的訂單，先被看見',
          description: '整理本週訂單匯出中的缺漏與狀態差異。以下為待確認項目，請核對原始訂單後決定處理方式。',
          subtitle: '68 筆訂單 · 1 筆待確認',
          countLabel: '1 筆待確認',
          modelLabel: 'MiniMax（模型示例）',
          estimatedCostNtd: 6,
        },
        'social-weekly': {
          entries: [
            {
              title: '本週觀察｜熱門貼文收藏數上升',
              source: 1,
              text: '本週 6 篇貼文中，「三個手沖小技巧」獲得 18 次收藏（範例數據），是 6 篇中最多的一篇。',
              foot: '範例數據，僅在同一份匯出資料內比較。',
            },
          ],
          sources: [
            {
              name: 'social_posts_week39.csv',
              type: 'CSV',
              details: '6 篇貼文 · 示範資料',
              quote: '9/22 手沖小技巧：18 次收藏。其餘 5 篇：3–12 次收藏。',
            },
          ],
          kicker: '把這一週的內容，留成下一週的線索',
          description: '彙整本週 6 篇貼文的內容與互動數。回覆內容可直接編輯；每一則都能對照右側來源。',
          subtitle: '6 篇貼文 · 1 則觀察',
          countLabel: '1 則內容觀察',
          modelLabel: 'MiniMax（模型示例）',
          estimatedCostNtd: 4,
        },
      };
      const tpl = templates[a.packId];
      return {
        artifacts: updateOne(s, id, {
          entries: tpl.entries,
          draftMarkdown: tpl.entries.map(entry => `${entry.title}\n${entry.text}`).join('\n\n'),
          sources: tpl.sources,
          state: 'draft',
          version: a.version + 1,
          kicker: tpl.kicker,
          description: tpl.description,
          subtitle: tpl.subtitle,
          countLabel: tpl.countLabel,
          sourceCountLabel: `${tpl.sources.length} 份來源`,
          modelLabel: tpl.modelLabel,
          estimatedCostNtd: tpl.estimatedCostNtd,
          generatedAt: new Date().toISOString(),
          notice: '草稿已重新產生；完成編輯後請再次送交人工核准。',
        }),
      };
    }),

  acknowledgeDemo: () => set({ acknowledgedDemo: true }),

  resetAll: () =>
    set({
      artifacts: SAMPLE_OUTCOMES,
      selectedId: SAMPLE_OUTCOMES[0]?.id ?? '',
      acknowledgedDemo: get().acknowledgedDemo,
    }),
}));
