import Link from 'next/link';

/** 過渡首頁：服務官網首頁於 M1 AC-010 完成後取代本頁。 */
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-h2">服務官網建置中</h1>
      <p className="text-body">原 AI 員工工作台已移到示範頁。</p>
      <Link href="/demo" className="btn btn-secondary">
        前往示範頁
      </Link>
    </main>
  );
}
