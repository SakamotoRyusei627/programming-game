import test from "node:test";
import assert from "node:assert/strict";

import {
  createSoccer3DState,
  moveAim,
  adjustPower,
  shootBall,
  stepSoccer3D,
} from "../src/features/games/soccer-3d/lib/soccer-3d.ts";

test("狙い位置はゴール幅の範囲内でクランプされる", () => {
  const state = createSoccer3DState();
  const moved = moveAim(state, 999);

  assert.equal(moved.aimX, 26);
});

test("キック力は下限を下回らない", () => {
  const state = createSoccer3DState();
  const adjusted = adjustPower(state, -999);

  assert.equal(adjusted.power, 45);
});

test("十分なパワーでゴール中央へ蹴ると得点になる", () => {
  let state = createSoccer3DState({ goalieBaseX: 18, goalieSpeed: 0 });
  state = shootBall(state);

  for (let index = 0; index < 6; index += 1) {
    state = stepSoccer3D(state);
  }

  assert.equal(state.phase, "goal");
  assert.equal(state.score, 1);
});

test("ゴール枠を外すとミスになる", () => {
  let state = createSoccer3DState({ aimX: 26, goalieBaseX: -20, goalieSpeed: 0 });
  state = shootBall(state);

  for (let index = 0; index < 6; index += 1) {
    state = stepSoccer3D(state);
  }

  assert.equal(state.phase, "miss");
  assert.match(state.message, /枠を外れました/);
});

test("ゴール中央でもキーパー正面ならセーブされる", () => {
  let state = createSoccer3DState({ goalieBaseX: 0, goalieSpeed: 0 });
  state = shootBall(state);

  for (let index = 0; index < 6; index += 1) {
    state = stepSoccer3D(state);
  }

  assert.equal(state.phase, "saved");
  assert.match(state.message, /止められました/);
});
