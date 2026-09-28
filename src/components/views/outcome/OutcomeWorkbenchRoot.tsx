'use client';

import { useEffect, useState } from 'react';
import { useOutcomeStore } from '@/lib/outcomes/store';
import type { OutcomeArtifact, OutcomePackId } from '@/lib/outcomes/types';
import OutcomeHeader from './OutcomeHeader';
import OutcomeMasthead from './OutcomeMasthead';
import OutcomeQueue from './OutcomeQueue';
import OutcomeReview from './OutcomeReview';
import OutcomePacksSection from './OutcomePacksSection';
import OutcomeTimeNote from './OutcomeTimeNote';
import OutcomeNewTaskDialog from './OutcomeNewTaskDialog';
import OutcomeApprovalDialog from './OutcomeApprovalDialog';
import OutcomeToast from './OutcomeToast';

export default function OutcomeWorkbenchRoot() {
  const artifacts = useOutcomeStore(s => s.artifacts);
  const selectedId = useOutcomeStore(s => s.selectedId);
  const select = useOutcomeStore(s => s.select);
  const startNewPack = useOutcomeStore(s => s.startNewPack);
  const approve = useOutcomeStore(s => s.approve);
  const revokeApproval = useOutcomeStore(s => s.revokeApproval);
  const requestApproval = useOutcomeStore(s => s.requestApproval);
  const simulateAiEntries = useOutcomeStore(s => s.simulateAiEntries);

  const [showNewTask, setShowNewTask] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<OutcomeArtifact | null>(null);
  const [toast, setToast] = useState<{ kind: 'info' | 'success' | 'warn'; text: string } | null>(null);

  const selected = artifacts.find(a => a.id === selectedId) ?? artifacts[0];

  useEffect(() => {
    if (!selected && artifacts.length > 0) {
      select(artifacts[0].id);
    }
  }, [selected, artifacts, select]);

  if (!selected) {
    return (
      <div className="ow-page">
        <OutcomeHeader onNewTask={() => setShowNewTask(true)} />
        <div className="ow-empty">
          <p>目前沒有任何成果。請由右上角「新增本週任務」開始一個工作包。</p>
        </div>
      </div>
    );
  }

  const handleCreate = (packId: OutcomePackId) => {
    const weekLabel = defaultWeekLabel();
    const weekRange = defaultWeekRange();
    const newId = startNewPack(packId, weekLabel, weekRange);
    setShowNewTask(false);
    setToast({ kind: 'info', text: `已新增空白任務範例；尚未上傳資料或執行工作。` });
    return newId;
  };

  const handleRequestApproval = () => {
    if (selected.entries.length === 0 && selected.state === 'captured') {
      setToast({ kind: 'warn', text: '目前沒有草稿可送交，請先按下「重新產生草稿」（純前端示意）。' });
      return;
    }
    requestApproval(selected.id);
    const after = useOutcomeStore.getState().artifacts.find(a => a.id === selected.id);
    if (!after || after.state !== 'awaiting-approval') {
      setToast({ kind: 'warn', text: '目前狀態無法進入核准流程（純前端示範）。' });
      return;
    }
    setPendingApproval(after);
  };

  const handleConfirmApproval = (acknowledgedCheck: boolean, contentCheck: boolean) => {
    if (!pendingApproval) return;
    if (!acknowledgedCheck || !contentCheck) {
      setToast({ kind: 'warn', text: '請勾選兩項聲明，才能視為已核准（純前端示範）。' });
      return;
    }
    approve(pendingApproval.id, {
      by: 'human-demo',
      at: new Date().toISOString(),
      acknowledgedCheck,
      contentCheck,
    });
    const after = useOutcomeStore.getState().artifacts.find(a => a.id === pendingApproval.id);
    if (after?.state !== 'delivered' || !after.approval) {
      setToast({ kind: 'warn', text: '目前狀態無法核准；草稿內容可能需要補齊。' });
      return;
    }
    setPendingApproval(null);
    setToast({ kind: 'success', text: '已完成示範核准。現在可以複製或下載這份範例。' });
  };

  // 撤銷前必須顯式確認（v3 行為）
  const handleRevoke = () => {
    const ok = typeof window !== 'undefined'
      ? window.confirm('撤銷這份範例的核准？撤銷後可以修改內容，複製與下載會重新鎖定。')
      : true;
    if (!ok) return;
    revokeApproval(selected.id);
    setToast({ kind: 'info', text: '已撤銷核准，回到「草稿」狀態。' });
  };

  const handleCopy = async () => {
    if (selected.state !== 'delivered' || !selected.approval) {
      setToast({ kind: 'warn', text: '尚未通過人工核准，無法複製（純前端示範）。' });
      return;
    }
    const text = exportSelectedText(selected);
    try {
      await navigator.clipboard.writeText(text);
      setToast({ kind: 'success', text: '已複製到剪貼簿（純前端示範，未實際送出）。' });
    } catch {
      setToast({ kind: 'warn', text: '瀏覽器不允許剪貼簿存取；請改用下載。' });
    }
  };

  const handleDownload = () => {
    if (selected.state !== 'delivered' || !selected.approval) {
      setToast({ kind: 'warn', text: '尚未通過人工核准，無法下載（純前端示範）。' });
      return;
    }
    try {
      const text = exportSelectedText(selected);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selected.id}-範例-v${selected.version}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setToast({ kind: 'success', text: '已下載核准後的範例文字檔。' });
    } catch {
      setToast({ kind: 'warn', text: '下載失敗，請改用複製。' });
    }
  };

  const handleSimulateAiEntries = () => {
    if (selected.state === 'delivered') {
      setToast({ kind: 'warn', text: '已交付狀態下不可重新產生（純前端示範）。' });
      return;
    }
    simulateAiEntries(selected.id);
    setToast({ kind: 'info', text: '已模擬產生草稿（純前端示意，不會呼叫任何模型）。' });
  };

  return (
    <>
    <a className="ow-skip" href="#ow-review-pane">跳至成果審閱</a>
    <div className="ow-page">
      <OutcomeHeader onNewTask={() => setShowNewTask(true)} />

      <OutcomeMasthead
        artifact={selected}
        artifactsCount={artifacts.length}
        onSimulateDraft={handleSimulateAiEntries}
      />

      <div className="ow-shell">
        <aside className="ow-queue-pane">
          <OutcomeQueue
            artifacts={artifacts}
            selectedId={selected.id}
            onSelect={id => select(id)}
          />
        </aside>

        <section className="ow-review-pane" id="ow-review-pane" tabIndex={-1}>
          <OutcomeReview
            artifact={selected}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onRequestApproval={handleRequestApproval}
            onRevoke={handleRevoke}
          />
        </section>
      </div>

      <OutcomePacksSection onNewTask={() => setShowNewTask(true)} />

      <OutcomeTimeNote artifact={selected} />

      {showNewTask && (
        <OutcomeNewTaskDialog
          onCancel={() => setShowNewTask(false)}
          onPick={handleCreate}
        />
      )}

      {pendingApproval && (
        <OutcomeApprovalDialog
          artifact={pendingApproval}
          onCancel={() => setPendingApproval(null)}
          onConfirm={handleConfirmApproval}
        />
      )}

      {toast && <OutcomeToast kind={toast.kind} text={toast.text} onClose={() => setToast(null)} />}
    </div>
    </>
  );
}

function exportSelectedText(a: OutcomeArtifact): string {
  return [
    `週作｜範例資料`,
    `${a.title} · ${a.weekLabel}`,
    `${a.id} · v${a.version}`,
    '',
    ...a.entries.map((e, i) => `${i + 1}. ${e.title}\n${e.text}`),
    '',
    `來源：${a.sources.map(s => s.name).join('、')}`,
    `產生時間：${a.generatedAt || '尚未產生'}`,
    `模型：${a.modelLabel}`,
    `估算成本：NT$ ${a.estimatedCostNtd}（範例）`,
    `本文件為介面原型的已核准範例，非真實營運結果。`,
  ].join('\n');
}

function defaultWeekLabel(): string {
  const d = new Date();
  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / 86400000);
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${year} 第 ${week} 週`;
}

function defaultWeekRange(): string {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)} – ${fmt(sunday)}`;
}
