/**
 * agents-catalog 重構測試 — TDD RED 階段
 * 對應 Matt Pocock Deep Modules 原則：catalog 對外只暴露意圖，不暴露 144 物件陣列
 */
import { describe, it, expect } from 'vitest'
import {
  findAgentById,
  listAgentsByCategory,
  searchAgents,
  countAgentsByCategory,
  totalAgentCount,
  listAllAgents,
} from '@/lib/agents-catalog'
import type { AgentCategory } from '@/lib/types'

describe('agents-catalog: deep module API', () => {
  describe('totalAgentCount()', () => {
    it('應回傳 144', () => {
      expect(totalAgentCount()).toBe(144)
    })
  })

  describe('listAllAgents()', () => {
    it('應回傳 144 個完整 AIAgent（含 categoryLabel）', () => {
      const all = listAllAgents()
      expect(all.length).toBe(144)
      for (const a of all) {
        expect(a.id).toBeTruthy()
        expect(a.categoryLabel).toBeTruthy() // 自動注入
      }
    })

    it('id 應唯一', () => {
      const all = listAllAgents()
      const ids = all.map(a => a.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('categoryLabel 應與 category 對應', () => {
      const all = listAllAgents()
      const map: Record<AgentCategory, string> = {
        customer_service: '客服類',
        marketing: '行銷類',
        design: '設計類',
        secretary: '秘書類',
        data: '資料類',
        sales: '業務類',
        hr: '人資類',
        legal: '法務類',
        finance: '財務類',
        specialist: '專業類',
      }
      for (const a of all) {
        expect(a.categoryLabel).toBe(map[a.category])
      }
    })
  })

  describe('findAgentById(id)', () => {
    it('a001 應存在', () => {
      const agent = findAgentById('a001')
      expect(agent?.id).toBe('a001')
      expect(agent?.categoryLabel).toBe('客服類')
    })

    it('不存在的 id 應回傳 undefined', () => {
      expect(findAgentById('zzz999')).toBeUndefined()
    })

    it('空字串應回傳 undefined', () => {
      expect(findAgentById('')).toBeUndefined()
    })
  })

  describe('listAgentsByCategory(cat)', () => {
    it('客服類應有 15 個', () => {
      const cs = listAgentsByCategory('customer_service')
      expect(cs.length).toBe(15)
      expect(cs.every(a => a.category === 'customer_service')).toBe(true)
      expect(cs.every(a => a.categoryLabel === '客服類')).toBe(true)
    })

    it('行銷類應有 20 個', () => {
      expect(listAgentsByCategory('marketing').length).toBe(20)
    })

    it('10 個類別加總應為 144', () => {
      const cats: AgentCategory[] = [
        'customer_service', 'marketing', 'design', 'secretary', 'data',
        'sales', 'hr', 'legal', 'finance', 'specialist',
      ]
      const sum = cats.reduce((s, c) => s + listAgentsByCategory(c).length, 0)
      expect(sum).toBe(144)
    })
  })

  describe('countAgentsByCategory(cat)', () => {
    it('客服類應為 15', () => {
      expect(countAgentsByCategory('customer_service')).toBe(15)
    })

    it('不需載入完整物件清單', () => {
      // 純計數,效能優於 listAgentsByCategory().length
      expect(countAgentsByCategory('hr')).toBe(12)
    })
  })

  describe('searchAgents(query)', () => {
    it('「客服」應只命中 customer_service 類', () => {
      const results = searchAgents('客服')
      expect(results.length).toBeGreaterThan(0)
      expect(results.every(r => r.category === 'customer_service')).toBe(true)
    })

    it('空字串應回傳空陣列（避免誤觸 144 個全撈）', () => {
      expect(searchAgents('')).toEqual([])
    })

    it('應比對 displayName/description/categoryLabel', () => {
      const results = searchAgents('行銷')
      expect(results.length).toBeGreaterThan(0)
    })
  })
})
