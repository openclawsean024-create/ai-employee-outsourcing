'use client';

import { useEffect, useRef } from 'react';

interface Props {
  kind: 'info' | 'success' | 'warn';
  text: string;
  onClose: () => void;
}

const ICON: Record<Props['kind'], string> = {
  info: 'ℹ️',
  success: '✅',
  warn: '⚠️',
};

export default function OutcomeToast({ kind, text, onClose }: Props) {
  // 只在初次掛載時啟動自動關閉計時，避免父層 onClose 參考變動時重新計算計時
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const t = window.setTimeout(() => onCloseRef.current(), 3200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={`ow-toast ow-toast--${kind}`} role="status" aria-live="polite">
      <span className="ow-toast__icon" aria-hidden>{ICON[kind]}</span>
      <span className="ow-toast__text">{text}</span>
      <button type="button" className="ow-toast__close" onClick={onClose} aria-label="關閉提示">
        ✕
      </button>
    </div>
  );
}