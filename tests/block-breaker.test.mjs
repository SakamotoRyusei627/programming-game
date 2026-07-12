import test from "node:test";
import assert from "node:assert/strict";

import {
  advanceBlockBreaker,
  createBlockBreakerState,
  restartBlockBreaker,
} from "../src/features/games/block-breaker/lib/block-breaker.ts";

test("ボールがブロックに当たるとブロックが消えて得点が増える", () => {
  const initialState = createBlockBreakerState();
  const targetBlock = initialState.blocks[0];

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    ball: {
      x: targetBlock.x + targetBlock.width / 2,
      y: targetBlock.y + targetBlock.height + 3,
      vx: 0,
      vy: -3,
    },
  }, 1, 0.01);

  assert.equal(result.blocks[0].alive, false);
  assert.equal(result.score, 100);
  assert.equal(result.ball.vy > 0, true);
  assert.equal(result.items.length, 1);
});

test("アイテムは5パーセント抽選に外れると出現しない", () => {
  const initialState = createBlockBreakerState();
  const targetBlock = initialState.blocks[0];

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    ball: {
      x: targetBlock.x + targetBlock.width / 2,
      y: targetBlock.y + targetBlock.height + 3,
      vx: 0,
      vy: -3,
    },
  }, 1, 0.5);

  assert.equal(result.blocks[0].alive, false);
  assert.equal(result.items.length, 0);
});

test("ボールがパドルに当たると跳ね返ってゲーム継続になる", () => {
  const initialState = createBlockBreakerState();

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    ball: {
      x: initialState.paddleX,
      y: 88,
      vx: 0,
      vy: 3,
    },
  });

  assert.equal(result.status, "playing");
  assert.equal(result.ball.vy < 0, true);
});

test("最後のブロックを壊すとクリアになる", () => {
  const initialState = createBlockBreakerState();
  const targetBlock = initialState.blocks[0];
  const blocks = initialState.blocks.map((block, index) => ({
    ...block,
    alive: index === 0,
  }));

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    blocks,
    ball: {
      x: targetBlock.x + targetBlock.width / 2,
      y: targetBlock.y + targetBlock.height + 3,
      vx: 0,
      vy: -3,
    },
  });

  assert.equal(result.status, "won");
  assert.equal(result.score, 100);
});

test("速度倍率を上げると1フレームでより遠くまで進む", () => {
  const initialState = {
    ...createBlockBreakerState(),
    status: "playing",
  };

  const normalSpeed = advanceBlockBreaker(initialState, 1);
  const highSpeed = advanceBlockBreaker(initialState, 2);

  assert.equal(normalSpeed.ball.y < initialState.ball.y, true);
  assert.equal(highSpeed.ball.y < normalSpeed.ball.y, true);
});

test("落ちてきた拡張アイテムを取るとバー幅が広がる", () => {
  const initialState = createBlockBreakerState();

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    items: [
      {
        id: 1,
        type: "wide",
        x: initialState.paddleX,
        y: 90,
        vy: 2,
      },
    ],
  });

  assert.equal(result.items.length, 0);
  assert.equal(result.paddleWidth > initialState.paddleWidth, true);
});

test("落ちてきた強化アイテムを取るとボール威力が上がる", () => {
  const initialState = createBlockBreakerState();

  const result = advanceBlockBreaker({
    ...initialState,
    status: "playing",
    items: [
      {
        id: 2,
        type: "power",
        x: initialState.paddleX,
        y: 90,
        vy: 2,
      },
    ],
  });

  assert.equal(result.items.length, 0);
  assert.equal(result.ballPowerLevel, initialState.ballPowerLevel + 1);
});

test("リスタートは初期状態に戻してすぐプレイ開始する", () => {
  const restarted = restartBlockBreaker();
  const initialState = createBlockBreakerState();

  assert.equal(restarted.status, "playing");
  assert.equal(restarted.score, 0);
  assert.equal(restarted.paddleX, initialState.paddleX);
  assert.equal(restarted.paddleWidth, initialState.paddleWidth);
  assert.equal(restarted.ballPowerLevel, initialState.ballPowerLevel);
  assert.deepEqual(restarted.ball, initialState.ball);
  assert.equal(
    restarted.blocks.every((block) => block.alive),
    true,
  );
});
