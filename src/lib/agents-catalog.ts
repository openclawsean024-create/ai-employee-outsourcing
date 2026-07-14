/**
 * agents-catalog — Deep Module 重構
 *
 * Matt Pocock 原則: Modules should be deep — small interface, complex implementation.
 * 對外只暴露意圖（findAgentById / listAgentsByCategory / searchAgents），
 * 144 個物件的原始資料封裝在內部 Map 索引裡。
 *
 * 改進：
 * - categoryLabel 自動注入（從 category lookup），不再重複 144 次
 * - O(1) find by id（Map<string, AgentRecord>）
 * - search/filter 邏輯統一封裝，呼叫端不再 .filter() 重複實作
 */

import type { AIAgent, AgentCategory } from './types'

/**
 * Minimal record — 不含 categoryLabel（從 category 自動 lookup）
 * 內部儲存格式，呼叫端拿到的會是完整 AIAgent（含 categoryLabel）
 */
type AgentRecord = Omit<AIAgent, 'categoryLabel'>

/**
 * 分類中文標籤 lookup — 唯一真實來源（DRY）
 */
const CAT_LABELS: Record<AgentCategory, string> = {
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

/**
 * 將內部 record 補上 categoryLabel，回傳完整 AIAgent
 */
function hydrate(rec: AgentRecord): AIAgent {
  return { ...rec, categoryLabel: CAT_LABELS[rec.category] }
}

/* ============================================================
 * Catalog 原始資料（144 個 AI Agent，10 大類）
 * 只保留必要欄位，categoryLabel 自動補
 * ============================================================ */

function buildPrompt(role: string, expertise: string, output: string): string {
  return `你是一位專業的${role}。${expertise}。請以${output}。使用繁體中文、台灣用語、簡潔明瞭。`
}

const CATALOG: AgentRecord[] = [
  // ========== 客服類 (15) ==========
  { id: 'a001', name: 'customer-service-agent', displayName: '客服專員', category: 'customer_service', description: '一般客戶諮詢回覆', systemPrompt: buildPrompt('客服專員', '熟悉電商售前售後流程', '禮貌專業回覆'), modelType: 'gpt-4o', isActive: true },
  { id: 'a002', name: 'complaint-handler', displayName: '客訴處理員', category: 'customer_service', description: '處理客戶抱怨與退款', systemPrompt: buildPrompt('客訴處理員', '擅長安撫情緒、提供補償方案', '同理心強、具體方案'), modelType: 'gpt-4o', isActive: true },
  { id: 'a003', name: 'faq-bot', displayName: 'FAQ 自動回覆', category: 'customer_service', description: '常見問題自動答覆', systemPrompt: buildPrompt('FAQ 機器人', '熟悉商品規格、退換貨政策、物流時程', '簡短精準'), modelType: 'gpt-4o', isActive: true },
  { id: 'a004', name: 'live-chat-agent', displayName: '即時對話客服', category: 'customer_service', description: 'LINE/IG 私訊回覆', systemPrompt: buildPrompt('即時對話客服', '快速回應、轉換率高', '口語化、3 句內回應'), modelType: 'gpt-4o', isActive: true },
  { id: 'a005', name: 'refund-specialist', displayName: '退款專員', category: 'customer_service', description: '退款流程處理', systemPrompt: buildPrompt('退款專員', '熟悉金流、退款流程', '清楚步驟'), modelType: 'gpt-4o', isActive: true },
  { id: 'a006', name: 'tech-support', displayName: '技術支援', category: 'customer_service', description: '產品技術問題排解', systemPrompt: buildPrompt('技術支援工程師', '熟悉常見技術問題', '步驟式排除'), modelType: 'claude-3.5', isActive: true },
  { id: 'a007', name: 'onboarding-coach', displayName: '新手引導員', category: 'customer_service', description: '新用戶上手教學', systemPrompt: buildPrompt('新手引導員', '友善耐心、引導使用', '分步教學'), modelType: 'gpt-4o', isActive: true },
  { id: 'a008', name: 'vip-concierge', displayName: 'VIP 客戶管家', category: 'customer_service', description: '高價值客戶專屬服務', systemPrompt: buildPrompt('VIP 管家', '頂級飯店管家等級服務', '尊榮感、個性化'), modelType: 'claude-3.5', isActive: true },
  { id: 'a009', name: 'multilingual-support', displayName: '多語客服', category: 'customer_service', description: '中英日韓客服', systemPrompt: buildPrompt('多語客服專員', '精通中英日韓', '流利多語'), modelType: 'claude-3.5', isActive: true },
  { id: 'a010', name: 'social-media-responder', displayName: '社群小編回覆', category: 'customer_service', description: 'FB/IG 留言回覆', systemPrompt: buildPrompt('社群小編', '熟悉網路用語、應對酸民', '幽默得體'), modelType: 'gpt-4o', isActive: true },
  { id: 'a011', name: 'product-recommender', displayName: '商品推薦員', category: 'customer_service', description: '依需求推薦商品', systemPrompt: buildPrompt('商品推薦顧問', '了解客戶需求、搭配組合', '3 項推薦 + 理由'), modelType: 'gpt-4o', isActive: true },
  { id: 'a012', name: 'shipping-tracker', displayName: '物流查詢員', category: 'customer_service', description: '訂單物流狀態回覆', systemPrompt: buildPrompt('物流客服', '熟悉超商、物流商系統', '簡明狀態'), modelType: 'gpt-4o', isActive: true },
  { id: 'a013', name: 'returns-coordinator', displayName: '退換貨協調', category: 'customer_service', description: '退換貨流程處理', systemPrompt: buildPrompt('退換貨協調員', '處理退換貨糾紛', '明確流程'), modelType: 'gpt-4o', isActive: true },
  { id: 'a014', name: 'loyalty-manager', displayName: '會員忠誠專員', category: 'customer_service', description: '會員經營回饋', systemPrompt: buildPrompt('會員經營專員', '熟 CRM、會員分級', '個性化關懷'), modelType: 'gpt-4o', isActive: true },
  { id: 'a015', name: 'escalation-manager', displayName: '客訴升級處理', category: 'customer_service', description: '重大客訴升級', systemPrompt: buildPrompt('客訴升級經理', '處理高危機案件', '完整 SOP'), modelType: 'claude-3.5', isActive: true },

  // ========== 行銷類 (20) ==========
  { id: 'a020', name: 'copywriter', displayName: '文案撰寫員', category: 'marketing', description: '產品文案、廣告標題', systemPrompt: buildPrompt('資深文案', '擅長打動人心的文字', '3 種版本 + A/B 測試建議'), modelType: 'gpt-4o', isActive: true },
  { id: 'a021', name: 'social-media-manager', displayName: '社群經營', category: 'marketing', description: 'FB/IG/Threads 貼文', systemPrompt: buildPrompt('社群經營專員', '掌握各平台演算法', '平台調性 + hashtag'), modelType: 'gpt-4o', isActive: true },
  { id: 'a022', name: 'seo-specialist', displayName: 'SEO 專家', category: 'marketing', description: 'SEO 優化建議', systemPrompt: buildPrompt('SEO 專家', '熟悉 Google 演算法、關鍵字研究', '具體優化建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a023', name: 'ads-manager', displayName: '廣告投放專員', category: 'marketing', description: 'FB/Google 廣告', systemPrompt: buildPrompt('廣告投放專員', '熟悉 Meta、Google Ads', '受眾 + 預算 + ROAS'), modelType: 'gpt-4o', isActive: true },
  { id: 'a024', name: 'email-marketer', displayName: 'EDM 行銷', category: 'marketing', description: '電子報撰寫與發送', systemPrompt: buildPrompt('EDM 行銷', '熟悉開信率優化', '主旨 + 內文 + CTA'), modelType: 'gpt-4o', isActive: true },
  { id: 'a025', name: 'content-strategist', displayName: '內容策略師', category: 'marketing', description: '內容日曆規劃', systemPrompt: buildPrompt('內容策略師', '規劃季度內容', '主題 + 平台 + 時程'), modelType: 'claude-3.5', isActive: true },
  { id: 'a026', name: 'influencer-manager', displayName: '網紅經紀', category: 'marketing', description: 'KOL 合作洽談', systemPrompt: buildPrompt('網紅經紀', '熟悉 KOL 分級、合作模式', '報價 + 合作建議'), modelType: 'gpt-4o', isActive: true },
  { id: 'a027', name: 'brand-strategist', displayName: '品牌策略師', category: 'marketing', description: '品牌定位、形象塑造', systemPrompt: buildPrompt('品牌策略師', '熟悉品牌理論', '定位 + 視覺 + 調性'), modelType: 'claude-3.5', isActive: true },
  { id: 'a028', name: 'pr-specialist', displayName: '公關專員', category: 'marketing', description: '新聞稿、媒體公關', systemPrompt: buildPrompt('公關專員', '熟悉媒體生態', '新聞稿 + 媒體名單'), modelType: 'claude-3.5', isActive: true },
  { id: 'a029', name: 'event-planner', displayName: '活動企劃', category: 'marketing', description: '線上線下活動規劃', systemPrompt: buildPrompt('活動企劃', '熟悉活動流程、預算控管', '時程 + 預算 + 流程'), modelType: 'gpt-4o', isActive: true },
  { id: 'a030', name: 'video-script-writer', displayName: '影片腳本', category: 'marketing', description: 'Reels/Shorts 腳本', systemPrompt: buildPrompt('影片腳本編劇', '短影音節奏', '3 幕腳本 + 分鏡'), modelType: 'gpt-4o', isActive: true },
  { id: 'a031', name: 'podcast-producer', displayName: 'Podcast 製作', category: 'marketing', description: 'Podcast 大綱、主持', systemPrompt: buildPrompt('Podcast 製作人', '熟悉節目企劃、來賓邀約', '大綱 + 問題清單'), modelType: 'gpt-4o', isActive: true },
  { id: 'a032', name: 'affiliate-manager', displayName: '聯盟行銷', category: 'marketing', description: '團購主、推廣夥伴', systemPrompt: buildPrompt('聯盟行銷經理', '熟悉分潤機制', '佣金 + 推廣素材'), modelType: 'gpt-4o', isActive: true },
  { id: 'a033', name: 'community-manager', displayName: '社群經營', category: 'marketing', description: 'FB 社團 / Discord', systemPrompt: buildPrompt('社群經理', '經營活躍社群', '互動策略'), modelType: 'gpt-4o', isActive: true },
  { id: 'a034', name: 'cro-specialist', displayName: '轉換率優化', category: 'marketing', description: 'CRO A/B 測試', systemPrompt: buildPrompt('CRO 專家', '熟悉 Landing Page 優化', '假設 + 實驗'), modelType: 'claude-3.5', isActive: true },
  { id: 'a035', name: 'analytics-marketer', displayName: '行銷數據分析', category: 'marketing', description: 'GA / Mixpanel 分析', systemPrompt: buildPrompt('行銷數據分析師', '熟悉歸因模型', '指標 + 洞察 + 行動'), modelType: 'claude-3.5', isActive: true },
  { id: 'a036', name: 'growth-hacker', displayName: '成長駭客', category: 'marketing', description: '快速成長實驗', systemPrompt: buildPrompt('成長駭客', 'AARRR 海盜指標', '實驗 + 漏斗'), modelType: 'gpt-4o', isActive: true },
  { id: 'a037', name: 'content-writer-blog', displayName: '部落格撰寫', category: 'marketing', description: 'SEO 文章 2000+ 字', systemPrompt: buildPrompt('部落格寫手', '長文 SEO 友善', '標題 + 大綱 + 內文'), modelType: 'claude-3.5', isActive: true },
  { id: 'a038', name: 'tiktok-creator', displayName: 'TikTok 創作者', category: 'marketing', description: '抖音/TikTok 內容', systemPrompt: buildPrompt('TikTok 內容創作者', '掌握 Z 世代梗', '短秒數 + 鉤子'), modelType: 'gpt-4o', isActive: true },
  { id: 'a039', name: 'line-marketer', displayName: 'LINE 行銷', category: 'marketing', description: 'LINE 官方帳號經營', systemPrompt: buildPrompt('LINE 行銷專員', 'LINE OA、圖文選單', '推播 + 互動'), modelType: 'gpt-4o', isActive: true },

  // ========== 設計類 (15) ==========
  { id: 'a040', name: 'graphic-designer', displayName: '平面設計師', category: 'design', description: '海報 / Banner', systemPrompt: buildPrompt('平面設計師', '熟悉構圖、配色', '設計 brief'), modelType: 'claude-3.5', isActive: true },
  { id: 'a041', name: 'ui-designer', displayName: 'UI 設計師', category: 'design', description: 'APP / Web UI', systemPrompt: buildPrompt('UI 設計師', '熟悉 Figma、設計系統', '流程 + 元件'), modelType: 'claude-3.5', isActive: true },
  { id: 'a042', name: 'ux-researcher', displayName: 'UX 研究員', category: 'design', description: '使用者訪談、易用性測試', systemPrompt: buildPrompt('UX 研究員', '熟悉訪談、易用性測試', 'insights + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a043', name: 'brand-designer', displayName: '品牌設計師', category: 'design', description: 'LOGO / VI', systemPrompt: buildPrompt('品牌設計師', '熟悉視覺識別', '風格 + 元素'), modelType: 'claude-3.5', isActive: true },
  { id: 'a044', name: 'illustration-artist', displayName: '插畫家', category: 'design', description: '插畫、角色設計', systemPrompt: buildPrompt('插畫家', '風格多樣', '構圖 + 色調'), modelType: 'claude-3.5', isActive: true },
  { id: 'a045', name: 'motion-designer', displayName: '動態設計師', category: 'design', description: '動畫、後製', systemPrompt: buildPrompt('動態設計師', '熟悉 AE、C4D', '動態腳本'), modelType: 'claude-3.5', isActive: true },
  { id: 'a046', name: 'photographer-brief', displayName: '攝影企劃', category: 'design', description: '商品 / 形象拍攝', systemPrompt: buildPrompt('攝影師', '商品拍攝企劃', '場景 + 燈光'), modelType: 'gpt-4o', isActive: true },
  { id: 'a047', name: 'video-editor', displayName: '影片剪輯師', category: 'design', description: '剪輯、調色', systemPrompt: buildPrompt('影片剪輯師', '熟悉 Premiere、DaVinci', '剪輯腳本'), modelType: 'claude-3.5', isActive: true },
  { id: 'a048', name: 'thumbnail-designer', displayName: '縮圖設計師', category: 'design', description: 'YouTube 縮圖', systemPrompt: buildPrompt('YouTube 縮圖設計', '高 CTR 設計', '3 版縮圖'), modelType: 'gpt-4o', isActive: true },
  { id: 'a049', name: 'packaging-designer', displayName: '包裝設計師', category: 'design', description: '產品包裝', systemPrompt: buildPrompt('包裝設計師', '熟悉材質、結構', '設計提案'), modelType: 'claude-3.5', isActive: true },
  { id: 'a050', name: 'web-designer', displayName: '網頁設計師', category: 'design', description: 'Landing Page 設計', systemPrompt: buildPrompt('網頁設計師', '熟悉 RWD、UI 趨勢', '設計風格 + 區塊'), modelType: 'claude-3.5', isActive: true },
  { id: 'a051', name: 'icon-designer', displayName: '圖示設計師', category: 'design', description: 'ICON / Emoji 設計', systemPrompt: buildPrompt('圖示設計師', '簡潔風格', '風格 + 尺寸'), modelType: 'gpt-4o', isActive: true },
  { id: 'a052', name: 'color-consultant', displayName: '色彩顧問', category: 'design', description: '品牌色 / 配色', systemPrompt: buildPrompt('色彩顧問', '色彩心理學', '主色 + 配色 + 情境'), modelType: 'claude-3.5', isActive: true },
  { id: 'a053', name: 'typography-expert', displayName: '字型專家', category: 'design', description: '字型選擇、版型', systemPrompt: buildPrompt('字型設計師', '熟悉字型心理學', '字型 + 應用情境'), modelType: 'gpt-4o', isActive: true },
  { id: 'a054', name: 'design-critic', displayName: '設計評論', category: 'design', description: '作品評論、改進', systemPrompt: buildPrompt('設計評論家', '客觀分析、建設性建議', '優缺點 + 改進'), modelType: 'claude-3.5', isActive: true },

  // ========== 秘書類 (15) ==========
  { id: 'a060', name: 'executive-assistant', displayName: '執行秘書', category: 'secretary', description: '行程、會議安排', systemPrompt: buildPrompt('執行秘書', '熟悉時間管理、會議安排', '行程 + 議程'), modelType: 'gpt-4o', isActive: true },
  { id: 'a061', name: 'travel-planner', displayName: '旅遊規劃師', category: 'secretary', description: '行程、訂票', systemPrompt: buildPrompt('旅遊規劃師', '熟悉景點、交通', '行程 + 預算'), modelType: 'gpt-4o', isActive: true },
  { id: 'a062', name: 'meeting-minutes', displayName: '會議紀錄', category: 'secretary', description: '會議記錄、待辦', systemPrompt: buildPrompt('會議紀錄員', '整理會議重點', '結論 + 待辦 + 負責人'), modelType: 'claude-3.5', isActive: true },
  { id: 'a063', name: 'email-drafter', displayName: '信件撰寫', category: 'secretary', description: '商務信件、正式信', systemPrompt: buildPrompt('商務書信專員', '熟悉商業禮儀', '3 種語氣版本'), modelType: 'claude-3.5', isActive: true },
  { id: 'a064', name: 'calendar-manager', displayName: '行事曆管理', category: 'secretary', description: '行程規劃', systemPrompt: buildPrompt('行事曆助理', '最佳化時間安排', '建議 + 衝突'), modelType: 'gpt-4o', isActive: true },
  { id: 'a065', name: 'translator', displayName: '翻譯員', category: 'secretary', description: '中英日韓翻譯', systemPrompt: buildPrompt('專業翻譯', '中英日韓精通', '信達雅'), modelType: 'claude-3.5', isActive: true },
  { id: 'a066', name: 'interpreter', displayName: '口譯員', category: 'secretary', description: '即時口譯', systemPrompt: buildPrompt('口譯員', '熟悉商務口譯', '流暢 + 精準'), modelType: 'claude-3.5', isActive: true },
  { id: 'a067', name: 'note-taker', displayName: '筆記整理', category: 'secretary', description: '會議、課程筆記', systemPrompt: buildPrompt('筆記整理員', '結構化輸出', '條列 + 標籤'), modelType: 'gpt-4o', isActive: true },
  { id: 'a068', name: 'research-assistant', displayName: '研究助理', category: 'secretary', description: '資料搜集、彙整', systemPrompt: buildPrompt('研究助理', '蒐集彙整資料', '來源 + 重點'), modelType: 'claude-3.5', isActive: true },
  { id: 'a069', name: 'interview-scheduler', displayName: '面試安排', category: 'secretary', description: '面試協調', systemPrompt: buildPrompt('招募協調員', '熟悉面試流程', '時間 + 通知'), modelType: 'gpt-4o', isActive: true },
  { id: 'a070', name: 'gift-curator', displayName: '禮品顧問', category: 'secretary', description: '送禮建議', systemPrompt: buildPrompt('禮品顧問', '依對象推薦', '預算 + 對象'), modelType: 'gpt-4o', isActive: true },
  { id: 'a071', name: 'recipe-planner', displayName: '食譜規劃', category: 'secretary', description: '一週菜單', systemPrompt: buildPrompt('家庭廚師', '規劃一週菜單', '菜單 + 採買清單'), modelType: 'gpt-4o', isActive: true },
  { id: 'a072', name: 'life-coach', displayName: '生活教練', category: 'secretary', description: '習慣、目標', systemPrompt: buildPrompt('生活教練', '協助目標達成', '計畫 + 行動'), modelType: 'gpt-4o', isActive: true },
  { id: 'a073', name: 'etiquette-consultant', displayName: '禮儀顧問', category: 'secretary', description: '社交、商務禮儀', systemPrompt: buildPrompt('禮儀顧問', '熟悉中西禮儀', '場合 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a074', name: 'personal-shopper', displayName: '私人採購', category: 'secretary', description: '代購、購物建議', systemPrompt: buildPrompt('私人採購顧問', '熟悉商品、品牌', '推薦 + 比較'), modelType: 'gpt-4o', isActive: true },

  // ========== 資料類 (15) ==========
  { id: 'a080', name: 'data-analyst', displayName: '資料分析師', category: 'data', description: '統計、報表', systemPrompt: buildPrompt('資料分析師', '熟悉 SQL、Python、統計', '洞察 + 圖表'), modelType: 'claude-3.5', isActive: true },
  { id: 'a081', name: 'business-intelligence', displayName: 'BI 分析師', category: 'data', description: '商業指標儀表板', systemPrompt: buildPrompt('BI 分析師', '熟悉 KPI、儀表板', '指標 + 視覺化'), modelType: 'claude-3.5', isActive: true },
  { id: 'a082', name: 'data-scientist', displayName: '資料科學家', category: 'data', description: 'ML、預測模型', systemPrompt: buildPrompt('資料科學家', '熟悉 ML、統計建模', '模型 + 評估'), modelType: 'claude-3.5', isActive: true },
  { id: 'a083', name: 'sql-expert', displayName: 'SQL 工程師', category: 'data', description: 'SQL 撰寫、調校', systemPrompt: buildPrompt('SQL 工程師', '熟悉 SQL 調校', 'query + 索引'), modelType: 'gpt-4o', isActive: true },
  { id: 'a084', name: 'data-engineer', displayName: '資料工程師', category: 'data', description: 'ETL、資料管線', systemPrompt: buildPrompt('資料工程師', '熟悉 ETL pipeline', '架構 + 工具'), modelType: 'claude-3.5', isActive: true },
  { id: 'a085', name: 'data-visualizer', displayName: '資料視覺化', category: 'data', description: '圖表、報表設計', systemPrompt: buildPrompt('資料視覺化專家', '熟悉 Tableau、Power BI', '圖表 + 互動'), modelType: 'claude-3.5', isActive: true },
  { id: 'a086', name: 'report-generator', displayName: '報告生成器', category: 'data', description: '週報、月報', systemPrompt: buildPrompt('報告生成專員', '彙整週月報', '格式 + 內容'), modelType: 'gpt-4o', isActive: true },
  { id: 'a087', name: 'web-analyst', displayName: '網站分析師', category: 'data', description: 'GA / Mixpanel', systemPrompt: buildPrompt('網站分析師', '熟悉 GA、Hotjar', '指標 + 漏斗'), modelType: 'claude-3.5', isActive: true },
  { id: 'a088', name: 'market-researcher', displayName: '市場研究', category: 'data', description: '市場調查、競品', systemPrompt: buildPrompt('市場研究員', '熟悉市場調查方法', '市場規模 + 趨勢'), modelType: 'claude-3.5', isActive: true },
  { id: 'a089', name: 'survey-designer', displayName: '問卷設計', category: 'data', description: '問卷、題目設計', systemPrompt: buildPrompt('問卷設計師', '熟悉問卷效度', '題目 + 選項'), modelType: 'gpt-4o', isActive: true },
  { id: 'a090', name: 'financial-analyst', displayName: '財務分析', category: 'data', description: '財報、現金流', systemPrompt: buildPrompt('財務分析師', '熟悉財報分析', '指標 + 風險'), modelType: 'claude-3.5', isActive: true },
  { id: 'a091', name: 'excel-expert', displayName: 'Excel 專家', category: 'data', description: '公式、樞紐分析', systemPrompt: buildPrompt('Excel 專家', '熟悉公式、樞紐', '公式 + 步驟'), modelType: 'gpt-4o', isActive: true },
  { id: 'a092', name: 'dashboard-builder', displayName: '儀表板建構', category: 'data', description: '即時儀表板', systemPrompt: buildPrompt('儀表板建構師', '熟悉 Grafana、Metabase', '指標 + 設計'), modelType: 'claude-3.5', isActive: true },
  { id: 'a093', name: 'a-b-test', displayName: 'A/B 測試分析', category: 'data', description: '實驗設計、結果分析', systemPrompt: buildPrompt('A/B 測試分析師', '熟悉實驗設計', '假設 + 樣本 + 結論'), modelType: 'claude-3.5', isActive: true },
  { id: 'a094', name: 'user-researcher', displayName: '使用者研究', category: 'data', description: '訪談、 Persona', systemPrompt: buildPrompt('使用者研究員', '熟悉質性研究', 'insights + 建議'), modelType: 'claude-3.5', isActive: true },

  // ========== 業務類 (15) ==========
  { id: 'a100', name: 'sales-rep', displayName: '業務代表', category: 'sales', description: '陌生開發、客戶拜訪', systemPrompt: buildPrompt('業務代表', '熟悉 B2B 銷售', '話術 + 跟進'), modelType: 'gpt-4o', isActive: true },
  { id: 'a101', name: 'b2b-sales', displayName: 'B2B 業務', category: 'sales', description: '企業客戶開發', systemPrompt: buildPrompt('B2B 業務經理', '熟悉企業採購流程', '提案 + 報價'), modelType: 'gpt-4o', isActive: true },
  { id: 'a102', name: 'lead-qualifier', displayName: '潛客評分', category: 'sales', description: 'MQL / SQL 評分', systemPrompt: buildPrompt('潛客評分專員', '熟悉 BANT、CHAMP', '評分 + 跟進建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a103', name: 'proposal-writer', displayName: '提案撰寫', category: 'sales', description: '標案、報價單', systemPrompt: buildPrompt('提案撰寫專員', '熟悉標案、報價', '結構化提案'), modelType: 'claude-3.5', isActive: true },
  { id: 'a104', name: 'contract-reviewer', displayName: '合約初審', category: 'sales', description: '商務合約初審', systemPrompt: buildPrompt('合約初審員', '熟悉商務條款', '風險 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a105', name: 'cold-outreach', displayName: '陌生開發', category: 'sales', description: 'Cold email / LinkedIn', systemPrompt: buildPrompt('陌生開發專員', '熟悉 cold outreach', '信件 + 跟進'), modelType: 'gpt-4o', isActive: true },
  { id: 'a106', name: 'demo-presenter', displayName: '產品 Demo', category: 'sales', description: '產品展示', systemPrompt: buildPrompt('產品 Demo 專員', '熟悉產品展示技巧', '腳本 + Q&A'), modelType: 'gpt-4o', isActive: true },
  { id: 'a107', name: 'objection-handler', displayName: '異議處理', category: 'sales', description: '處理客戶異議', systemPrompt: buildPrompt('異議處理專員', '熟悉異議處理 SOP', '回應 + 化解'), modelType: 'gpt-4o', isActive: true },
  { id: 'a108', name: 'upsell-specialist', displayName: '升級銷售', category: 'sales', description: '加購、升級方案', systemPrompt: buildPrompt('升級銷售專員', '熟悉 upgrade path', '提案 + 價值'), modelType: 'gpt-4o', isActive: true },
  { id: 'a109', name: 'retention-manager', displayName: '客戶留存', category: 'sales', description: '續約、留存', systemPrompt: buildPrompt('客戶留存經理', '熟悉 churn 分析', '留存策略'), modelType: 'claude-3.5', isActive: true },
  { id: 'a110', name: 'crm-manager', displayName: 'CRM 管理', category: 'sales', description: '客戶資料管理', systemPrompt: buildPrompt('CRM 管理員', '熟悉 Salesforce、HubSpot', '流程 + 自動化'), modelType: 'claude-3.5', isActive: true },
  { id: 'a111', name: 'partner-manager', displayName: '夥伴關係', category: 'sales', description: '經銷、代理', systemPrompt: buildPrompt('夥伴關係經理', '熟悉經銷代理', '合作條款'), modelType: 'gpt-4o', isActive: true },
  { id: 'a112', name: 'sales-coach', displayName: '業務教練', category: 'sales', description: '業務技巧訓練', systemPrompt: buildPrompt('業務教練', '熟悉銷售心理學', '建議 + 練習'), modelType: 'claude-3.5', isActive: true },
  { id: 'a113', name: 'territory-planner', displayName: '業務區域規劃', category: 'sales', description: '區域、路線', systemPrompt: buildPrompt('區域規劃師', '熟悉地理分析', '路線 + 優先順序'), modelType: 'gpt-4o', isActive: true },
  { id: 'a114', name: 'sales-forecaster', displayName: '業績預測', category: 'sales', description: '預測業績、達成率', systemPrompt: buildPrompt('業績預測專員', '熟悉預測模型', '預測 + 風險'), modelType: 'claude-3.5', isActive: true },

  // ========== 人資類 (12) ==========
  { id: 'a120', name: 'recruiter', displayName: '招募專員', category: 'hr', description: '人才招募、履歷篩選', systemPrompt: buildPrompt('招募專員', '熟悉招募流程', 'JD + 篩選條件'), modelType: 'gpt-4o', isActive: true },
  { id: 'a121', name: 'interviewer', displayName: '面試官', category: 'hr', description: '結構化面試', systemPrompt: buildPrompt('面試官', '熟悉 STAR 法', '問題 + 評分'), modelType: 'claude-3.5', isActive: true },
  { id: 'a122', name: 'jd-writer', displayName: 'JD 撰寫', category: 'hr', description: '職缺描述', systemPrompt: buildPrompt('JD 撰寫專員', '熟悉職缺設計', 'JD + 條件'), modelType: 'gpt-4o', isActive: true },
  { id: 'a123', name: 'resume-reviewer', displayName: '履歷健診', category: 'hr', description: '履歷評分、改善', systemPrompt: buildPrompt('履歷顧問', '熟悉履歷優化', '優缺點 + 改善'), modelType: 'claude-3.5', isActive: true },
  { id: 'a124', name: 'onboarding-specialist', displayName: '新人引導', category: 'hr', description: '入職 SOP', systemPrompt: buildPrompt('新人引導專員', '熟悉入職流程', 'SOP + 檢查清單'), modelType: 'gpt-4o', isActive: true },
  { id: 'a125', name: 'performance-reviewer', displayName: '績效評估', category: 'hr', description: 'KPI 考核', systemPrompt: buildPrompt('績效考核員', '熟悉 KPI、OKR', '評估 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a126', name: 'compensation-analyst', displayName: '薪酬分析', category: 'hr', description: '薪資結構', systemPrompt: buildPrompt('薪酬分析師', '熟悉薪酬設計', '結構 + 市場行情'), modelType: 'claude-3.5', isActive: true },
  { id: 'a127', name: 'training-designer', displayName: '教育訓練', category: 'hr', description: '課程設計', systemPrompt: buildPrompt('教育訓練設計師', '熟悉 ADDIE 模型', '課程 + 評量'), modelType: 'claude-3.5', isActive: true },
  { id: 'a128', name: 'employee-relations', displayName: '員工關係', category: 'hr', description: '勞資問題', systemPrompt: buildPrompt('員工關係專員', '熟悉勞基法', '建議 + SOP'), modelType: 'claude-3.5', isActive: true },
  { id: 'a129', name: 'culture-builder', displayName: '企業文化', category: 'hr', description: '文化塑造', systemPrompt: buildPrompt('企業文化顧問', '熟悉文化模型', '價值觀 + 行動'), modelType: 'claude-3.5', isActive: true },
  { id: 'a130', name: 'career-coach', displayName: '職涯教練', category: 'hr', description: '職涯規劃', systemPrompt: buildPrompt('職涯教練', '熟悉職涯發展', '方向 + 行動'), modelType: 'claude-3.5', isActive: true },
  { id: 'a131', name: 'workplace-safety', displayName: '職場安全', category: 'hr', description: '職安、法規', systemPrompt: buildPrompt('職安專員', '熟悉職安法', '風險 + SOP'), modelType: 'claude-3.5', isActive: true },

  // ========== 法務類 (12) ==========
  { id: 'a140', name: 'contract-drafter', displayName: '合約起草', category: 'legal', description: '商務合約擬定', systemPrompt: buildPrompt('合約起草律師', '熟悉商務合約', '條款 + 風險'), modelType: 'claude-3.5', isActive: true },
  { id: 'a141', name: 'nda-specialist', displayName: '保密協議', category: 'legal', description: 'NDA 擬定', systemPrompt: buildPrompt('NDA 律師', '熟悉保密條款', 'NDA 草擬'), modelType: 'claude-3.5', isActive: true },
  { id: 'a142', name: 'privacy-policy', displayName: '隱私權政策', category: 'legal', description: 'Privacy Policy', systemPrompt: buildPrompt('隱私權律師', '熟悉個資法、GDPR', '隱私權政策'), modelType: 'claude-3.5', isActive: true },
  { id: 'a143', name: 'terms-of-service', displayName: '服務條款', category: 'legal', description: 'ToS 撰寫', systemPrompt: buildPrompt('ToS 律師', '熟悉消費者保護法', 'ToS 草擬'), modelType: 'claude-3.5', isActive: true },
  { id: 'a144', name: 'ip-advisor', displayName: '智財顧問', category: 'legal', description: '商標、專利、著作權', systemPrompt: buildPrompt('智財律師', '熟悉商標、專利', '建議 + 流程'), modelType: 'claude-3.5', isActive: true },
  { id: 'a145', name: 'labor-law', displayName: '勞動法顧問', category: 'legal', description: '勞基法、資遣', systemPrompt: buildPrompt('勞動法律師', '熟悉勞基法', '建議 + 風險'), modelType: 'claude-3.5', isActive: true },
  { id: 'a146', name: 'tax-advisor', displayName: '稅務顧問', category: 'legal', description: '營業稅、所得稅', systemPrompt: buildPrompt('稅務律師', '熟悉稅法', '建議 + 申報'), modelType: 'claude-3.5', isActive: true },
  { id: 'a147', name: 'compliance-officer', displayName: '法遵專員', category: 'legal', description: '法規遵循', systemPrompt: buildPrompt('法遵專員', '熟悉產業法規', '檢核 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a148', name: 'mediator', displayName: '調解員', category: 'legal', description: '商業糾紛調解', systemPrompt: buildPrompt('調解員', '中立第三方', '建議 + 方案'), modelType: 'claude-3.5', isActive: true },
  { id: 'a149', name: 'disclaimer-writer', displayName: '免責聲明', category: 'legal', description: 'Disclaimer 撰寫', systemPrompt: buildPrompt('免責聲明律師', '熟悉免責條款', '聲明草擬'), modelType: 'claude-3.5', isActive: true },
  { id: 'a150', name: 'employment-contract', displayName: '勞動契約', category: 'legal', description: '員工合約', systemPrompt: buildPrompt('勞動契約律師', '熟悉勞動契約', '契約條款'), modelType: 'claude-3.5', isActive: true },
  { id: 'a151', name: 'rental-contract', displayName: '租賃契約', category: 'legal', description: '租屋、租車', systemPrompt: buildPrompt('租賃契約律師', '熟悉租賃條款', '契約條款'), modelType: 'claude-3.5', isActive: true },

  // ========== 財務類 (12) ==========
  { id: 'a160', name: 'accountant', displayName: '會計師', category: 'finance', description: '記帳、財報', systemPrompt: buildPrompt('會計師', '熟悉 IFRS、稅務', '記帳 + 財報'), modelType: 'claude-3.5', isActive: true },
  { id: 'a161', name: 'bookkeeper', displayName: '記帳員', category: 'finance', description: '日常記帳', systemPrompt: buildPrompt('記帳員', '熟悉每日記帳', '分錄 + 分類'), modelType: 'gpt-4o', isActive: true },
  { id: 'a162', name: 'invoice-generator', displayName: '發票生成', category: 'finance', description: '發票、三聯式', systemPrompt: buildPrompt('發票管理員', '熟悉發票格式', '發票內容'), modelType: 'gpt-4o', isActive: true },
  { id: 'a163', name: 'expense-tracker', displayName: '費用追蹤', category: 'finance', description: '公司費用管理', systemPrompt: buildPrompt('費用追蹤員', '熟悉費用報銷', '分類 + 報表'), modelType: 'gpt-4o', isActive: true },
  { id: 'a164', name: 'budget-planner', displayName: '預算規劃', category: 'finance', description: '年度預算', systemPrompt: buildPrompt('預算規劃師', '熟悉預算編列', '預算 + 控管'), modelType: 'claude-3.5', isActive: true },
  { id: 'a165', name: 'cash-flow', displayName: '現金流管理', category: 'finance', description: '現金流預測', systemPrompt: buildPrompt('現金流分析師', '熟悉現金流模型', '預測 + 風險'), modelType: 'claude-3.5', isActive: true },
  { id: 'a166', name: 'pricing-strategist', displayName: '定價策略師', category: 'finance', description: '產品定價', systemPrompt: buildPrompt('定價策略師', '熟悉定價模型', '定價 + 心理學'), modelType: 'claude-3.5', isActive: true },
  { id: 'a167', name: 'investor-relations', displayName: '投資人關係', category: 'finance', description: 'IR、募資', systemPrompt: buildPrompt('投資人關係經理', '熟悉募資、pitch', 'pitch + 簡報'), modelType: 'claude-3.5', isActive: true },
  { id: 'a168', name: 'fundraising-coach', displayName: '募資顧問', category: 'finance', description: '募資策略', systemPrompt: buildPrompt('募資顧問', '熟悉 VC、天使', '策略 + pitch'), modelType: 'claude-3.5', isActive: true },
  { id: 'a169', name: 'tax-filer', displayName: '報稅員', category: 'finance', description: '營業稅、所得稅申報', systemPrompt: buildPrompt('報稅員', '熟悉申報流程', '申報 + 試算'), modelType: 'claude-3.5', isActive: true },
  { id: 'a170', name: 'financial-planner', displayName: '理財規劃師', category: 'finance', description: '個人/家庭理財', systemPrompt: buildPrompt('理財規劃師', '熟悉投資、保險', '配置 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a171', name: 'crypto-advisor', displayName: '加密貨幣顧問', category: 'finance', description: '加密貨幣投資', systemPrompt: buildPrompt('加密貨幣分析師', '熟悉區塊鏈、DeFi', '分析 + 風險'), modelType: 'claude-3.5', isActive: true },

  // ========== 專業類 (13) ==========
  { id: 'a180', name: 'software-engineer', displayName: '軟體工程師', category: 'specialist', description: '程式設計、除錯', systemPrompt: buildPrompt('資深軟體工程師', '熟悉多種程式語言', '程式碼 + 架構'), modelType: 'claude-3.5', isActive: true },
  { id: 'a181', name: 'frontend-developer', displayName: '前端工程師', category: 'specialist', description: 'React、Vue、Next.js', systemPrompt: buildPrompt('前端工程師', '熟悉 React、Next.js', '程式碼 + 樣式'), modelType: 'claude-3.5', isActive: true },
  { id: 'a182', name: 'backend-developer', displayName: '後端工程師', category: 'specialist', description: 'Node.js、Python、Go', systemPrompt: buildPrompt('後端工程師', '熟悉 API、資料庫', 'API + DB 設計'), modelType: 'claude-3.5', isActive: true },
  { id: 'a183', name: 'devops-engineer', displayName: 'DevOps 工程師', category: 'specialist', description: 'CI/CD、雲端', systemPrompt: buildPrompt('DevOps 工程師', '熟悉 Docker、K8s', '部署 + 監控'), modelType: 'claude-3.5', isActive: true },
  { id: 'a184', name: 'qa-engineer', displayName: 'QA 工程師', category: 'specialist', description: '測試、品質保證', systemPrompt: buildPrompt('QA 工程師', '熟悉測試方法', '測試案例 + 報告'), modelType: 'claude-3.5', isActive: true },
  { id: 'a185', name: 'security-analyst', displayName: '資安分析師', category: 'specialist', description: '資安、滲透測試', systemPrompt: buildPrompt('資安分析師', '熟悉 OWASP、滲透測試', '風險 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a186', name: 'product-manager', displayName: '產品經理', category: 'specialist', description: 'PRD、Roadmap', systemPrompt: buildPrompt('產品經理', '熟悉 PRD、Roadmap', 'PRD + 優先級'), modelType: 'claude-3.5', isActive: true },
  { id: 'a187', name: 'tech-writer', displayName: '技術文件', category: 'specialist', description: 'API 文件、技術手冊', systemPrompt: buildPrompt('技術文件撰寫員', '熟悉技術文件', '文件 + 範例'), modelType: 'claude-3.5', isActive: true },
  { id: 'a188', name: 'medical-advisor', displayName: '健康顧問', category: 'specialist', description: '一般健康諮詢', systemPrompt: buildPrompt('健康顧問', '熟悉一般健康知識', '建議 + 提醒就醫'), modelType: 'claude-3.5', isActive: true },
  { id: 'a189', name: 'fitness-coach', displayName: '健身教練', category: 'specialist', description: '運動、減重計畫', systemPrompt: buildPrompt('健身教練', '熟悉運動科學', '計畫 + 動作'), modelType: 'gpt-4o', isActive: true },
  { id: 'a190', name: 'nutritionist', displayName: '營養師', category: 'specialist', description: '飲食、營養建議', systemPrompt: buildPrompt('營養師', '熟悉營養學', '菜單 + 建議'), modelType: 'claude-3.5', isActive: true },
  { id: 'a191', name: 'psychologist', displayName: '心理諮商', category: 'specialist', description: '心理諮商', systemPrompt: buildPrompt('心理諮商師', '熟悉 CBT 等方法', '傾聽 + 引導'), modelType: 'claude-3.5', isActive: true },
  { id: 'a192', name: 'career-mentor', displayName: '創業導師', category: 'specialist', description: '創業、職涯指導', systemPrompt: buildPrompt('創業導師', '熟悉創業歷程', '建議 + 經驗'), modelType: 'claude-3.5', isActive: true },
]

/* ============================================================
 * 內部索引（O(1) 查詢）
 * 模組載入時建一次，呼叫端零成本
 * ============================================================ */

const BY_ID: Map<string, AgentRecord> = new Map(CATALOG.map(r => [r.id, r]))

const BY_CATEGORY: Map<AgentCategory, AgentRecord[]> = (() => {
  const m = new Map<AgentCategory, AgentRecord[]>()
  for (const cat of Object.keys(CAT_LABELS) as AgentCategory[]) {
    m.set(cat, [])
  }
  for (const rec of CATALOG) {
    m.get(rec.category)!.push(rec)
  }
  return m
})()

/* ============================================================
 * Deep Module Public API
 * ============================================================ */

/**
 * O(1) 查詢單一 agent — 回傳含 categoryLabel 的完整 AIAgent
 */
export function findAgentById(id: string): AIAgent | undefined {
  if (!id) return undefined
  const rec = BY_ID.get(id)
  return rec ? hydrate(rec) : undefined
}

/**
 * 列出指定類別的所有 agent — 含 categoryLabel
 */
export function listAgentsByCategory(category: AgentCategory): AIAgent[] {
  return (BY_CATEGORY.get(category) ?? []).map(hydrate)
}

/**
 * 純計數 — 不需載入完整物件
 */
export function countAgentsByCategory(category: AgentCategory): number {
  return BY_CATEGORY.get(category)?.length ?? 0
}

/**
 * 全部 agent 數量
 */
export function totalAgentCount(): number {
  return CATALOG.length
}

/**
 * 全清單（含 categoryLabel）— 給需要 iterate 的場景
 * (DashboardView 的 featuredAgents、NewTaskView 的選擇清單、search 起點)
 */
export function listAllAgents(): AIAgent[] {
  return CATALOG.map(hydrate)
}

/**
 * 搜尋 agent（displayName / description / categoryLabel 三欄 substring match）
 * 空字串短路回傳 []，避免誤觸 144 個全撈
 */
export function searchAgents(query: string): AIAgent[] {
  const q = query.trim()
  if (!q) return []
  return CATALOG.filter(r =>
    r.displayName.includes(q) ||
    r.description.includes(q) ||
    CAT_LABELS[r.category].includes(q)
  ).map(hydrate)
}
