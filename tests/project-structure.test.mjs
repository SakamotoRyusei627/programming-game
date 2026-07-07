import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Next.js の主要ファイルが存在する", () => {
  const requiredFiles = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/games/[gameId]/page.tsx",
    "src/app/globals.css",
    "src/features/games/catalog.ts",
    "src/features/games/types.ts",
    "src/features/games/programming-basics/index.ts",
    "src/features/games/programming-basics/components/programming-basics-game.tsx",
    "src/features/games/programming-basics/lib/programming-basics.ts",
    "public/game/character-front-smile.png",
    "public/game/character-top.png",
    "public/game/stone.png",
  ];

  for (const file of requiredFiles) {
    assert.equal(fs.existsSync(file), true, `${file} が見つかりません`);
  }
});
