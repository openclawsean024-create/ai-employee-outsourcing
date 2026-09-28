'use client';

import { useEffect, useRef, useState } from 'react';
import { useOutcomeStore } from '@/lib/outcomes/store';
import type { OutcomeArtifact, OutcomeSource } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  onCitationJump?: (sourceIndex: number) => void;
  registerTextarea?: (el: HTMLTextAreaElement | null) => void;
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

const sourceNameForIndex = (sources: OutcomeSource[], idx: number): string => {
  const s = sources[idx - 1];
  return s ? s.name : '';
};

export default function OutcomeDocument({ artifact, onCitationJump, registerTextarea }: Props) {
  const updateEntryText = useOutcomeStore(s => s.updateEntryText);
  const [editing, setEditing] = useState<Record<number, boolean>>({});
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setEditing({});
    setDrafts({});
  }, [artifact.id]);

  const isDelivered = artifact.state === 'delivered';
  const isExtracting = artifact.state === 'captured' && artifact.entries.length === 0;

  const fitTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 76)}px`;
  };

  const startEdit = (i: number, current: string) => {
    setEditing(s => ({ ...s, [i]: true }));
    setDrafts(s => ({ ...s, [i]: current }));
  };

  const cancelEdit = (i: number, original: string) => {
    setEditing(s => ({ ...s, [i]: false }));
    setDrafts(s => ({ ...s, [i]: original }));
  };

  const saveEdit = (i: number) => {
    const text = drafts[i] ?? '';
    updateEntryText(artifact.id, i, text);
    setEditing(s => ({ ...s, [i]: false }));
  };

  return (
    <div className="ow-doc" ref={containerRef} aria-label="草稿預覽">
      <header className="ow-doc__header">
        <div className="ow-doc__crumbs">
          <span className="ow-doc__crumb-current">{artifact.title}</span>
          <span className="ow-doc__crumb-sub">· {artifact.weekLabel}</span>
          <span className="ow-doc__crumb-sub">· {artifact.subtitle}</span>
        </div>
        <div className="ow-doc__actions">
          <span className="ow-doc__version">VERSION {String(artifact.version).padStart(2, '0')}</span>
        </div>
      </header>

      <div className="ow-doc__paper">
        <div className="ow-doc__paper-kicker">
          <span>{artifact.kicker}</span>
          <span>W39 / 2026</span>
        </div>
        <h2 className="ow-doc__paper-title">{artifact.title}</h2>
        <p className="ow-doc__paper-summary">{artifact.description}</p>
        <div className="ow-doc__paper-meta">
          <span>範圍 <b>{artifact.weekRange}</b></span>
          <span><b>{artifact.countLabel}</b></span>
          <span>{artifact.sourceCountLabel}</span>
        </div>

        {isExtracting ? (
          <div className="ow-doc__empty ow-doc__empty--rich">
            <div className="ow-doc__empty-icon" aria-hidden>📄</div>
            <h3>讓零散資料，慢慢有了輪廓。</h3>
            <p>草稿尚未產生。完成後，你可以在這裡逐則檢查內容與來源，再決定是否核准。</p>
            <ul className="ow-doc__extract-list" aria-label="擷取進度">
              <li><span>✓</span> 已選取來源（範例）</li>
              <li><span>◌</span> 檢查欄位與重複問題（示意）</li>
              <li><span>—</span> 等待產生回覆草稿</li>
            </ul>
          </div>
        ) : (
          artifact.entries.map((entry, i) => {
            const isEditing = !!editing[i];
            const current = isEditing ? drafts[i] ?? entry.text : entry.text;
            const sourceName = sourceNameForIndex(artifact.sources, entry.source);
            return (
              <section key={i} className="ow-doc__entry">
                <div className="ow-doc__entry-head">
                  <span className="ow-doc__entry-num">0{i + 1}</span>
                  <h3 className="ow-doc__entry-title">{entry.title}</h3>
                  <button
                    type="button"
                    className="ow-doc__citation"
                    data-source-index={entry.source}
                    title={sourceName ? `查看來源 ${entry.source}（${sourceName}）` : `查看來源 ${entry.source}`}
                    aria-label={`查看來源 ${entry.source}（${sourceName || '尚未提供'}）`}
                    onClick={() => onCitationJump?.(entry.source)}
                  >[{entry.source}]</button>
                  {!isDelivered && !isEditing && (
                    <button
                      type="button"
                      className="ow-doc__edit ow-secondary ow-secondary--ghost"
                      onClick={() => startEdit(i, entry.text)}
                    >✏️ 編輯</button>
                  )}
                  {!isDelivered && isEditing && (
                    <>
                      <button
                        type="button"
                        className="ow-secondary ow-secondary--ghost"
                        onClick={() => cancelEdit(i, entry.text)}
                      >取消</button>
                      <button
                        type="button"
                        className="ow-primary ow-primary--small"
                        onClick={() => saveEdit(i)}
                      >儲存</button>
                    </>
                  )}
                </div>
                {isDelivered ? (
                  <p className="ow-doc__entry-text ow-doc__entry-text--readonly">{current}</p>
                ) : isEditing ? (
                  <textarea
                    ref={el => {
                      fitTextarea(el);
                      if (registerTextarea) registerTextarea(el);
                    }}
                    className="ow-doc__entry-textarea"
                    value={current}
                    onChange={e => {
                      setDrafts(s => ({ ...s, [i]: e.target.value }));
                      fitTextarea(e.target);
                    }}
                    aria-label={`編輯第 ${i + 1} 則草稿`}
                    spellCheck={false}
                  />
                ) : (
                  <p className="ow-doc__entry-text" onDoubleClick={() => !isDelivered && startEdit(i, entry.text)}>{current}</p>
                )}
                <div className="ow-doc__entry-foot"><i aria-hidden />{entry.foot}</div>
              </section>
            );
          })
        )}

        {artifact.notice && (
          <div className={`ow-doc__notice ${artifact.state === 'delivered' ? 'ow-doc__notice--approved' : ''}`}>
            <strong>{artifact.state === 'delivered' ? '人工核准紀錄 · 範例' : '審閱提醒'}</strong>
            <span>{artifact.notice}</span>
          </div>
        )}

        <div className="ow-doc__paper-bottom">
          <span>{isExtracting ? '擷取中狀態範例' : isDelivered ? '成果已鎖定 · 如需修改，請先撤銷核准' : '直接點選文字即可編輯 · 修改僅留在本頁'}</span>
          <span className="ow-doc__page-count">01 / 01</span>
        </div>
      </div>

      <dl className="ow-doc__meta ow-doc__meta--inline">
        <div><dt>建立</dt><dd>{fmtDate(artifact.createdAt)}</dd></div>
        <div><dt>產生</dt><dd>{fmtDate(artifact.generatedAt)}</dd></div>
        <div><dt>模型</dt><dd>{artifact.modelLabel}</dd></div>
      </dl>
    </div>
  );
}
