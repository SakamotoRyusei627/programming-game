import Link from "next/link";
import { notFound } from "next/navigation";

import { gameCatalog, getGameById } from "@/features/games/catalog";

export function generateStaticParams() {
  return gameCatalog.map((game) => ({ gameId: game.id }));
}

type GamePageProps = {
  params: Promise<{ gameId: string }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  const GameComponent = game.component;

  return (
    <div className="game-route-layout">
      <header className="game-route-header">
        <Link className="route-back-link" href="/">
          ゲーム一覧へ戻る
        </Link>
        <div className="route-meta-card">
          <span className="route-kicker">Game Select</span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </div>
      </header>
      <GameComponent />
    </div>
  );
}
