import Link from "next/link";

import { gameCatalog } from "@/features/games/catalog";

const difficultyLabel = {
  easy: "初級",
  normal: "中級",
  hard: "上級",
};

export default function Home() {
  return (
    <main className="games-home">
      <section className="games-hero">
        <div>
          <p className="games-hero__eyebrow">Programming Game Box</p>
          <h1>ゲームを選んで遊べるトップページ</h1>
          <p className="games-hero__text">
            トップページから各ゲームへ遷移できるようにし、追加実装はゲーム単位で分けられる構成にします。
          </p>
        </div>
        <div className="games-hero__note">
          <strong>追加先はゲーム単位</strong>
          <p>
            新しいゲームは `src/features/games/&lt;game-id&gt;` に閉じ込め、一覧登録だけで公開できる形です。
          </p>
        </div>
      </section>

      <section className="game-grid" aria-label="ゲーム一覧">
        {gameCatalog.map((game) => (
          <article className="game-link-card" key={game.id}>
            <div className="game-link-card__meta">
              <span>{difficultyLabel[game.difficulty]}</span>
              <span>{game.playTime}</span>
            </div>
            <div className="game-link-card__body">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <p className="game-link-card__summary">{game.summary}</p>
            </div>
            <Link className="game-link-card__action" href={game.href}>
              このゲームで遊ぶ
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
