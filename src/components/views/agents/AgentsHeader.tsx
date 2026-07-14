export default function AgentsHeader() {
  return (
    <section className="pt-4">
      <div className="text-micro mb-3">Agent 庫</div>
      <h1 className="text-h1 text-balance">
        144 種預載 Agent，
        <br />
        <span className="text-[var(--brand)]">挑 3-5 個就開工</span>
      </h1>
      <p className="text-body-lg mt-5 max-w-2xl">
        從客服到行銷、從設計到法務。每一種都是企業可用的 specialists，
        不用微調 prompt，直接挑來用。
      </p>
    </section>
  );
}
