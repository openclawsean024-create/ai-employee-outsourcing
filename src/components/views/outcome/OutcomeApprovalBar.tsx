'use client';

import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
  isDelivered: boolean;
  onRequestApproval: () => void;
  onRevoke: () => void;
}

export default function OutcomeApprovalBar({ artifact, isDelivered, onRequestApproval, onRevoke }: Props) {
  const hasContent = artifact.entries.length > 0 && artifact.entries.some(e => e.text.trim() !== '');

  return (
    <div className="ow-approval">
      <div className="ow-approval__left">
        <span className="ow-approval__icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <div className="ow-approval__copy">
          <b>
            {isDelivered
              ? '已核准，可供後續使用'
              : artifact.state === 'awaiting-approval'
                ? '最後一步，由你把關'
                : artifact.state === 'captured'
                  ? '資料整理中'
                  : '檢查並核准 →'}
          </b>
          <p>
            {isDelivered
              ? '先撤銷核准，即可修改內容；修改後要重新核准。'
              : artifact.state === 'awaiting-approval'
                ? '核准後可複製或下載；不會自動發送。'
                : artifact.state === 'captured'
                  ? '擷取狀態僅供展示，沒有背景任務。'
                  : '草稿已就緒。請檢查來源後決定是否核准。'}
          </p>
        </div>
      </div>

      <div className="ow-approval__actions">
        <button
          type="button"
          className="ow-secondary"
          onClick={onRequestApproval}
          disabled={isDelivered || artifact.state === 'captured' || !hasContent}
          aria-disabled={isDelivered || artifact.state === 'captured' || !hasContent ? 'true' : 'false'}
          title={!hasContent ? '目前沒有可送交的草稿' : '開啟人工核准流程'}
        >
          檢查並核准 <span aria-hidden>→</span>
        </button>
        {isDelivered && (
          <button type="button" className="ow-secondary ow-secondary--ghost" onClick={onRevoke}>
            撤銷核准並編輯 ↶
          </button>
        )}
      </div>
    </div>
  );
}
