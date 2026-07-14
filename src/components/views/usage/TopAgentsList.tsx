'use client';

interface Props {
  topAgents: [string, number][];
  maxAgentUse: number;
}

export default function TopAgentsList({ topAgents, maxAgentUse }: Props) {
  return (
    <section>
      <div className="mb-4">
        <div className="text-micro mb-2">最常用 Agent</div>
        <h2 className="text-h3">Top 5</h2>
      </div>
      <div className="card p-5">
        {topAgents.length === 0 ? (
          <div className="text-center text-body-sm text-[var(--ink-500)] py-6">尚無資料</div>
        ) : (
          <div className="space-y-3">
            {topAgents.map(([name, count]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-body font-medium">{name}</div>
                  <div className="text-body-sm text-tabular text-[var(--ink-700)]">{count} 次</div>
                </div>
                <div className="h-1.5 bg-[var(--ink-50)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--brand)] transition-all"
                    style={{ width: `${(count / maxAgentUse) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
