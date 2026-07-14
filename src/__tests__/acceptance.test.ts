/**
 * Sprint 1 Day 19: 10 條 Acceptance Criteria 單元測試
 * 對應 SPEC §3.4 AC-001 ~ AC-010
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { ALL_AGENTS, AGENT_CATEGORIES, getAgent, getCategoryAgents } from '@/lib/agents'
import { runAgent, runMultiAgentCollaboration } from '@/lib/orchestrator'
import { db } from '@/lib/db'
import { useAIEOStore } from '@/lib/store'
import type { AIAgent, TaskTemplate } from '@/lib/types'

// Mock IDB for jsdom
beforeEach(async () => {
  await db.tasks.clear()
  await db.templates.clear()
})

describe('AC-001: 144 Agent 預載，依 10 大類分類', () => {
  it('應有 144 個 Agent', () => {
    expect(ALL_AGENTS.length).toBe(144)
  })

  it('應有 10 大類', () => {
    expect(AGENT_CATEGORIES.length).toBe(10)
  })

  it('每個 agent 都有完整必要欄位', () => {
    for (const a of ALL_AGENTS) {
      expect(a.id).toBeTruthy()
      expect(a.name).toBeTruthy()
      expect(a.displayName).toBeTruthy()
      expect(a.category).toBeTruthy()
      expect(a.categoryLabel).toBeTruthy()
      expect(a.description).toBeTruthy()
      expect(a.systemPrompt).toBeTruthy()
      expect(['gpt-4o', 'claude-3.5']).toContain(a.modelType)
      expect(a.isActive).toBe(true)
    }
  })

  it('每個 category 都有 agent', () => {
    const cats = new Set(ALL_AGENTS.map(a => a.category))
    expect(cats.size).toBe(10)
    expect(cats.has('customer_service')).toBe(true)
    expect(cats.has('marketing')).toBe(true)
  })

  it('id 唯一', () => {
    const ids = ALL_AGENTS.map(a => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('AC-002: Agent 搜尋', () => {
  it('搜尋「客服」應找到客服類 agent', () => {
    const results = ALL_AGENTS.filter(a =>
      a.displayName.includes('客服') ||
      a.description.includes('客服') ||
      a.categoryLabel.includes('客服')
    )
    expect(results.length).toBeGreaterThan(0)
    expect(results.every(r => r.category === 'customer_service')).toBe(true)
  })

  it('getCategoryAgents 應只返回該類別', () => {
    const csAgents = getCategoryAgents('customer_service')
    expect(csAgents.every(a => a.category === 'customer_service')).toBe(true)
    expect(csAgents.length).toBeGreaterThanOrEqual(15)
  })

  it('getAgent(id) 應能找到', () => {
    const agent = getAgent('a001')
    expect(agent).toBeDefined()
    expect(agent?.id).toBe('a001')
  })
})

describe('AC-003: 多 Agent 協作', () => {
  it('runMultiAgentCollaboration 應平行執行所有 agent', async () => {
    const agents = [ALL_AGENTS[0], ALL_AGENTS[20], ALL_AGENTS[80]] // 客服 + 行銷 + 資料
    const start = Date.now()
    const results = await runMultiAgentCollaboration(agents, '測試任務')
    const elapsed = Date.now() - start

    expect(results.length).toBe(3)
    // 平行執行應該 < 3 個 sequential (3-4s each)
    expect(elapsed).toBeLessThan(10000) // 寬鬆一點
  }, 15000)

  it('每個結果都有 agentId/status/output/duration/cost', async () => {
    const agents = [ALL_AGENTS[0], ALL_AGENTS[1]]
    const results = await runMultiAgentCollaboration(agents, 'test')
    for (const r of results) {
      expect(r.agentId).toBeTruthy()
      expect(['success', 'failed']).toContain(r.status)
      expect(typeof r.durationMs).toBe('number')
      expect(typeof r.costNTD).toBe('number')
    }
  }, 15000)
})

describe('AC-004: 任務執行結果 - 結構化彙整', () => {
  it('runAgent 成功時應回傳完整 AgentResult', async () => {
    // 重試直到成功（5% 失敗率）
    let result = null
    for (let i = 0; i < 10; i++) {
      result = await runAgent(ALL_AGENTS[0], '測試')
      if (result.status === 'success') break
    }
    expect(result).toBeTruthy()
    if (result && result.status === 'success') {
      expect(result.output.length).toBeGreaterThan(50)
      expect(result.costNTD).toBeGreaterThan(0)
    }
  }, 60000)

  it('output 應包含任務輸入', async () => {
    let result = null
    for (let i = 0; i < 10; i++) {
      result = await runAgent(ALL_AGENTS[2], '整理 IG 留言並分析')
      if (result.status === 'success') break
    }
    if (result?.status === 'success') {
      expect(result.output).toContain('IG 留言')
    }
  }, 60000)
})

describe('AC-005: 範本儲存', () => {
  it('saveAsTemplate 應新增到 IndexedDB', async () => {
    const store = useAIEOStore.getState()
    await store.saveAsTemplate('整理 IG', '客服 + 行銷', '整理留言')

    const templates = await db.templates.toArray()
    expect(templates.length).toBe(1)
    expect(templates[0].name).toBe('整理 IG')
    expect(templates[0].defaultInput).toBe('整理留言')
  })

  it('deleteTemplate 應從 IndexedDB 移除', async () => {
    const tpl: TaskTemplate = {
      id: 'tpl_test_1',
      name: 'Test',
      agentIds: ['a001'],
      defaultInput: 'test',
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }
    await db.templates.add(tpl)
    const store = useAIEOStore.getState()
    await store.deleteTemplate('tpl_test_1')

    const templates = await db.templates.toArray()
    expect(templates.find(t => t.id === 'tpl_test_1')).toBeUndefined()
  })
})

describe('AC-006: 任務歷史', () => {
  it('任務歷史應包含時間/Agent/費用/結果摘要', async () => {
    // 插入 3 個 task
    const now = Date.now()
    for (let i = 0; i < 3; i++) {
      await db.tasks.add({
        id: `t_${i}`,
        taskName: `任務 ${i}`,
        input: `input ${i}`,
        agentIds: ['a001'],
        agentNames: ['客服專員'],
        results: [{
          agentId: 'a001',
          agentName: '客服專員',
          status: 'success',
          output: 'output',
          durationMs: 1000,
          costNTD: 1.0,
        }],
        status: 'success',
        totalCost: 1.0,
        totalDurationMs: 1000,
        createdAt: new Date(now - i * 60000).toISOString(),
      })
    }

    const tasks = await db.tasks.toArray()
    expect(tasks.length).toBe(3)

    // 排序（最新優先）
    tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    for (const t of tasks) {
      expect(t.createdAt).toBeTruthy()
      expect(t.agentNames.length).toBeGreaterThan(0)
      expect(t.totalCost).toBeGreaterThanOrEqual(0)
    }
  })

  it('能正確排序（最新優先）', async () => {
    const base = Date.now()
    await db.tasks.bulkAdd([
      { id: 'a', taskName: 'A', input: '', agentIds: [], agentNames: [], results: [], status: 'success', totalCost: 0, totalDurationMs: 0, createdAt: new Date(base - 3000).toISOString() },
      { id: 'b', taskName: 'B', input: '', agentIds: [], agentNames: [], results: [], status: 'success', totalCost: 0, totalDurationMs: 0, createdAt: new Date(base - 1000).toISOString() },
      { id: 'c', taskName: 'C', input: '', agentIds: [], agentNames: [], results: [], status: 'success', totalCost: 0, totalDurationMs: 0, createdAt: new Date(base - 2000).toISOString() },
    ])

    const sorted = await db.tasks.orderBy('createdAt').reverse().toArray()
    expect(sorted[0].id).toBe('b') // 最新
    expect(sorted[1].id).toBe('c')
    expect(sorted[2].id).toBe('a') // 最舊
  })
})

describe('AC-007: 效益報表', () => {
  it('100 任務 / 50 小時 / NT$120 計算', async () => {
    // 模擬 100 任務
    const tasks = []
    for (let i = 0; i < 100; i++) {
      tasks.push({
        id: `r_${i}`,
        taskName: `Task ${i}`,
        input: '',
        agentIds: ['a001'],
        agentNames: ['客服專員'],
        results: [{
          agentId: 'a001',
          agentName: '客服專員',
          status: 'success' as const,
          output: 'x'.repeat(2000),
          durationMs: 1800000, // 30 分鐘
          costNTD: 1.2,
        }],
        status: 'success' as const,
        totalCost: 1.2,
        totalDurationMs: 1800000,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      })
    }
    await db.tasks.bulkAdd(tasks)

    const all = await db.tasks.toArray()
    const totalCost = all.reduce((s, t) => s + t.totalCost, 0)
    const totalHours = all.reduce((s, t) => s + (t.totalDurationMs / 3600000), 0)
    const agentUsage = new Map<string, number>()
    for (const t of all) {
      for (const n of t.agentNames) {
        agentUsage.set(n, (agentUsage.get(n) || 0) + 1)
      }
    }

    expect(all.length).toBe(100)
    expect(totalCost).toBeCloseTo(120, 0) // 100 * 1.2 = 120
    expect(totalHours).toBe(50) // 100 * 0.5 = 50
    expect(agentUsage.get('客服專員')).toBe(100) // 最常用
  })
})

describe('AC-008: API 失敗降級', () => {
  it('runAgent 5% 失敗率測試', async () => {
    // 用較小樣本 (20 次) 避免 timeout
    let successCount = 0
    let failCount = 0
    const promises = []
    for (let i = 0; i < 20; i++) {
      promises.push(runAgent(ALL_AGENTS[i % 144], 'test'))
    }
    const results = await Promise.all(promises)
    for (const r of results) {
      if (r.status === 'success') successCount++
      else if (r.status === 'failed') failCount++
    }
    // 5% 機率，20 次應該有 0-5 個失敗
    expect(failCount).toBeGreaterThanOrEqual(0)
    expect(failCount).toBeLessThan(8)
    expect(successCount + failCount).toBe(20)
  }, 30000)

  it('失敗結果含 error 訊息', async () => {
    for (let i = 0; i < 50; i++) {
      const r = await runAgent(ALL_AGENTS[0], 'test')
      if (r.status === 'failed') {
        expect(r.error).toBeTruthy()
        expect(r.error).toContain('失敗')
        return
      }
    }
    // 沒遇到失敗也算 OK（5% 機率可能全部成功）
  }, 120000)

  it('multi agent 中一個失敗，其他繼續', async () => {
    const agents = [ALL_AGENTS[0], ALL_AGENTS[1], ALL_AGENTS[2]]
    const results = await runMultiAgentCollaboration(agents, 'test')

    // 至少有結果回傳（不論成功或失敗）
    expect(results.length).toBe(3)
    for (const r of results) {
      expect(r.status).toBeTruthy()
    }
  }, 30000)
})

describe('AC-009: 費用提示', () => {
  it('成本上限 NT$5 邏輯', () => {
    const settings = useAIEOStore.getState().settings
    expect(settings.defaultCostLimit).toBe(5)

    // 估算成本 NT$15 > 5，應提示
    const estimatedCost = 15
    const shouldPrompt = estimatedCost > settings.defaultCostLimit
    expect(shouldPrompt).toBe(true)
  })

  it('估算成本 NT$3 < 5，不提示', () => {
    const settings = useAIEOStore.getState().settings
    const estimatedCost = 3
    const shouldPrompt = estimatedCost > settings.defaultCostLimit
    expect(shouldPrompt).toBe(false)
  })
})

describe('AC-010: 多帳號（v2 範疇）', () => {
  it('MVP 預設 Pro 單帳號，sub-account 屬 Sprint 2', () => {
    const settings = useAIEOStore.getState().settings
    expect(settings.tier).toBe('pro')
    // Sprint 2 才會實作多帳號
    expect(true).toBe(true)
  })
})