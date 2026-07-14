// AI 員工外包平台 - 核心型別定義

export type AgentCategory =
  | 'customer_service'
  | 'marketing'
  | 'design'
  | 'secretary'
  | 'data'
  | 'sales'
  | 'hr'
  | 'legal'
  | 'finance'
  | 'specialist';

export type ModelType = 'gpt-4o' | 'claude-3.5';

export interface AIAgent {
  id: string;
  name: string;        // customer-service-agent
  displayName: string; // 客服 Agent
  category: AgentCategory;
  categoryLabel: string;
  description: string; // 一句話描述
  systemPrompt: string; // 系統提示詞（精簡版，MVP 用於 mock 執行）
  modelType: ModelType;
  isActive: boolean;
}

export type TaskStatus = 'running' | 'success' | 'failed' | 'partial';

export interface AgentResult {
  agentId: string;
  agentName: string;
  status: TaskStatus;
  output: string;
  durationMs: number;
  costNTD: number;
  error?: string;
}

export interface TaskLog {
  id: string;
  taskName: string;
  input: string;
  agentIds: string[];
  agentNames: string[];
  results: AgentResult[];
  status: TaskStatus;
  totalCost: number;
  totalDurationMs: number;
  templateId?: string;
  templateName?: string;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  agentIds: string[];
  defaultInput: string;
  usageCount: number;
  createdAt: string;
}

export type UserTier = 'free' | 'kol' | 'pro' | 'enterprise';

export interface UserSettings {
  tier: UserTier;
  monthlyTaskLimit: number;
  monthlyTaskUsed: number;
  defaultCostLimit: number; // 單任務 NT$ 上限
  apiKeyOpenAI?: string;
  apiKeyClaude?: string;
  workspaceName: string;
}

export type View =
  | 'dashboard'
  | 'agents'
  | 'task_new'
  | 'tasks'
  | 'templates'
  | 'usage'
  | 'settings';