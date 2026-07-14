'use client';

import { Play } from 'lucide-react';
import type { View } from '@/lib/types';

export default function DashboardHero({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section className="pt-8 pb-4 text-center max-w-4xl mx-auto">
      <div className="badge badge-brand mx-auto mb-6">Beta 測試中 · 144 種 Agent</div>
      <h1 className="text-display text-balance">
        把重複工作交給
        <br />
        <span className="text-[var(--brand)]">144 種 AI Agent</span>
      </h1>
      <p className="text-body-lg mt-6 max-w-2xl mx-auto text-balance">
        從客服到行銷、從設計到法務。一次任務同步呼叫 3-5 個 Agent，
        每月 NT$499 起，把你的人力成本砍一半。
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
    </section>
  );
}
