'use client';

import { Play, Star } from 'lucide-react';
import type { View } from '@/lib/types';

const MARQUEE_ITEMS = [
  '客服類 · 15 個 Agent',
  '行銷類 · 20 個 Agent',
  '設計類 · 15 個 Agent',
  '秘書類 · 15 個 Agent',
  '資料類 · 15 個 Agent',
  '業務類 · 15 個 Agent',
  '人資類 · 12 個 Agent',
  '法務類 · 12 個 Agent',
  '財務類 · 12 個 Agent',
  '專業類 · 13 個 Agent',
];

export default function DashboardHero({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section className="relative pt-12 pb-8 text-center max-w-3xl mx-auto">
      <div className="badge badge-brand mx-auto mb-6">Beta 測試中 · 144 種 Agent</div>
      <h1 className="text-display text-balance">
        hey, 我是你的
        <br />
        <span className="text-[var(--brand)]">AI 員工團隊</span>
      </h1>
      <p className="text-body-lg mt-6 max-w-2xl mx-auto text-balance">
        把客服、行銷、秘書、設計、法務的雜事，全部交給 AI。一次任務同時呼叫 3-5 個 Agent，每月 NT$99 起。
      </p>
      <div className="flex items-center justify-center gap-3 mt-8">
        <button onClick={() => onNavigate('task_new')} className="btn btn-primary btn-lg">
          <Play className="w-4 h-4" strokeWidth={2.5} />
          開始使用
        </button>
        <button onClick={() => onNavigate('agents')} className="btn btn-secondary btn-lg">
          瀏覽 144 種 Agent
        </button>
      </div>
      {/* Lindy 風 G2 rating */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-[var(--navy-800)]">
        <span className="flex">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-3.5 h-3.5 fill-[var(--highlight)] text-[var(--highlight)]" strokeWidth={0} />
          ))}
        </span>
        <span className="font-semibold">4.9</span>
        <span className="text-[var(--navy-600)]">在 Product Hunt · 已有 800+ 微型賣家使用</span>
      </div>

      {/* Lindy-style Marquee — 10 大類 Agent 跑馬燈 */}
      <div className="mt-12 overflow-hidden -mx-6 md:-mx-10 mask-fade">
        <div className="marquee-track gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[var(--navy-600)] text-[14px] font-medium whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}