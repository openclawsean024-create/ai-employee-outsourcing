'use client';

import { useAIEOStore } from '@/lib/store';

interface Props {
  onNewTask: () => void;
}

export default function OutcomeHeader({ onNewTask }: Props) {
  const setView = useAIEOStore(s => s.setView);

  return (
    <header className="ow-header">
      <div className="ow-header__inner">
        <button
          type="button"
          className="ow-back"
          onClick={() => setView('dashboard')}
          aria-label="回到儀表板"
          title="回到儀表板"
        >
          <span aria-hidden>←</span>
          <span className="ow-back__text">儀表板</span>
        </button>
        <div className="ow-brand">
          <span className="ow-brand__mark" aria-hidden>🌲</span>
          <div className="ow-brand__text">
            <strong>每週成果編輯台</strong>
            <span className="ow-brand__sub">週作 · zhouzuo · 純前端示意</span>
          </div>
        </div>

        <div className="ow-header__right">
          <span className="ow-workspace-name">日光咖啡研究室</span>
          <span className="ow-workspace-hint">示範工作區</span>
          <button type="button" className="ow-primary" onClick={onNewTask}>
            <span aria-hidden>＋</span>
            <span>新增本週任務</span>
          </button>
        </div>
      </div>
    </header>
  );
}
