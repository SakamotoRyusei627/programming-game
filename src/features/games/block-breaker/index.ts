import { BlockBreakerGame } from "@/features/games/block-breaker/components/block-breaker-game";
import type { GameEntry } from "@/features/games/types";

export const blockBreakerGame: GameEntry = {
  id: "block-breaker",
  title: "ブロック崩し",
  description: "パドルでボールを返しながら、壁のブロックを全部壊すアクションゲームです。",
  summary: "マウスや矢印キーで素早く操作できる、短時間向けの1プレイ。",
  href: "/games/block-breaker",
  difficulty: "normal",
  playTime: "2-4分",
  component: BlockBreakerGame,
};
