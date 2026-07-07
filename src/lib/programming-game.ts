export type Player = {
  x: number;
  y: number;
  dir: number;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export type ProgramResult =
  | { status: "success"; stepCount: number; message: string; player: Player }
  | { status: "fail"; failedStep: number | null; message: string; player: Player };

export const stage = {
  number: "01",
  maxCommands: 12,
  size: 6,
  start: { x: 0, y: 4, dir: 1 },
  goal: { x: 5, y: 1 },
  walls: [
    [1, 1],
    [4, 0],
    [4, 4],
    [2, 5],
    [0, 0],
  ],
  path: [
    [0, 4],
    [1, 4],
    [2, 4],
    [2, 3],
    [3, 3],
    [4, 3],
    [4, 2],
    [5, 2],
    [5, 1],
    [1, 3],
    [3, 2],
  ],
};

export const commands = {
  forward: {
    id: "forward",
    icon: "↑",
    label: "まえにすすむ",
    help: "向いている方向へ1マス",
    color: "linear-gradient(180deg, #55b8ff, #2b8ae7)",
  },
  back: {
    id: "back",
    icon: "↓",
    label: "うしろにすすむ",
    help: "後ろへ1マスさがる",
    color: "linear-gradient(180deg, #79d268, #47b53f)",
  },
  left: {
    id: "left",
    icon: "↺",
    label: "ひだりにまわる",
    help: "左へ90度回転",
    color: "linear-gradient(180deg, #b47fff, #8f5adf)",
  },
  right: {
    id: "right",
    icon: "↻",
    label: "みぎにまわる",
    help: "右へ90度回転",
    color: "linear-gradient(180deg, #ffcc66, #f2a21f)",
  },
};

export const paletteCommands = Object.values(commands);

export const directionVectors = [
  { x: 0, y: -1, name: "上 ↑", face: "↑" },
  { x: 1, y: 0, name: "右 →", face: "→" },
  { x: 0, y: 1, name: "下 ↓", face: "↓" },
  { x: -1, y: 0, name: "左 ←", face: "←" },
];

export const characterRotationByDir = {
  0: "180deg",
  1: "-90deg",
  2: "0deg",
  3: "90deg",
};

export function getInitialPlayer() {
  return structuredClone(stage.start);
}

export function isSameCell(cell: { x: number; y: number }, x: number, y: number) {
  return cell.x === x && cell.y === y;
}

export function getTileClassName(x: number, y: number) {
  if (isSameCell(stage.goal, x, y)) return "tile--goal tile--path";
  if (isSameCell(stage.start, x, y)) return "tile--start tile--path";
  if (stage.walls.some(([wallX, wallY]) => wallX === x && wallY === y)) return "tile--wall";
  if (stage.path.some(([pathX, pathY]) => pathX === x && pathY === y)) return "tile--path";
  return "tile--grass";
}

export function validatePlayerPosition(player: Player): ValidationResult {
  if (player.x < 0 || player.x >= stage.size || player.y < 0 || player.y >= stage.size) {
    return { ok: false, reason: "ボードの外に出ました" };
  }

  if (stage.walls.some(([wallX, wallY]) => wallX === player.x && wallY === player.y)) {
    return { ok: false, reason: "岩にぶつかりました" };
  }

  return { ok: true };
}

export function executeCommand(player: Player, commandId: string): Player {
  const nextPlayer = { ...player };

  if (commandId === "left") {
    nextPlayer.dir = (nextPlayer.dir + 3) % 4;
    return nextPlayer;
  }

  if (commandId === "right") {
    nextPlayer.dir = (nextPlayer.dir + 1) % 4;
    return nextPlayer;
  }

  const forward = directionVectors[nextPlayer.dir];
  const direction = commandId === "forward" ? 1 : -1;

  nextPlayer.x += forward.x * direction;
  nextPlayer.y += forward.y * direction;

  return nextPlayer;
}

export function getHintMessage() {
  return "ヒント: 右を向いた状態で始まります。途中で上向きに変える必要があります。";
}

export function runProgram(queue: string[]): ProgramResult {
  let player = getInitialPlayer();

  for (let index = 0; index < queue.length; index += 1) {
    player = executeCommand(player, queue[index]);

    const status = validatePlayerPosition(player);
    if (!status.ok) {
      return {
        status: "fail",
        failedStep: index + 1,
        message: `${index + 1}手目で ${status.reason}`,
        player,
      };
    }

    if (isSameCell(stage.goal, player.x, player.y)) {
      return {
        status: "success",
        stepCount: index + 1,
        message: `${index + 1}手でゴールしました。コマンドの組み方を変えて短くする遊び方もできます。`,
        player,
      };
    }
  }

  return {
    status: "fail",
    failedStep: null,
    message: "ゴールに届きませんでした。向きと進む回数を見直してください。",
    player,
  };
}
