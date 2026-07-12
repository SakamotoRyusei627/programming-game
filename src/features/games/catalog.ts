import { programmingBasicsGame } from "@/features/games/programming-basics";
import { soccer3DGame } from "@/features/games/soccer-3d";

export const gameCatalog = [programmingBasicsGame, soccer3DGame];

export function getGameById(gameId: string) {
  return gameCatalog.find((game) => game.id === gameId);
}
