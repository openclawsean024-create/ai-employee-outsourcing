'use client';

import { Check, Users } from 'lucide-react';
import type { UserTier, View } from '@/lib/types';
import { TIER_LABELS, TIER_LIMITS } from '@/lib/utils';

interface Props {
  currentTier: UserTier;
  onNavigate: (view: View) => void;
}

const PLAN_ORDER: UserTier[] = ['free', 'kol', 'pro', 'enterprise'];

const PLAN_META: Record<UserTier, {
  audience: string;
  description: string;
  features: string[];
}> = {
  free: {
    audience: '先試用核心流程',
    description: '適合第一次把重複工作交給 AI 的個人使用者。',
    features: ['5 種 Agent', '每月 50 個任務', '瀏覽器本機保存'],
  },
  kol: {
    audience: '內容創作者與 KOL',
    description: '為穩定產出內容、回覆留言與整理素材而設。',
    features: ['20 種 Agent', '每月 500 個任務', '範本與用量報表'],
  },
  pro: {
    audience: '電商賣家與 SOHO',
    description: '完整開放 144 種 Agent，支援高頻日常工作。',
    features: ['144 種 Agent', '每月 2,000 個任務', '多 Agent 協作'],
  },
  enterprise: {
    audience: '小型團隊與企業',
    description: '提供更高任務額度，為未來多帳號協作預留。',
    features: ['144 種 Agent', '每月 10,000 個任務', '企業功能預覽'],
  },
};

export default function DashboardPricing({ currentTier, onNavigate }: Props) {
  return (
    <section aria-labelledby="pricing-title" className="space-y-7">
      <div className="max-w-2xl">
        <div className="eyebrow mb-3">方案與用量</div>
        <h2 id="pricing-title" className="text-h2 text-balance">從一個重複任務開始，再按需要升級</h2>
        <p className="text-body-lg mt-3 text-balance">
          所有方案都能先在 Beta 版查看完整操作流程。付費功能尚未開放，方案按鈕只會帶你到設定頁。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        {PLAN_ORDER.map((tier) => {
          const limits = TIER_LIMITS[tier];
          const meta = PLAN_META[tier];
          const isCurrent = tier === currentTier;
          const isRecommended = tier === 'pro';

          return (
            <div
              key={tier}
              data-testid={`pricing-${tier}`}
              data-current={isCurrent ? 'true' : 'false'}
              className={isRecommended ? 'card-highlight h-full' : 'h-full'}
            >
              <article className={`card h-full p-5 flex flex-col ${isCurrent ? 'ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-page)]' : ''}`}>
                <div className="flex items-start justify-between gap-3 min-h-10">
                  <div>
                    <h3 className="text-h4">{TIER_LABELS[tier]}</h3>
                    <div className="text-[12px] font-medium text-[var(--navy-500)] mt-1">{meta.audience}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {isRecommended && <span className="badge bg-[var(--highlight)] text-[var(--navy-900)]">最多人選擇</span>}
                    {isCurrent && <span className="badge badge-brand">目前方案</span>}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-h3 text-tabular">{limits.price}</div>
                  <p className="text-body-sm text-[var(--navy-600)] mt-2 min-h-16">{meta.description}</p>
                </div>

                <div className="my-5 h-px bg-[var(--border-soft)]" />

                <ul className="space-y-3 flex-1" aria-label={`${TIER_LABELS[tier]}功能`}>
                  {meta.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[14px] text-[var(--navy-700)]">
                      <Check className="w-4 h-4 mt-0.5 text-[var(--brand)] flex-shrink-0" strokeWidth={2.25} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onNavigate('settings')}
                  className={`btn w-full mt-6 ${isRecommended ? 'btn-primary' : 'btn-secondary'}`}
                  aria-label={isCurrent ? `管理${TIER_LABELS[tier]}` : `查看 ${TIER_LABELS[tier]}方案`}
                >
                  <Users className="w-4 h-4" strokeWidth={2} />
                  {isCurrent ? '管理目前方案' : `查看 ${TIER_LABELS[tier]}方案`}
                </button>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
