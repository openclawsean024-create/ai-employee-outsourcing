'use client';

import { useEffect, useState } from 'react';
import type { OutcomeArtifact } from '@/lib/outcomes/types';
import OutcomeReviewToolbar from './OutcomeReviewToolbar';
import OutcomeDocument from './OutcomeDocument';
import OutcomeEvidence from './OutcomeEvidence';
import OutcomeApprovalBar from './OutcomeApprovalBar';

interface Props {
  artifact: OutcomeArtifact;
  onCopy: () => void;
  onDownload: () => void;
  onRequestApproval: () => void;
  onRevoke: () => void;
}

type Tab = 'document' | 'evidence';

export default function OutcomeReview({
  artifact,
  onCopy,
  onDownload,
  onRequestApproval,
  onRevoke,
}: Props) {
  const [tab, setTab] = useState<Tab>('document');
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);
  const isDelivered = artifact.state === 'delivered';

  useEffect(() => {
    setTab('document');
    setHighlightedSource(null);
  }, [artifact.id]);

  const handleCitationJump = (idx: number) => {
    setHighlightedSource(idx);
    setTab('evidence');
  };

  return (
    <div className="ow-review">
      <OutcomeReviewToolbar
        artifact={artifact}
        tab={tab}
        onTabChange={(t) => {
          setTab(t);
          if (t === 'document') setHighlightedSource(null);
        }}
        onCopy={onCopy}
        onDownload={onDownload}
      />

      <div className="ow-review__body">
        {tab === 'document' ? (
          <OutcomeDocument artifact={artifact} onCitationJump={handleCitationJump} />
        ) : (
          <OutcomeEvidence artifact={artifact} highlightedSource={highlightedSource} />
        )}
      </div>

      <OutcomeApprovalBar
        artifact={artifact}
        onRequestApproval={onRequestApproval}
        onRevoke={onRevoke}
        isDelivered={isDelivered}
      />
    </div>
  );
}
