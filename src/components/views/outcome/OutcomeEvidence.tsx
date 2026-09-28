'use client';

import { useEffect, useRef } from 'react';
import type { OutcomeArtifact, OutcomeSource } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  highlightedSource: number | null;
}

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
};

const sourceId = (artifactId: string, idx: number) => `ow-source-${artifactId}-${idx}`;

export default function OutcomeEvidence({ artifact, highlightedSource }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlightedSource == null) return;
    const id = sourceId(artifact.id, highlightedSource);
    const node = document.getElementById(id);
    if (!node) return;
    // 加入 highlight class
    const all = containerRef.current?.querySelectorAll('.ow-source-item') ?? [];
    all.forEach(el => el.classList.remove('is-highlight'));
    node.classList.add('is-highlight');
    node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    (node as HTMLElement).focus?.({ preventScroll: true });
  }, [artifact.id, highlightedSource]);

  if (artifact.sources.length === 0 && artifact.evidence.length === 0) {
    return (
      <div className="ow-evidence ow-evidence--empty">
        <p>此成果沒有來源證據。</p>
      </div>
    );
  }

  const limitRatio = Math.max(0, Math.min(1, artifact.costLimitNtd > 0 ? artifact.estimatedCostNtd / artifact.costLimitNtd : 0));

  return (
    <div className="ow-evidence" ref={containerRef}>
      <div className="ow-evidence__head">
        <h3>↔ 每句話，都有來處</h3>
        <p className="ow-evidence__intro">來源與原文摘要，供你逐一核對。<br />以下檔案與內容皆為範例。</p>
      </div>

      {artifact.sources.map((src, idx) => {
        const num = idx + 1;
        return (
          <section
            id={sourceId(artifact.id, num)}
            key={num}
            className={`ow-source-item ${highlightedSource === num ? 'is-highlight' : ''}`}
            tabIndex={-1}
            aria-label={`來源 ${num}：${src.name}`}
          >
            <div className="ow-source-item__top">
              <span className="ow-source-item__num">[{num}]</span>
              <span className="ow-source-item__type">{src.type}</span>
            </div>
            <b className="ow-source-item__name">{src.name}</b>
            <p className="ow-source-item__details">{src.details}</p>
            {src.quote && (
              <blockquote className="ow-source-item__quote">{src.quote}</blockquote>
            )}
          </section>
        );
      })}

      <div className="ow-evidence__head">
        <h3>這份成果的產生紀錄</h3>
      </div>
      <dl className="ow-evidence__meta">
        <div>
          <dt>產生時間 · 台北</dt>
          <dd>{fmtDate(artifact.generatedAt)}</dd>
        </div>
        <div>
          <dt>使用模型</dt>
          <dd>{artifact.modelLabel}</dd>
        </div>
        <div>
          <dt>本次估算成本 · 範例</dt>
          <dd className="ow-evidence__cost">
            <strong>NT$ {artifact.estimatedCostNtd}</strong>
            <span>上限 NT$ {artifact.costLimitNtd}</span>
            <div className="ow-evidence__cost-bar"><span style={{ width: `${limitRatio * 100}%` }} /></div>
          </dd>
        </div>
        <div>
          <dt>草稿版本</dt>
          <dd>v{String(artifact.version).padStart(2, '0')}</dd>
        </div>
        <div>
          <dt>狀態</dt>
          <dd>
            {artifact.state === 'captured' && '擷取中'}
            {artifact.state === 'draft' && '草稿'}
            {artifact.state === 'awaiting-approval' && '待人工核准'}
            {artifact.state === 'delivered' && '已交付'}
          </dd>
        </div>
      </dl>
      <p className="ow-evidence__note">
        金額與上限僅為介面示例。<br />本原型沒有模型呼叫或實際費用。
      </p>
    </div>
  );
}
