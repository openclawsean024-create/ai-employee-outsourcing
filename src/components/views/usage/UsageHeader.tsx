'use client';

interface Props {
  savedHours: number;
}

export default function UsageHeader({ savedHours }: Props) {
  return (
    <section>
      <div className="text-micro mb-3">用量報表</div>
      <h1 className="text-h1 text-balance">
        你的 AI 團隊
        <br />
        <span className="text-[var(--brand)]">這週幫你省了 {savedHours.toFixed(1)} 小時</span>
      </h1>
    </section>
  );
}
