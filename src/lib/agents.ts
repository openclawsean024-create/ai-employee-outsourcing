/**
 * agents.ts — 向後相容 re-export 層
 *
 * 設計：原本 207 行的 ALL_AGENTS + buildPrompt + CAT_LABELS + AGENT_CATEGORIES + 查詢函式
 * 全部下沉到 agents-catalog.ts（Deep Module）。
 *
 * 這層只剩：
 * 1. AGENT_CATEGORIES metadata（給 UI 顯示色塊用）
 * 2. re-export 對外 API — 維持所有既有 import 點無需修改
 *
 * 對應 ARCHITECTURE-REPORT.md 方案 A。
 */

import type { AgentCategory, AIAgent } from './types'
import {
  findAgentById,
  listAgentsByCategory,
  countAgentsByCategory,
  totalAgentCount,
  listAllAgents,
  searchAgents,
} from './agents-catalog'

export const AGENT_CATEGORIES: Array<{ key: AgentCategory; label: string; color: string }> = [
  { key: 'customer_service', label: '客服類', color: 'emerald' },
  { key: 'marketing', label: '行銷類', color: 'rose' },
  { key: 'design', label: '設計類', color: 'purple' },
  { key: 'secretary', label: '秘書類', color: 'amber' },
  { key: 'data', label: '資料類', color: 'indigo' },
  { key: 'sales', label: '業務類', color: 'sky' },
  { key: 'hr', label: '人資類', color: 'pink' },
  { key: 'legal', label: '法務類', color: 'slate' },
  { key: 'finance', label: '財務類', color: 'lime' },
  { key: 'specialist', label: '專業類', color: 'cyan' },
]

// ============================================================
// Deep Module API（推薦使用）
// ============================================================

export {
  findAgentById,
  listAgentsByCategory,
  countAgentsByCategory,
  totalAgentCount,
  listAllAgents,
  searchAgents,
}

// ============================================================
// Legacy 相容 — 既有程式碼 import 路徑不需改
// ============================================================

/**
 * @deprecated 請改用 listAllAgents() — Deep Module API
 * 保留是為了向後相容所有 `import { ALL_AGENTS }` 的呼叫點
 */
export const ALL_AGENTS: AIAgent[] = listAllAgents()

/**
 * @deprecated 請改用 findAgentById() — Deep Module API
 */
export function getAgent(id: string): AIAgent | undefined {
  return findAgentById(id)
}

/**
 * @deprecated 請改用 listAgentsByCategory() — Deep Module API
 */
export function getCategoryAgents(category: AgentCategory): AIAgent[] {
  return listAgentsByCategory(category)
}
