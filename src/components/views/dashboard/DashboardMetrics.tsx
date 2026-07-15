'use client';

interface MetricProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: 'success' | 'neutral' | 'warning';
}

function Metric({ label, value, delta, deltaColor = 'neutral' }: MetricProps) {
  return (
    <div className="card p-5">
      <div className="text-micro mb-3">{label}</div>
      <div className="text-h3 text-tabular mb-2">{value}</div>
      {delta && (
        <div className={`text-[12px] ${
          deltaColor === 'success' ? 'text-[var(--success)]' :
          deltaColor === 'warning' ? 'text-[var(--warning)]' :
          'text-[var(--navy-500)]'
        }`}>{delta}</div>
      )}
    </div>
  );
}

export default function DashboardMetrics() {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric
          label="任務執行 / 月"
          value="1,244"
          delta="↑ 4.9×"
          deltaColor="success"
        />
        <Metric
          label="花費 / 月"
          value="$118"
          delta="↓ 69%"
          deltaColor="success"
        />
        <Metric
          label="平均任務成本"
          value="$0.09"
          delta="從 $0.14 下降"
          deltaColor="neutral"
        />
        <Metric
          label="評測通過率"
          value="96%"
          delta="目標 ≥ 90%"
          deltaColor="success"
        />
      </div>
    </section>
  );
}
