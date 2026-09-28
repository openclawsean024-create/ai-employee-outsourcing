'use client';

import { useEffect, useRef } from 'react';
import { OUTCOME_PACK_LABELS } from '@/lib/outcomes/mock';
import type { OutcomePackId } from '@/lib/outcomes/types';

interface Props {
  onCancel: () => void;
  onPick: (packId: OutcomePackId) => void;
}

const PACK_HINT: Record<OutcomePackId, { code: string; tag: string }> = {
  'cs-faq': { code: '01', tag: '對話匯出、手動貼上 → 回覆草稿' },
  'order-anomalies': { code: '02', tag: '訂單 CSV → 異常與待辦清單' },
  'social-weekly': { code: '03', tag: '貼文匯出、附件 → 內容週報' },
};

export default function OutcomeNewTaskDialog({ onCancel, onPick }: Props) {
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
      aria-labelledby="ow-newtask-title"
      onClick={onBackdropClick}
    >
      <div className="ow-modal ow-modal--newtask" ref={dialogRef} tabIndex={-1}>
        <header className="ow-modal__head">
          <h2 id="ow-newtask-title">本週想先完成哪一件？</h2>
          <button type="button" className="ow-modal__close" onClick={onCancel} aria-label="關閉任務包視窗">×</button>
        </header>

        <p className="ow-modal__sub">
          選擇一種固定任務包，在目前頁面建立空白示範任務；不會上傳資料或啟動背景處理。
        </p>

        <div className="ow-modal__packs">
          {(Object.keys(OUTCOME_PACK_LABELS) as OutcomePackId[]).map(id => {
            const pack = OUTCOME_PACK_LABELS[id];
            const hint = PACK_HINT[id];
            return (
              <button
                key={id}
                type="button"
                className="ow-modal__pack"
                onClick={() => onPick(id)}
              >
                <span className="ow-modal__pack-code">{hint.code}</span>
                <span className="ow-modal__pack-body">
                  <b>{pack.name}</b>
                  <small>{hint.tag}</small>
                </span>
                <span className="ow-modal__pack-arrow">→</span>
              </button>
            );
          })}
        </div>

        <p className="ow-modal__note">示範模式不會上傳資料、呼叫模型或新增正式任務。</p>

        <footer className="ow-modal__foot">
          <button type="button" className="ow-secondary ow-secondary--ghost" onClick={onCancel}>返回</button>
        </footer>
      </div>
    </div>
  );
}
