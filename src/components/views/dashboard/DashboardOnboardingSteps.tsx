'use client';

const STEPS = [
  { week: '第 1 天', title: '挑選 3-5 個 Agent', desc: '從 144 種預載 Agent 中挑出最常用的工作場景，建立你的工作團隊。' },
  { week: '第 2 天', title: '執行第一個任務', desc: '用真實工作任務測試，看 3 個 Agent 協作輸出的品質是否符合期待。' },
  { week: '第 7 天', title: '儲存為範本 + 持續優化', desc: '把好用的任務存成範本，之後一鍵執行。每月逐步擴充 Agent 組合。' },
];

export default function DashboardOnboardingSteps() {
  return (
    <section className="bg-[var(--bg-soft)] -mx-6 md:-mx-10 px-6 md:px-10 py-16 rounded-2xl">
      <div className="text-center mb-12">
        <div className="text-micro mb-3">導入流程</div>
        <h2 className="text-h2">3 步把你的 AI 工作團隊建起來</h2>
        <p className="text-body-lg mt-4 max-w-2xl mx-auto">
          不需要 API 金鑰、不需要工程師。從挑選 Agent 到第一次執行，
          一個工作天就上手。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {STEPS.map((step, i) => (
          <div key={i} className="card p-6">
            <div className="badge badge-brand mb-4">{step.week}</div>
            <div className="text-h4 mb-2">{step.title}</div>
            <p className="text-body-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
