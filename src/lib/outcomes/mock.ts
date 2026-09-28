// 純前端示範資料；對應 prototype/outcome-workbench-preview-v3.html
// 所有金額、筆數、估算皆為 mock 範例，不得在 UI 上宣稱實測結果

import type { OutcomeArtifact, OutcomePackId } from './types';

export const OUTCOME_PACK_LABELS: Record<OutcomePackId, { name: string; tagline: string; emoji: string }> = {
  'cs-faq': {
    name: '客服 FAQ',
    tagline: '一週客服信件彙整 → FAQ 草稿與回覆建議',
    emoji: '💬',
  },
  'order-anomalies': {
    name: '訂單異常清單',
    tagline: '一週訂單異常彙整 → 待處理清單與責任歸屬',
    emoji: '🧾',
  },
  'social-weekly': {
    name: '社群內容週報',
    tagline: '一週社群數據彙整 → 週報與下週內容建議',
    emoji: '📣',
  },
};

const CS_FAQ_ENTRIES = [
  {
    title: '週末可以到店自取咖啡豆嗎？',
    source: 2,
    text: '可以的！週六自取時段為 10:00–18:00，週日暫不開放。請提供訂單編號與預計到店時間，我們會先為你備妥咖啡豆。',
    foot: '已參照本週營業公告；使用前請再次確認。',
  },
  {
    title: '咖啡豆開封後，應該怎麼保存？',
    source: 2,
    text: '請保留原包裝，取用後封緊袋口，放在陰涼乾燥、避免日照的位置。每次取豆後盡快密封，並依包裝標示的賞味期限飲用。',
    foot: '依店內保存說明整理，未額外補充期限。',
  },
];

const CS_FAQ_SOURCES = [
  {
    name: '客服對話_0921-0924.csv',
    type: 'CSV',
    details: '42 則對話 · 第 8–14、27–31 列',
    quote: '「這週六能自取嗎？」／「開封後要放冰箱嗎？」',
  },
  {
    name: '門市營業與商品說明.txt',
    type: 'TXT',
    details: '人工貼上 · 9/24 09:35 更新',
    quote: '§1：週六 10:00–18:00 可自取。§3：封緊袋口，陰涼乾燥保存。',
  },
];

const ORDER_ENTRIES = [
  {
    title: '訂單 #SG-0923-017｜收件地址缺漏',
    source: 1,
    text: '第 18 列的收件地址只有縣市與行政區，未包含街道及門牌。建議先核對原始訂單，確認完整地址後再安排出貨。',
    foot: '來源欄位：shipping_address；尚未判定出貨狀態。',
  },
  {
    title: '訂單 #SG-0922-006｜付款與出貨狀態待核對',
    source: 1,
    text: '第 7 列的付款狀態為「待付款」，出貨狀態卻為「已出貨」。請核對付款紀錄與出貨單，確認是否為匯出資料尚未更新。',
    foot: '此處僅提示差異，不判定欠款或物流異常。',
  },
];

const ORDER_SOURCES = [
  {
    name: 'orders_0921-0924.csv',
    type: 'CSV',
    details: '68 筆訂單 · 第 7、18 列',
    quote: '第 7 列：待付款／已出貨。第 18 列：地址欄位未含街道門牌。',
  },
];

const SOCIAL_ENTRIES_DELIVERED = [
  {
    title: '本週觀察｜手沖教學貼文的收藏較多',
    source: 1,
    text: '在這份匯出資料中，9/22 的「三個手沖小技巧」獲得 18 次收藏，是本週 6 篇貼文中最多的一篇。可以將它列為下週內容討論的參考。',
    foot: '18 次收藏為範例數據，僅在同一份匯出資料內比較。',
  },
  {
    title: '下週可嘗試｜延伸一個常見沖煮問題',
    source: 1,
    text: '可從本週手沖教學延伸一篇常見問題說明，例如研磨粗細如何影響風味。這是一個內容方向建議，尚未經後續成效驗證。',
    foot: '建議與已知資料分開呈現，不預測互動成長。',
  },
];

const SOCIAL_SOURCES_DELIVERED = [
  {
    name: 'social_posts_week39.csv',
    type: 'CSV',
    details: '6 篇貼文 · 第 2–7 列',
    quote: '9/22 手沖小技巧：18 次收藏。其餘 5 篇：3–12 次收藏。',
  },
];

const EXTRACTING_SOURCES = [
  {
    name: '客服補充_0924.csv',
    type: 'CSV',
    details: '18 則對話 · 檔案檢查範例',
    quote: '來源內容尚未轉為交付物，待擷取完成後再供審閱。',
  },
];

export const SAMPLE_OUTCOMES: OutcomeArtifact[] = [
  {
    id: 'cs-faq-2026-w39',
    packId: 'cs-faq',
    state: 'awaiting-approval',
    title: '每週客服 FAQ',
    weekLabel: '2026 第 39 週',
    weekRange: '9/21 – 9/27',
    createdAt: '2026-09-27T09:42:00+08:00',
    generatedAt: '2026-09-24T09:42:00+08:00',
    modelLabel: 'MiniMax（模型示例）',
    estimatedCostNtd: 8,
    costLimitNtd: 20,
    sourceSummary: '客服信箱 9/21–9/27，共 42 則對話',
    evidence: [
      {
        id: 'ev-cs-1',
        sourceLabel: '客服對話_0921-0924.csv',
        sourceType: 'csv',
        count: 42,
        capturedAt: '2026-09-24T09:35:00+08:00',
        snippet: '「這週六能自取嗎？」「開封後要放冰箱嗎？」',
      },
      {
        id: 'ev-cs-2',
        sourceLabel: '門市營業與商品說明.txt',
        sourceType: 'note',
        count: 1,
        capturedAt: '2026-09-24T09:36:00+08:00',
      },
    ],
    entries: CS_FAQ_ENTRIES,
    sources: CS_FAQ_SOURCES,
    version: 1,
    subtitle: '42 則對話 · 2 個主要問題',
    countLabel: '2 則回覆草稿',
    sourceCountLabel: '2 份來源',
    kicker: '把常見問題，變成下次可用的回答',
    description: '從本週客服對話整理出兩個常見問題。回覆內容可直接編輯；每一則都能對照右側來源。',
    notice: '本範例的自取時段已有來源。若實際營業安排變更，請先更新草稿，再核准。',
    draftMarkdown: '# ' + CS_FAQ_ENTRIES.map(e => e.title).join('\n\n'),
    approval: null,
    channels: ['faq-page', 'support-team'],
    isMock: true,
  },
  {
    id: 'order-anomalies-2026-w39',
    packId: 'order-anomalies',
    state: 'draft',
    title: '訂單異常清單',
    weekLabel: '2026 第 39 週',
    weekRange: '9/21 – 9/27',
    createdAt: '2026-09-24T08:16:00+08:00',
    generatedAt: '2026-09-24T08:16:00+08:00',
    modelLabel: 'MiniMax（模型示例）',
    estimatedCostNtd: 6,
    costLimitNtd: 20,
    sourceSummary: '訂單系統 9/21–9/27 異常 2 筆待確認',
    evidence: [
      {
        id: 'ev-ord-1',
        sourceLabel: 'orders_0921-0924.csv',
        sourceType: 'csv',
        count: 68,
        capturedAt: '2026-09-24T08:12:00+08:00',
        snippet: '第 7 列：待付款／已出貨。第 18 列：地址欄位未含街道門牌。',
      },
    ],
    entries: ORDER_ENTRIES,
    sources: ORDER_SOURCES,
    version: 1,
    subtitle: '68 筆訂單 · 2 筆待確認',
    countLabel: '2 筆待確認',
    sourceCountLabel: '1 份來源',
    kicker: '讓需要留意的訂單，先被看見',
    description: '整理本週訂單匯出中的缺漏與狀態差異。以下為待確認項目，請核對原始訂單後決定處理方式。',
    notice: '來源中的狀態差異不等於實際異常。請向原始訂單紀錄確認，避免直接採取處置。',
    draftMarkdown: '# ' + ORDER_ENTRIES.map(e => e.title).join('\n\n'),
    approval: null,
    channels: ['ops-team'],
    isMock: true,
  },
  {
    id: 'social-weekly-2026-w39',
    packId: 'social-weekly',
    state: 'delivered',
    title: '社群內容週報',
    weekLabel: '2026 第 39 週',
    weekRange: '9/21 – 9/27',
    createdAt: '2026-09-23T16:30:00+08:00',
    generatedAt: '2026-09-23T16:30:00+08:00',
    modelLabel: 'MiniMax（模型示例）',
    estimatedCostNtd: 4,
    costLimitNtd: 20,
    sourceSummary: 'IG / FB / Threads 9/21–9/27 內容與互動數據；由人工於 9/23 17:05 核准',
    evidence: [
      {
        id: 'ev-soc-1',
        sourceLabel: 'social_posts_week39.csv',
        sourceType: 'csv',
        count: 6,
        capturedAt: '2026-09-23T16:25:00+08:00',
        snippet: '9/22 手沖小技巧：18 次收藏。其餘 5 篇：3–12 次收藏。',
      },
    ],
    entries: SOCIAL_ENTRIES_DELIVERED,
    sources: SOCIAL_SOURCES_DELIVERED,
    version: 2,
    subtitle: '6 篇貼文 · 已核准範例',
    countLabel: '2 則內容觀察',
    sourceCountLabel: '1 份來源',
    kicker: '把這一週的內容，留成下一週的線索',
    description: '彙整本週 6 篇貼文的內容與互動數。此份為已交付狀態範例，可下載或複製；重新編輯會回到待人工核准。',
    notice: '核准範例：林小姐 · 2026/09/23 17:05。這是介面展示紀錄，不代表真實帳號已核准。',
    draftMarkdown: '# ' + SOCIAL_ENTRIES_DELIVERED.map(e => e.title).join('\n\n'),
    approval: {
      by: 'human-demo',
      at: '2026-09-23T17:05:00+08:00',
      acknowledgedCheck: true,
      contentCheck: true,
    },
    channels: ['social-ig', 'social-fb'],
    isMock: true,
  },
  {
    id: 'extracting-cs-2026-w39-04',
    packId: 'cs-faq',
    state: 'captured',
    title: '客服補充資料',
    weekLabel: '2026 第 39 週',
    weekRange: '9/21 – 9/27',
    createdAt: '2026-09-24T11:05:00+08:00',
    generatedAt: '',
    modelLabel: '尚未呼叫（範例）',
    estimatedCostNtd: 0,
    costLimitNtd: 20,
    sourceSummary: '18 則新增對話 · 擷取中',
    evidence: [
      {
        id: 'ev-cs-3',
        sourceLabel: '客服補充_0924.csv',
        sourceType: 'csv',
        count: 18,
        capturedAt: '2026-09-24T11:00:00+08:00',
      },
    ],
    entries: [],
    sources: EXTRACTING_SOURCES,
    version: 1,
    subtitle: '18 則新增對話 · 擷取中',
    countLabel: '尚無草稿',
    sourceCountLabel: '1 份來源',
    kicker: '先把資料準備好',
    description: '本週新增的客服對話正在整理。此畫面展示擷取中的狀態，不會在背景執行真實任務。',
    notice: '',
    draftMarkdown: '',
    approval: null,
    channels: [],
    isMock: true,
  },
];

// 新任務示範時，建立「擷取中」的空狀態
export function buildEmptyCapturingArtifact(packId: OutcomePackId, weekLabel: string, weekRange: string): OutcomeArtifact {
  const sourceName =
    packId === 'cs-faq'
      ? '客服補充資料.csv'
      : packId === 'order-anomalies'
        ? '訂單補充資料.csv'
        : '社群補充資料.csv';
  const id = `local-${packId}-${Date.now()}`;
  const kind =
    packId === 'cs-faq' ? '客服 FAQ' : packId === 'order-anomalies' ? '訂單異常' : '社群週報';
  return {
    id,
    packId,
    state: 'captured',
    title: `${kind}｜新任務`,
    weekLabel,
    weekRange,
    createdAt: new Date().toISOString(),
    generatedAt: '',
    modelLabel: '未呼叫（範例）',
    estimatedCostNtd: 0,
    costLimitNtd: 20,
    sourceSummary: '任務已在本機示範中建立。請準備來源資料；此原型不會上傳檔案或啟動背景處理。',
    evidence: [
      {
        id: `${id}-ev-1`,
        sourceLabel: sourceName,
        sourceType: 'note',
        count: 0,
        capturedAt: new Date().toISOString(),
      },
    ],
    entries: [],
    sources: [
      {
        name: sourceName,
        type: '待提供',
        details: '尚未上傳或讀取任何資料',
        quote: '來源內容尚未提供。這是空白任務示意，不代表實際擷取。',
      },
    ],
    version: 1,
    subtitle: '新建 · 等待補充資料',
    countLabel: '尚無草稿',
    sourceCountLabel: '待提供來源',
    kicker: '先從你手邊的資料開始',
    description: '任務已在本機示範中建立。請準備來源資料；此原型不會上傳檔案或啟動背景處理。',
    notice: '此為新建的本機示範任務；重新整理後會重置。',
    draftMarkdown: '',
    approval: null,
    channels: [],
    isMock: true,
  };
}
