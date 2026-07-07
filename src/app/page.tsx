const checklist = [
  "App Router + TypeScript を導入",
  "ESLint / Tailwind / ビルド確認を有効化",
  "node:test による最小スモークテストを追加",
];

const nextSteps = [
  "HTML プロトタイプを `src/app` 配下へ段階移行する",
  "ゲームロジックをコンポーネントと状態管理へ分割する",
  "E2E テストが必要になった段階で追加する",
];

export default function Home() {
  return (
    <main className="landing">
      <section className="hero">
        <p className="eyebrow">Next.js Project Ready</p>
        <h1>Programming Game の開発基盤を Next.js で作成しました。</h1>
        <p className="lead">
          既存の `HTML/` プロトタイプを残したまま、これ以降の実装を進めるための
          App Router ベースのフロントエンド土台を用意しています。
        </p>
        <div className="actions">
          <a className="primaryAction" href="http://localhost:3000">
            npm run dev
          </a>
          <span className="hint">開発サーバー起動後にブラウザで確認</span>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <h2>初期構成</h2>
          <ul>
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card accent">
          <h2>次の作業候補</h2>
          <ul>
            {nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
