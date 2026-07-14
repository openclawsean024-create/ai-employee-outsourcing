'use client';

interface DayBucket {
  date: Date;
  count: number;
  label: string;
}

interface Props {
  dailyTasks: DayBucket[];
  maxDaily: number;
  hasTasks: boolean;
}

export default function DailyTasksChart({ dailyTasks, maxDaily, hasTasks }: Props) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="text-micro mb-2">近 7 天</div>
          <h2 className="text-h3">每日任務量</h2>
        </div>
      </div>
      <div className="card p-6">
        {!hasTasks ? (
          <div className="text-center text-body-sm text-[var(--ink-500)] py-8">
            開始建立任務後，這裡會顯示每日使用趨勢
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-40">
            {dailyTasks.map((d, i) => {
              const heightPct = (d.count / maxDaily) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-body-sm text-tabular font-medium text-[var(--ink-700)]">{d.count}</div>
                  <div className="w-full bg-[var(--ink-50)] rounded-md overflow-hidden" style={{ height: 100 }}>
                    <div
                      className="w-full bg-[var(--brand)] transition-all duration-500 mt-auto"
                      style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                    />
                  </div>
                  <div className="text-body-sm text-[var(--ink-500)]">{d.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
