'use client';

import { OUTCOME_PACK_LABELS } from '@/lib/outcomes/mock';
import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  artifactsCount: number;
  onSimulateDraft: () => void;
}

const STATE_LABEL: Record<OutcomeArtifact['state'], string> = {
  captured: '擷取來源中',
  draft: '草稿',
  'awaiting-approval': '待人工核准',
  delivered: '已交付',
};

export default function OutcomeMasthead({ artifact, artifactsCount, onSimulateDraft }: Props) {
  const pack = OUTCOME_PACK_LABELS[artifact.packId];

  return (
    <section className="ow-masthead" aria-labelledby="ow-masthead-title">
      <div className="ow-masthead__left">
        <div className="ow-eyebrow">
          <span className="mono">{new Date().getFullYear()} / {String(new Date().getMonth() + 1).padStart(2, '0')}</span>
          <span className="ow-eyebrow__rule" />
          <span>每週成果編輯台</span>
        </div>
        <h1 id="ow-masthead-title" className="ow-masthead__title">
          這週的事，<span className="ow-masthead__title--accent">有個交代。</span>
        </h1>
        <p className="ow-masthead__sub">
          把零散資料整理成可用成果。你確認最後一步，安心完成這一週。
        </p>
        <div className="ow-masthead__meta">
          <span className={`ow-tag ow-tag--state ow-tag--${artifact.state}`}>{STATE_LABEL[artifact.state]}</span>
          <span className="ow-tag ow-tag--pack">📋 {artifact.subtitle}</span>
          <span className="ow-tag ow-tag--demo">🧪 範例資料</span>
        </div>
      </div>

      <div className="ow-masthead__right" aria-label="本週工作期間">
        <div className="ow-week-index">
          <span className="ow-week-index__num">{artifact.weekLabel.replace(/\D+/g, '').slice(-2) || '39'}</span>
          <div className="ow-week-meta">
            <span className="ow-week-meta__label">本週工作期間</span>
            <b className="ow-week-meta__range mono">{artifact.weekRange}</b>
            <span className="ow-week-meta__sub">{pack.name}草稿</span>
          </div>
        </div>

        <div className="ow-masthead__stats">
          <dl>
            <div><dt>本週成果</dt><dd>{String(artifactsCount).padStart(2, '0')} <span>件</span></dd></div>
            <div><dt>模型</dt><dd className="ow-masthead__stat-mono">{artifact.modelLabel}</dd></div>
            <div><dt>估算成本</dt><dd>NT$ {artifact.estimatedCostNtd} <span className="ow-masthead__hint">（範例）</span></dd></div>
          </dl>
        </div>

        <div className="ow-masthead__actions">
          <button
            type="button"
            className="ow-secondary"
            onClick={onSimulateDraft}
            disabled={artifact.state === 'delivered'}
            aria-disabled={artifact.state === 'delivered' ? 'true' : 'false'}
            title={artifact.state === 'delivered' ? '已交付：不可重新產生（純前端示範）' : '把當前成果從擷取推進到草稿（純前端示意）'}
          >
            🔄 重新產生草稿（前端示意）
          </button>
          <p className="ow-masthead__caveat">
            按下只會把當前成果從「擷取」推進到「草稿」，並補上 mock 條目；不會呼叫任何模型、不會送出對外。
          </p>
        </div>
      </div>
    </section>
  );
}
