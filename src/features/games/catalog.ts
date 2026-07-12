import { programmingBasicsGame } from "@/features/games/programming-basics";

export const gameCatalog = [programmingBasicsGame];

export function getGameById(gameId: string) {
  return gameCatalog.find((game) => game.id === gameId);
}
