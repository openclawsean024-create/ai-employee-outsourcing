'use client';

import type { OutcomeArtifact } from '@/lib/outcomes/types';

interface Props {
  artifact: OutcomeArtifact;
}

export default function OutcomeTimeNote({ artifact }: Props) {
  // 全部使用範例數字，不論選到哪一筆；標示清楚
  const baselineMinutes = 60;
  const actualMinutes = 25;
  const correctionMinutes = 8;

  return (
    <section className="ow-timenote" id="ow-timenote" aria-labelledby="ow-timenote-title">
      <div className="ow-section-heading">
        <h2 id="ow-timenote-title">{artifact.title}｜處理時間</h2>
        <span className="ow-tag ow-tag--demo">範例</span>
        <span className="ow-section-heading__line" />
      </div>
      <div className="ow-timenote__lines">
        <div className="ow-timenote__line">
          <span>原本人工處理</span>
          <span className="ow-timenote__track"><i style={{ width: '100%' }} /></span>
          <b className="mono">{baselineMinutes}m</b>
        </div>
        <div className="ow-timenote__line">
          <span>本次處理合計</span>
          <span className="ow-timenote__track"><i className="actual" style={{ width: `${(actualMinutes / baselineMinutes) * 100}%` }} /></span>
          <b className="mono">{actualMinutes}m</b>
        </div>
        <div className="ow-timenote__line">
          <span>其中人工修正</span>
          <span className="ow-timenote__track"><i className="correction" style={{ width: `${(correctionMinutes / baselineMinutes) * 100}%` }} /></span>
          <b className="mono">{correctionMinutes}m</b>
        </div>
      </div>
      <p className="ow-timenote__caveat">
        由使用者記錄。人工修正已包含在本次合計中。<br />
        此處為示範數字，並非實測成效或節省承諾。
      </p>
    </section>
  );
}
