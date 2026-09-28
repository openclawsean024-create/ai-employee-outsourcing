'use client';

import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  tab: 'document' | 'evidence';
  onTabChange: (t: 'document' | 'evidence') => void;
  onCopy: () => void;
  onDownload: () => void;
}

const fmtDate = (iso: string) => {
  if (!iso) return '尚未產生';
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
};

export default function OutcomeReviewToolbar({ artifact, tab, onTabChange, onCopy, onDownload }: Props) {
  const locked = artifact.state !== 'delivered';

  return (
    <div className="ow-toolbar">
      <div className="ow-toolbar__path">
        <span className="mono ow-toolbar__id">{artifact.id}</span>
        <span aria-hidden>/</span>
        <b>{artifact.title}</b>
      </div>

      <div className="ow-toolbar__tools">
        <span className="ow-toolbar__revision mono">VERSION {String(artifact.version).padStart(2, '0')}</span>
        <span className={`ow-tag ow-tag--state ow-tag--${artifact.state}`}>
          {artifact.state === 'captured' && '擷取中'}
          {artifact.state === 'draft' && '草稿'}
          {artifact.state === 'awaiting-approval' && '待人工核准'}
          {artifact.state === 'delivered' && '已交付'}
        </span>
        <button
          type="button"
          className="ow-toolbar__icon"
          onClick={onCopy}
          disabled={locked}
          aria-disabled={locked ? 'true' : 'false'}
          title={locked ? '請先完成人工核准' : '複製'}
          aria-label="複製"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden><rect x="7" y="6" width="9" height="11" rx="1" stroke="currentColor" /><path d="M12 4V3H3v11h2" stroke="currentColor" /></svg>
        </button>
        <button
          type="button"
          className="ow-toolbar__icon"
          onClick={onDownload}
          disabled={locked}
          aria-disabled={locked ? 'true' : 'false'}
          title={locked ? '請先完成人工核准' : '下載'}
          aria-label="下載"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden><path d="M10 2v10m-4-4 4 4 4-4M3 13v4h14v-4" stroke="currentColor" strokeWidth="1.3" /></svg>
        </button>
      </div>
    </div>
  );
}
