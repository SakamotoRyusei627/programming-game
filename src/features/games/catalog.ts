import { blockBreakerGame } from "@/features/games/block-breaker";
import { programmingBasicsGame } from "@/features/games/programming-basics";

export const gameCatalog = [programmingBasicsGame, blockBreakerGame];

export function getGameById(gameId: string) {
  return gameCatalog.find((game) => game.id === gameId);
}
