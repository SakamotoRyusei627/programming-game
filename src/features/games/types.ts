import type { ComponentType } from "react";

export type GameEntry = {
  id: string;
  title: string;
  description: string;
  summary: string;
  href: string;
  difficulty: "easy" | "normal" | "hard";
  playTime: string;
  component: ComponentType;
};
