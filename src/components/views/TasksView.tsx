'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { TasksHeader, TaskFilters, TaskTable, TaskDetailModal } from './tasks';
import type { StatusFilter } from './tasks/TaskFilters';
import type { TaskLog } from '@/lib/types';

export default function TasksView() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('createdAt').reverse().toArray()) || [];
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewing, setViewing] = useState<TaskLog | null>(null);

  const filtered = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (q && !t.taskName.toLowerCase().includes(q.toLowerCase()) && !t.agentNames.some(n => n.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successCount = tasks.filter(t => t.status === 'success').length;

  return (
    <div className="space-y-8">
      <TasksHeader taskCount={tasks.length} successCount={successCount} totalCost={totalCost} />

      <TaskFilters q={q} setQ={setQ} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <TaskTable tasks={filtered} hasAnyTask={tasks.length > 0} onView={setViewing} />

      <TaskDetailModal task={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
