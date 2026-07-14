'use client';

// Mock AI Agent 執行（純前端，不接真實 API）
// 根據 agent 角色 + 使用者輸入，產生合理的中文輸出

import type { AIAgent, AgentResult } from './types';

// 不同 Agent 角色有不同的輸出風格
const OUTPUT_TEMPLATES: Record<string, string[]> = {
  customer_service: [
    '感謝您的來信。關於您提到的問題，我已了解情況並進行內部確認。',
    '根據您的描述，建議您先嘗試以下步驟：(1) 重新整理頁面 (2) 確認網路連線 (3) 清除瀏覽器快取。如問題持續，請提供訂單編號以便進一步協助。',
    '我們非常重視您的體驗，已將此案件升級給客服主管，會在 24 小時內回覆您具體處理方案。',
  ],
  marketing: [
    '【產品文案 v1】讓生活更便利的選擇，每一天都值得擁有。立即體驗，限時優惠中。',
    '【產品文案 v2】專業品質 × 親民價格 = 您的最佳選擇。已有 10,000+ 用戶好評推薦。',
    '【產品文案 v3】不是所有產品都叫專業，但我們做到了。從今天開始，改變你的日常。',
    '【Hashtag 建議】#生活好物 #質感選物 #限時優惠 #口碑推薦 #品質生活',
  ],
  design: [
    '【設計提案】主視覺採用簡約風格，主色 #6366f1（indigo-600），輔色 #f59e0b。重點：(1) 明確 CTA 按鈕 (2) 產品大圖展示 (3) 用戶評價區塊。',
    '【Figma 元件建議】按鈕：圓角 8px、主色填滿、padding 12px 24px。卡片：陰影 shadow-md、padding 16px、圓角 12px。',
  ],
  secretary: [
    '【行程安排】09:00 晨會 → 10:30 客戶拜訪 → 13:00 午餐 → 14:30 部門 Review → 17:00 寄 Email。建議中間保留 30 分鐘緩衝。',
    '【會議議程】1. 上週進度回顧（10 分鐘）2. 本週重點項目（20 分鐘）3. 問題討論（15 分鐘）4. 待辦事項確認（10 分鐘）5. 散會（5 分鐘）',
    '【信件主旨】提案合作邀約 - {公司名} - 2026 Q3。內文：您好，我是 {公司} 的 {姓名}，想就 {議題} 與貴公司討論合作可能性...',
  ],
  data: [
    '【數據洞察】本月營收 NT$1,250,000，較上月成長 12.5%。前 5 名熱銷品項佔總營收 45%。建議加強 A 產品行銷以提升整體毛利。',
    '【報表彙整】30 天完成 100 任務，總成本 NT$280，平均每任務 NT$2.8。節省時間估計 50 小時。最常用 Agent：客服專員、文案撰寫員、財務分析師。',
    '【SQL 查詢】SELECT category, COUNT(*) as cnt, AVG(price) as avg_price FROM products GROUP BY category ORDER BY cnt DESC LIMIT 10;',
  ],
  sales: [
    '【Cold Email 主旨】{客戶公司} 與 {我們公司} 合作的可能性。開場：您好 {客戶姓名}，注意到貴公司近期推出 {產品}，我們的 {服務} 可助益...',
    '【報價單】產品 A：NT$10,000 × 10 = NT$100,000。產品 B：NT$5,000 × 20 = NT$100,000。總計 NT$200,000（含稅 NT$210,000）。有效期限 30 天。',
  ],
  hr: [
    '【JD 範本】職稱：{職位}。工作內容：(1) {職責 1} (2) {職責 2} (3) {職責 3}。條件：{學歷} + {經驗}。待遇：NT${薪資}。',
    '【面試問題】1. 請描述您過往最具挑戰性的專案 2. 您如何處理與同事意見分歧 3. 您對未來 3 年的職涯規劃 4. 為何選擇我們公司。',
  ],
  legal: [
    '【合約條款】第一條：合約期限自簽署日起 3 年。第二條：任一方欲終止合約，須於 30 日前書面通知他方。第三條：保密義務於合約終止後仍有效 5 年。',
    '【隱私權政策要點】(1) 資料蒐集目的與方式 (2) 資料保存期限 (3) 當事人權利 (4) 第三方共享 (5) 聯絡窗口。',
  ],
  finance: [
    '【記帳分錄】借：現金 NT$10,000 / 貸：銷貨收入 NT$9,524 / 貸：銷項稅額 NT$476。',
    '【預算規劃】人事成本 40%、行銷 20%、研發 15%、營運 15%、保留 10%。建議依公司階段調整。',
  ],
  specialist: [
    '【程式碼範例】```ts\nasync function fetchAgents(): Promise<AIAgent[]> {\n  const res = await fetch(\'/api/agents\');\n  return res.json();\n}\n```',
    '【PRD 範本】產品目標 / 目標用戶 / 核心功能 / 驗收標準 / 時程 / 風險。',
  ],
};

function generateOutput(agent: AIAgent, input: string): string {
  const templates = OUTPUT_TEMPLATES[agent.category] || OUTPUT_TEMPLATES.specialist;
  // 取一個模板並加入 input context
  const template = templates[Math.floor(Math.random() * templates.length)];
  const truncated = input.length > 100 ? input.slice(0, 100) + '...' : input;
  return `${template}\n\n【任務輸入】${truncated}\n【處理時間】模擬 ${(Math.random() * 3 + 1).toFixed(1)} 秒\n【AI 模型】${agent.modelType}\n【產出於】${new Date().toLocaleString('zh-TW')}`;
}

export async function runAgent(agent: AIAgent, input: string): Promise<AgentResult> {
  const start = Date.now();

  // 模擬執行時間（1-4 秒）
  const delay = Math.random() * 3000 + 1000;
  await new Promise(r => setTimeout(r, delay));

  // 5% 機率失敗（測試錯誤處理）
  const failed = Math.random() < 0.05;

  const duration = Date.now() - start;

  if (failed) {
    return {
      agentId: agent.id,
      agentName: agent.displayName,
      status: 'failed',
      output: '',
      durationMs: duration,
      costNTD: 0,
      error: `${agent.displayName} 執行失敗：API rate limit exceeded（模擬）`,
    };
  }

  const output = generateOutput(agent, input);
  // 模擬成本（每千字 token 約 NT$0.5）
  const costNTD = Math.round((output.length / 1000) * 0.5 * 100) / 100;

  return {
    agentId: agent.id,
    agentName: agent.displayName,
    status: 'success',
    output,
    durationMs: duration,
    costNTD,
  };
}

export async function runMultiAgentCollaboration(agents: AIAgent[], input: string): Promise<AgentResult[]> {
  // 平行執行所有 Agent（模擬多 Agent 協作）
  const results = await Promise.all(agents.map(a => runAgent(a, input)));
  return results;
}