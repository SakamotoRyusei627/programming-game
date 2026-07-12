import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("ゲームカタログはトップページ表示用の情報を持つ", () => {
  const file = fs.readFileSync("src/features/games/catalog.ts", "utf8");

  assert.match(file, /programmingBasicsGame/);
  assert.match(file, /getGameById/);

  const gameFile = fs.readFileSync("src/features/games/programming-basics/index.ts", "utf8");

  assert.match(gameFile, /id: "programming-basics"/);
  assert.match(gameFile, /href: "\/games\/programming-basics"/);
  assert.match(gameFile, /プログラミング迷路/);
});
