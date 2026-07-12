import { Soccer3DGame } from "@/features/games/soccer-3d/components/soccer-3d-game";
import type { GameEntry } from "@/features/games/types";

export const soccer3DGame: GameEntry = {
  id: "soccer-3d",
  title: "3Dサッカーシュート",
  description: "立体ピッチでコースとパワーを調整し、ゴールキーパーの逆を突くゲームです。",
  summary: "3D 風の視点で、左右の狙いとキック力を素早く読み切る短時間チャレンジ。",
  href: "/games/soccer-3d",
  difficulty: "normal",
  playTime: "2-4分",
  component: Soccer3DGame,
};
