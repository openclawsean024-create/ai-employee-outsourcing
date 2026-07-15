'use client';

interface Props {
  topCategories: [string, number][];
}

export default function CategoryDistribution({ topCategories }: Props) {
  return (
    <section>
      <div className="mb-4">
        <div className="text-micro mb-2">類別分布</div>
        <h2 className="text-h3">10 大類</h2>
      </div>
      <div className="card p-5">
        <div className="space-y-2.5">
          {topCategories.map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between">
              <div className="text-body">{cat}</div>
              <div className="text-body-sm text-tabular text-[var(--navy-700)]">{count} 次</div>
            </div>
          ))}
          {topCategories.length === 0 && (
            <div className="text-center text-body-sm text-[var(--navy-500)] py-6">尚無資料</div>
          )}
        </div>
      </div>
    </section>
  );
}
