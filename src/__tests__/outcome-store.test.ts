/**
 * 成果工作台 store — workflow / security regression tests
 *
 * 覆蓋的規則：
 *   - updateDraft 對已交付 artifact 完全不變更（含 approval）
 *   - setState_ 強制合法工作流程轉移
 *   - setState_ → delivered 需要 state=awaiting-approval + 非空草稿 + 有效 approval
 *   - approve 只在 state=awaiting-approval + 非空草稿 + 兩項聲明皆 true 時才進入 delivered
 *   - revokeApproval 只在 state=delivered 時才能撤銷
 *   - requestApproval 為原子動作：captured → draft / awaiting-approval，
 *     draft → awaiting-approval，且不會在多個 set() 之間被 stale data 覆蓋
 *
 * 注意：依 GOAL.md 規範，本檔案不被執行；撰寫目的為日後若解除禁令可直接 vitest run。
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useOutcomeStore } from '@/lib/outcomes/store';
import { SAMPLE_OUTCOMES } from '@/lib/outcomes/mock';
import type { OutcomeApproval } from '@/lib/outcomes/types';

const sampleId = (i = 0) => SAMPLE_OUTCOMES[i].id;

const makeApproval = (
  acknowledgedCheck: boolean,
  contentCheck: boolean,
): OutcomeApproval => ({
  by: 'human-demo',
  at: '2026-09-27T10:00:00.000Z',
  acknowledgedCheck,
  contentCheck,
});

const resetStore = () => {
  useOutcomeStore.setState({
    artifacts: SAMPLE_OUTCOMES,
    selectedId: SAMPLE_OUTCOMES[0]?.id ?? '',
    acknowledgedDemo: false,
  });
};

describe('outcome store: updateDraft', () => {
  beforeEach(resetStore);

  it('captured artifact 可以被編輯草稿', () => {
    const id = sampleId(3); // 'extracting-cs-2026-w39-04' (state=captured, draft 空)
    useOutcomeStore.getState().updateDraft(id, '# hello');
    const a = useOutcomeStore.getState().artifacts.find(x => x.id === id);
    expect(a?.draftMarkdown).toBe('# hello');
  });

  it('已交付 artifact 不可被編輯，且不得清掉 approval', () => {
    const id = sampleId(2); // 'social-weekly-2026-w39' (state=delivered, 有 approval)
    const before = useOutcomeStore.getState().artifacts.find(x => x.id === id);
    expect(before?.state).toBe('delivered');
    expect(before?.approval).not.toBeNull();

    useOutcomeStore.getState().updateDraft(id, '# hijack');

    const after = useOutcomeStore.getState().artifacts.find(x => x.id === id);
    expect(after?.draftMarkdown).toBe(before?.draftMarkdown);
    expect(after?.approval).toEqual(before?.approval);
    expect(after?.state).toBe('delivered');
  });

  it('對不存在的 id 為 no-op', () => {
    const len = useOutcomeStore.getState().artifacts.length;
    useOutcomeStore.getState().updateDraft('does-not-exist', 'x');
    expect(useOutcomeStore.getState().artifacts.length).toBe(len);
  });
});

describe('outcome store: setState_ workflow', () => {
  beforeEach(resetStore);

  it('captured → draft 允許', () => {
    const id = sampleId(3);
    useOutcomeStore.getState().setState_(id, 'draft');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('draft');
  });

  it('captured → delivered 在沒 approval / 空草稿時被拒絕', () => {
    const id = sampleId(3);
    useOutcomeStore.getState().setState_(id, 'delivered');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('captured');
  });

  it('draft → delivered 沒有 approval 時被拒絕', () => {
    const id = sampleId(1); // 'order-anomalies-2026-w39' (state=draft, 有草稿, approval=null)
    useOutcomeStore.getState().setState_(id, 'delivered');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('draft');
  });

  it('awaiting-approval → delivered 在有 approval 且兩項聲明皆 true 時允許', () => {
    const id = sampleId(0); // 'cs-faq-2026-w39' (state=awaiting-approval, 有草稿)
    // 先塞一個有效 approval
    useOutcomeStore.setState(state => ({
      artifacts: state.artifacts.map(a =>
        a.id === id ? { ...a, approval: makeApproval(true, true) } : a,
      ),
    }));
    useOutcomeStore.getState().setState_(id, 'delivered');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('delivered');
  });

  it('awaiting-approval → delivered 在 acknowledgedCheck=false 時被拒絕', () => {
    const id = sampleId(0);
    useOutcomeStore.setState(state => ({
      artifacts: state.artifacts.map(a =>
        a.id === id ? { ...a, approval: makeApproval(false, true) } : a,
      ),
    }));
    useOutcomeStore.getState().setState_(id, 'delivered');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('不合法轉移（如 awaiting-approval → captured）被拒絕', () => {
    const id = sampleId(0);
    useOutcomeStore.getState().setState_(id, 'captured');
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });
});

describe('outcome store: approve gate', () => {
  beforeEach(resetStore);

  it('state 不是 awaiting-approval 時 approve 被拒絕', () => {
    const id = sampleId(1); // state=draft
    useOutcomeStore.getState().approve(id, makeApproval(true, true));
    const after = useOutcomeStore.getState().artifacts.find(a => a.id === id);
    expect(after?.state).toBe('draft');
    expect(after?.approval).toBeNull();
  });

  it('草稿為空時 approve 被拒絕', () => {
    const id = sampleId(0);
    // 把 entries 與 draftMarkdown 兩者同時清空：
    // hasSubmittableDraft (store.ts:69-74) 會優先檢查 entries.length > 0，
    // 若 entries 非空就直接視為可送交（不論 draftMarkdown），
    // 因此必須兩者皆清才會真正進入 draftMarkdown 為空的分支。
    useOutcomeStore.setState(state => ({
      artifacts: state.artifacts.map(a =>
        a.id === id ? { ...a, entries: [], draftMarkdown: '' } : a,
      ),
    }));
    useOutcomeStore.getState().approve(id, makeApproval(true, true));
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('兩項聲明皆為 true 才允許 approve', () => {
    const id = sampleId(0);
    useOutcomeStore.getState().approve(id, makeApproval(true, true));
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('delivered');
  });

  it('acknowledgedCheck=false 時 approve 被拒絕', () => {
    const id = sampleId(0);
    useOutcomeStore.getState().approve(id, makeApproval(false, true));
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('contentCheck=false 時 approve 被拒絕', () => {
    const id = sampleId(0);
    useOutcomeStore.getState().approve(id, makeApproval(true, false));
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });
});

describe('outcome store: revokeApproval', () => {
  beforeEach(resetStore);

  it('只在 state=delivered 時能撤銷', () => {
    const id = sampleId(0); // awaiting-approval
    useOutcomeStore.getState().revokeApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('撤銷後回到 draft 並清掉 approval', () => {
    const id = sampleId(2); // delivered
    useOutcomeStore.getState().revokeApproval(id);
    const after = useOutcomeStore.getState().artifacts.find(a => a.id === id);
    expect(after?.state).toBe('draft');
    expect(after?.approval).toBeNull();
  });
});

describe('outcome store: requestApproval (atomic)', () => {
  beforeEach(resetStore);

  it('captured + 空草稿：只前進到 draft', () => {
    const id = sampleId(3);
    useOutcomeStore.getState().requestApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('draft');
  });

  it('captured + 有草稿：直接到 awaiting-approval', () => {
    const id = sampleId(3);
    useOutcomeStore.getState().updateDraft(id, '# content');
    useOutcomeStore.getState().requestApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('draft + 有草稿：到 awaiting-approval', () => {
    const id = sampleId(1); // order-anomalies-2026-w39 (state=draft)
    useOutcomeStore.getState().requestApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('awaiting-approval 不會被降階', () => {
    const id = sampleId(0);
    useOutcomeStore.getState().requestApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe(
      'awaiting-approval',
    );
  });

  it('delivered 不會被降階', () => {
    const id = sampleId(2);
    useOutcomeStore.getState().requestApproval(id);
    expect(useOutcomeStore.getState().artifacts.find(a => a.id === id)?.state).toBe('delivered');
  });
});
