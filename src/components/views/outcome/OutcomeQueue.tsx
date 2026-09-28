'use client';

import { OUTCOME_PACK_LABELS } from '@/lib/outcomes/mock';
import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifacts: OutcomeArtifact[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const STATE_DOT: Record<OutcomeArtifact['state'], string> = {
  captured: 'ow-dot--captured',
  draft: 'ow-dot--draft',
  'awaiting-approval': 'ow-dot--awaiting',
  delivered: 'ow-dot--delivered',
};

const STATE_LABEL: Record<OutcomeArtifact['state'], string> = {
  captured: '擷取中',
  draft: '草稿',
  'awaiting-approval': '待核准',
  delivered: '已交付',
};

const PACK_KIND: Record<OutcomeArtifact['packId'], string> = {
  'cs-faq': '客服 FAQ',
  'order-anomalies': '訂單異常',
  'social-weekly': '社群週報',
};

export default function OutcomeQueue({ artifacts, selectedId, onSelect }: Props) {
  const completed = artifacts.filter(a => a.state === 'delivered').length;
  const total = artifacts.length;

  return (
    <div className="ow-queue">
      <div className="ow-queue__title">
        <span>你的本週清單</span>
        <span className="ow-queue__week mono">W{String(total > 0 ? artifacts[0].weekLabel.replace(/\D+/g, '').slice(-2) : '39')}</span>
      </div>

      <div className="ow-queue__items" role="listbox" aria-label="成果清單">
        {artifacts.map((a, i) => (
          <button
            key={a.id}
            type="button"
            role="option"
            aria-selected={a.id === selectedId}
            aria-pressed={a.id === selectedId}
            aria-label={`${a.title}，${STATE_LABEL[a.state]}`}
            className={`ow-queue__item ${a.id === selectedId ? 'is-active' : ''}`}
            onClick={() => onSelect(a.id)}
          >
            <span className={`ow-dot ${STATE_DOT[a.state]}`} aria-hidden />
            <span className="ow-queue__num">0{i + 1}</span>
            <span className={`ow-tag ow-tag--state ow-tag--${a.state} ow-queue__state`}>{STATE_LABEL[a.state]}</span>
            <h3 className="ow-queue__name">{a.title}</h3>
            <p className="ow-queue__sub">{a.subtitle}</p>
            <span className="ow-queue__kind">{PACK_KIND[a.packId]}</span>
            <span className="ow-queue__arrow" aria-hidden>↗</span>
          </button>
        ))}
      </div>

      <div className="ow-queue__foot">
        <div className="ow-queue__progress">
          <b className="mono">{completed}</b>
          <span>/ <span className="mono">{String(total).padStart(2, '0')}</span> 份已交付</span>
        </div>
        <div className="ow-queue__segments" aria-hidden>
          {artifacts.map(a => (
            <i key={a.id} className={a.state === 'delivered' ? 'is-complete' : ''} title={`${a.title}：${STATE_LABEL[a.state]}`} />
          ))}
        </div>
        <p className="ow-queue__caption">
          核准一份，完成一件。<br />
          每份成果都保留你的最後決定。
        </p>
      </div>
    </div>
  );
}
