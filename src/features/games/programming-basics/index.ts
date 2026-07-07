import { ProgrammingBasicsGame } from "@/features/games/programming-basics/components/programming-basics-game";
import type { GameEntry } from "@/features/games/types";

export const programmingBasicsGame: GameEntry = {
  id: "programming-basics",
  title: "プログラミング迷路",
  description: "コマンドを並べてキャラクターをゴールまで導く、導入向けゲームです。",
  summary: "命令の順序と向きの変化を試しながら遊べる最初の1本。",
  href: "/games/programming-basics",
  difficulty: "easy",
  playTime: "3-5分",
  component: ProgrammingBasicsGame,
};
