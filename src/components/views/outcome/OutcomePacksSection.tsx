'use client';

import { OUTCOME_PACK_LABELS } from '@/lib/outcomes/mock';
import type { OutcomePackId } from '@/lib/outcomes/types';

const PACK_DESC: Record<OutcomePackId, { title: string; body: string; tag: string }> = {
  'cs-faq': {
    title: '每週客服 FAQ',
    body: '重複被問的事，整理成有來源、可確認的回覆。',
    tag: '對話匯出 / 手動貼上 → 回覆草稿',
  },
  'order-anomalies': {
    title: '訂單異常清單',
    body: '從訂單表中找出需要你留意的項目，逐筆確認。',
    tag: '訂單 CSV → 異常與待辦清單',
  },
  'social-weekly': {
    title: '社群內容週報',
    body: '回看本週內容與互動，把觀察留下來，準備下一週。',
    tag: '貼文匯出 / 附件 → 內容週報',
  },
};

export default function OutcomePacksSection({ onNewTask }: { onNewTask: () => void }) {
  return (
    <section className="ow-packs" id="ow-packs" aria-labelledby="ow-packs-title">
      <div className="ow-section-heading">
        <span className="ow-section-heading__num">01—03</span>
        <h2 id="ow-packs-title">三種成果，剛好照顧日常。</h2>
        <span className="ow-section-heading__line" />
      </div>

      <div className="ow-packs__grid">
        {(Object.keys(OUTCOME_PACK_LABELS) as OutcomePackId[]).map(id => {
          const pack = OUTCOME_PACK_LABELS[id];
          const desc = PACK_DESC[id];
          return (
            <button key={id} type="button" className="ow-pack-card" data-pack={id} onClick={onNewTask} aria-label={`新增${desc.title}任務`}>
              <span className="ow-pack-card__top">
                <span className="ow-pack-card__symbol" aria-hidden>
                  {id === 'cs-faq' ? '💬' : id === 'order-anomalies' ? '🧾' : '📣'}
                </span>
                <span className="ow-pack-card__arrow" aria-hidden>↗</span>
              </span>
              <h3 className="ow-pack-card__name">{desc.title}</h3>
              <p className="ow-pack-card__body">{desc.body}</p>
              <small className="ow-pack-card__tag">{desc.tag}</small>
            </button>
          );
        })}
      </div>

      <p className="ow-packs__note">
        不做通用 Agent 市集、不做 144 種 Agent 目錄、不做無人值守承諾。
        所有對外動作皆須人工核准，且僅作複製/下載，不會自動發送。
      </p>
    </section>
  );
}
