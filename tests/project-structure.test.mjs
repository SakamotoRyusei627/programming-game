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
    "src/app/globals.css",
    "src/components/programming-game.tsx",
    "src/lib/programming-game.ts",
    "public/game/character-front-smile.png",
    "public/game/character-top.png",
    "public/game/stone.png",
  ];

  for (const file of requiredFiles) {
    assert.equal(fs.existsSync(file), true, `${file} が見つかりません`);
  }
});
