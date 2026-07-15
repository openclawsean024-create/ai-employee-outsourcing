'use client';

import { fmtMoney } from '@/lib/utils';

interface Props {
  taskCount: number;
  successCount: number;
  totalCost: number;
}

export default function TasksHeader({ taskCount, successCount, totalCost }: Props) {
  const successRate = taskCount > 0 ? Math.round((successCount / taskCount) * 100) : 0;
  return (
    <section>
      <div className="text-micro mb-3">任務歷史</div>
      <h1 className="text-h1 text-balance">
        {taskCount} 筆任務
        <span className="text-[var(--navy-500)] font-normal">，成功率 {successRate}%</span>
      </h1>
      <p className="text-body-lg mt-3">
        累計花費 {fmtMoney(totalCost)} · 每一筆都可重新檢視輸出
      </p>
    </section>
  );
}
