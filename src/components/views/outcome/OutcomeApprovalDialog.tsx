'use client';

import { useEffect, useRef, useState } from 'react';
import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  onCancel: () => void;
  onConfirm: (acknowledgedCheck: boolean, contentCheck: boolean) => void;
}

export default function OutcomeApprovalDialog({ artifact, onCancel, onConfirm }: Props) {
  const [ack, setAck] = useState(false);
  const [content, setContent] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        queueMicrotask(() => {
          previous.focus();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="ow-modal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ow-approval-title"
      onClick={onBackdropClick}
    >
      <div className="ow-modal ow-modal--approval" ref={dialogRef} tabIndex={-1}>
        <header className="ow-modal__head">
          <h2 id="ow-approval-title">這份成果，準備好了嗎？</h2>
          <button type="button" className="ow-modal__close" onClick={onCancel} aria-label="關閉核准視窗">×</button>
        </header>

        <p className="ow-modal__sub">
          請核對內容與原始資料。核准後即可複製或下載這個版本；內容仍由你自行使用。
        </p>

        <div className="ow-modal__summary">
          <b>{artifact.title}</b>
          <span> · v{String(artifact.version).padStart(2, '0')} · {artifact.id}</span>
        </div>

        <div className="ow-modal__checks">
          <label className="ow-modal__check">
            <input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} />
            <span>我已核對來源、數字與需要人工確認的事項。</span>
          </label>
          <label className="ow-modal__check">
            <input type="checkbox" checked={content} onChange={e => setContent(e.target.checked)} />
            <span>我已檢查這份草稿，確認可用於後續工作。</span>
          </label>
        </div>

        <p className="ow-modal__note">這是本機示範核准，僅保留於目前頁面，沒有寫入正式紀錄。</p>

        <footer className="ow-modal__foot">
          <button type="button" className="ow-secondary ow-secondary--ghost" onClick={onCancel}>返回檢查</button>
          <button
            type="button"
            className="ow-primary"
            onClick={() => onConfirm(ack, content)}
            disabled={!(ack && content)}
            aria-disabled={ack && content ? 'false' : 'true'}
            title={ack && content ? '標記為已交付' : '需勾選兩項聲明'}
          >
            核准這個版本
          </button>
        </footer>
      </div>
    </div>
  );
}
