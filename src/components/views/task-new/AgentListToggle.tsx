'use client';

export function TaskNewHeader() {
  return (
    <section>
      <div className="text-micro mb-3">建立任務</div>
      <h1 className="text-h1 text-balance">描述工作，3 秒開始</h1>
      <p className="text-body-lg mt-4 max-w-2xl">
        寫下任務內容，選 3-5 個 Agent 一起執行。
        完成後輸出會存到「任務歷史」可隨時回查。
      </p>
    </section>
  );
}
