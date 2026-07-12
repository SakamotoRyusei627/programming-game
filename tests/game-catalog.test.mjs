import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("ゲームカタログはトップページ表示用の情報を持つ", () => {
  const file = fs.readFileSync("src/features/games/catalog.ts", "utf8");

  assert.match(file, /programmingBasicsGame/);
  assert.match(file, /blockBreakerGame/);
  assert.match(file, /getGameById/);

  const gameFile = fs.readFileSync("src/features/games/programming-basics/index.ts", "utf8");

  assert.match(gameFile, /id: "programming-basics"/);
  assert.match(gameFile, /href: "\/games\/programming-basics"/);
  assert.match(gameFile, /プログラミング迷路/);

  const blockBreakerFile = fs.readFileSync("src/features/games/block-breaker/index.ts", "utf8");

  assert.match(blockBreakerFile, /id: "block-breaker"/);
  assert.match(blockBreakerFile, /href: "\/games\/block-breaker"/);
  assert.match(blockBreakerFile, /ブロック崩し/);
});
