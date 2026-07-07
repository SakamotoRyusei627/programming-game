import test from "node:test";
import assert from "node:assert/strict";

import {
  stage,
  getInitialPlayer,
  runProgram,
  validatePlayerPosition,
} from "../src/lib/programming-game.ts";

test("最短ではないがゴールできるコマンド列を成功として判定する", () => {
  const result = runProgram([
    "forward",
    "forward",
    "left",
    "forward",
    "right",
    "forward",
    "forward",
    "forward",
    "left",
    "forward",
    "forward",
  ]);

  assert.equal(result.status, "success");
  assert.equal(result.stepCount, 11);
  assert.deepEqual(result.player, { x: stage.goal.x, y: stage.goal.y, dir: 0 });
});

test("岩にぶつかった場合は失敗理由を返す", () => {
  const result = runProgram(["left", "forward", "forward", "forward", "forward"]);

  assert.equal(result.status, "fail");
  assert.match(result.message, /岩にぶつかりました/);
  assert.equal(result.failedStep, 5);
});

test("初期位置は有効で、盤外は無効として判定する", () => {
  const initialPlayer = getInitialPlayer();

  assert.deepEqual(validatePlayerPosition(initialPlayer), { ok: true });
  assert.deepEqual(validatePlayerPosition({ x: -1, y: 4, dir: 1 }), {
    ok: false,
    reason: "ボードの外に出ました",
  });
});
