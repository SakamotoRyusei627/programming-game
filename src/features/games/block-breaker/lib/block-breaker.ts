export const blockBreakerField = {
  width: 100,
  height: 100,
  paddleWidth: 18,
  maxPaddleWidth: 30,
  paddleHeight: 3,
  paddleY: 92,
  ballRadius: 2,
  itemSize: 5,
} as const;

const blockLayout = {
  rows: 4,
  columns: 7,
  blockWidth: 11,
  blockHeight: 6,
  gap: 2,
  startX: 6,
  startY: 12,
} as const;

export type Block = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
};

export type ItemType = "wide" | "power";

export type FallingItem = {
  id: number;
  type: ItemType;
  x: number;
  y: number;
  vy: number;
};

export type BlockBreakerState = {
  status: "ready" | "playing" | "won" | "lost";
  score: number;
  lives: number;
  paddleX: number;
  paddleWidth: number;
  ballPowerLevel: number;
  ball: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
  blocks: Block[];
  items: FallingItem[];
};

function createBlocks(): Block[] {
  return Array.from({ length: blockLayout.rows * blockLayout.columns }, (_, index) => {
    const row = Math.floor(index / blockLayout.columns);
    const column = index % blockLayout.columns;

    return {
      id: index,
      x: blockLayout.startX + column * (blockLayout.blockWidth + blockLayout.gap),
      y: blockLayout.startY + row * (blockLayout.blockHeight + blockLayout.gap),
      width: blockLayout.blockWidth,
      height: blockLayout.blockHeight,
      alive: true,
    };
  });
}

function clampPaddleX(paddleX: number, paddleWidth: number) {
  const minX = paddleWidth / 2;
  const maxX = blockBreakerField.width - paddleWidth / 2;

  return Math.min(Math.max(paddleX, minX), maxX);
}

function createItemFromBlock(block: Block): FallingItem {
  return {
    id: block.id,
    type: block.id % 2 === 0 ? "wide" : "power",
    x: block.x + block.width / 2,
    y: block.y + block.height / 2,
    vy: 1.2,
  };
}

function shouldSpawnItem(randomValue: number) {
  return randomValue < 0.05;
}

export function createBlockBreakerState(): BlockBreakerState {
  return {
    status: "ready",
    score: 0,
    lives: 3,
    paddleX: blockBreakerField.width / 2,
    paddleWidth: blockBreakerField.paddleWidth,
    ballPowerLevel: 0,
    ball: {
      x: blockBreakerField.width / 2,
      y: 74,
      vx: 1.0,
      vy: -1.6,
    },
    blocks: createBlocks(),
    items: [],
  };
}

export function movePaddle(state: BlockBreakerState, delta: number): BlockBreakerState {
  return {
    ...state,
    paddleX: clampPaddleX(state.paddleX + delta, state.paddleWidth),
  };
}

export function setPaddlePosition(state: BlockBreakerState, paddleX: number): BlockBreakerState {
  return {
    ...state,
    paddleX: clampPaddleX(paddleX, state.paddleWidth),
  };
}

export function startBlockBreaker(state: BlockBreakerState): BlockBreakerState {
  if (state.status === "playing") {
    return state;
  }

  return {
    ...state,
    status: "playing",
  };
}

export function restartBlockBreaker(): BlockBreakerState {
  return {
    ...createBlockBreakerState(),
    status: "playing",
  };
}

export function resetBlockBreaker(): BlockBreakerState {
  return createBlockBreakerState();
}

function amplifyBall(ball: BlockBreakerState["ball"], ballPowerLevel: number) {
  const powerBoost = 1 + ballPowerLevel * 0.18;

  return {
    ...ball,
    vx: ball.vx * powerBoost,
    vy: ball.vy * powerBoost,
  };
}

export function advanceBlockBreaker(
  state: BlockBreakerState,
  speedMultiplier = 1,
  randomValue = Math.random(),
): BlockBreakerState {
  if (state.status !== "playing") {
    return state;
  }

  const radius = blockBreakerField.ballRadius;
  const scaledSpeed = Math.max(speedMultiplier, 0.1);
  let nextBall = {
    x: state.ball.x + state.ball.vx * scaledSpeed,
    y: state.ball.y + state.ball.vy * scaledSpeed,
    vx: state.ball.vx,
    vy: state.ball.vy,
  };

  if (nextBall.x - radius <= 0 || nextBall.x + radius >= blockBreakerField.width) {
    nextBall = {
      ...nextBall,
      x: Math.min(Math.max(nextBall.x, radius), blockBreakerField.width - radius),
      vx: -nextBall.vx,
    };
  }

  if (nextBall.y - radius <= 0) {
    nextBall = {
      ...nextBall,
      y: radius,
      vy: -nextBall.vy,
    };
  }

  const paddleLeft = state.paddleX - state.paddleWidth / 2;
  const paddleRight = state.paddleX + state.paddleWidth / 2;
  const paddleTop = blockBreakerField.paddleY;

  if (
    nextBall.vy > 0 &&
    state.ball.y + radius <= paddleTop &&
    nextBall.y + radius >= paddleTop &&
    nextBall.x >= paddleLeft - radius &&
    nextBall.x <= paddleRight + radius
  ) {
    const offset = (nextBall.x - state.paddleX) / (state.paddleWidth / 2);
    const powerSpeed = 1.4 + state.ballPowerLevel * 0.18;

    nextBall = {
      ...nextBall,
      y: paddleTop - radius,
      vx: offset * 1.4,
      vy: -Math.max(powerSpeed, Math.abs(nextBall.vy)),
    };
  }

  let score = state.score;
  let paddleWidth = state.paddleWidth;
  let ballPowerLevel = state.ballPowerLevel;
  const blocks = state.blocks.map((block) => ({ ...block }));
  const items = state.items
    .map((item) => ({
      ...item,
      y: item.y + item.vy * scaledSpeed,
    }))
    .filter((item) => item.y - blockBreakerField.itemSize / 2 <= blockBreakerField.height);
  const hitBlock = blocks.find((block) => {
    if (!block.alive) {
      return false;
    }

    return (
      nextBall.x + radius >= block.x &&
      nextBall.x - radius <= block.x + block.width &&
      nextBall.y + radius >= block.y &&
      nextBall.y - radius <= block.y + block.height
    );
  });

  if (hitBlock) {
    hitBlock.alive = false;
    score += 100;
    if (shouldSpawnItem(randomValue)) {
      items.push(createItemFromBlock(hitBlock));
    }

    const cameFromTop = state.ball.y <= hitBlock.y;
    const cameFromBottom = state.ball.y >= hitBlock.y + hitBlock.height;

    nextBall = {
      ...nextBall,
      vy: cameFromTop || cameFromBottom ? -nextBall.vy : nextBall.vy,
      vx: cameFromTop || cameFromBottom ? nextBall.vx : -nextBall.vx,
    };
  }

  const remainingItems: FallingItem[] = [];
  for (const item of items) {
    const isCaught =
      item.y + blockBreakerField.itemSize / 2 >= paddleTop &&
      item.y - blockBreakerField.itemSize / 2 <= paddleTop + blockBreakerField.paddleHeight &&
      item.x >= paddleLeft &&
      item.x <= paddleRight;

    if (!isCaught) {
      remainingItems.push(item);
      continue;
    }

    if (item.type === "wide") {
      paddleWidth = Math.min(paddleWidth + 4, blockBreakerField.maxPaddleWidth);
    }

    if (item.type === "power") {
      ballPowerLevel += 1;
      nextBall = amplifyBall(nextBall, 1);
    }
  }

  if (nextBall.y - radius > blockBreakerField.height) {
    return {
      ...state,
      status: "lost",
      ball: nextBall,
      items: remainingItems,
    };
  }

  const remainingBlocks = blocks.filter((block) => block.alive).length;

  if (remainingBlocks === 0) {
    return {
      ...state,
      status: "won",
      score,
      paddleWidth,
      ballPowerLevel,
      ball: nextBall,
      blocks,
      items: remainingItems,
    };
  }

  return {
    ...state,
    score,
    paddleWidth,
    ballPowerLevel,
    ball: nextBall,
    blocks,
    items: remainingItems,
  };
}
