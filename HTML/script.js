const stage = {
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

const commands = {
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

const directionVectors = [
  { x: 0, y: -1, name: "上 ↑", face: "↑" },
  { x: 1, y: 0, name: "右 →", face: "→" },
  { x: 0, y: 1, name: "下 ↓", face: "↓" },
  { x: -1, y: 0, name: "左 ←", face: "←" },
];

const characterRotationByDir = {
  0: "180deg",
  1: "-90deg",
  2: "0deg",
  3: "90deg",
};

const state = {
  queue: [],
  player: structuredClone(stage.start),
  locked: false,
};

const boardEl = document.getElementById("board");
const commandPaletteEl = document.getElementById("commandPalette");
const commandListEl = document.getElementById("commandList");
const commandCountEl = document.getElementById("commandCount");
const resultPanelEl = document.getElementById("resultPanel");
const facingLabelEl = document.getElementById("facingLabel");
const stageNumberEl = document.getElementById("stageNumber");
const runButtonEl = document.getElementById("runButton");
const clearButtonEl = document.getElementById("clearButton");
const resetButtonEl = document.getElementById("resetButton");
const hintButtonEl = document.getElementById("hintButton");

let dragIndex = null;

function init() {
  stageNumberEl.textContent = stage.number;
  renderPalette();
  resetPlayer();
  renderBoard();
  renderQueue();
  bindEvents();
}

function bindEvents() {
  runButtonEl.addEventListener("click", runProgram);
  clearButtonEl.addEventListener("click", () => {
    state.queue = [];
    setIdleResult();
    renderQueue();
  });
  resetButtonEl.addEventListener("click", () => {
    state.queue = [];
    resetPlayer();
    setIdleResult();
    renderBoard();
    renderQueue();
  });
  hintButtonEl.addEventListener("click", showHint);
}

function renderPalette() {
  const template = document.getElementById("paletteButtonTemplate");
  Object.values(commands).forEach((command) => {
    const button = template.content.firstElementChild.cloneNode(true);
    button.style.background = command.color;
    button.innerHTML = `
      <span class="palette-button__icon">${command.icon}</span>
      <span class="palette-button__label">${command.label}</span>
      <span class="palette-button__text">${command.help}</span>
    `;
    button.addEventListener("click", () => addCommand(command.id));
    commandPaletteEl.appendChild(button);
  });
}

function addCommand(commandId) {
  if (state.locked || state.queue.length >= stage.maxCommands) return;
  state.queue.push(commandId);
  renderQueue();
}

function renderQueue() {
  commandListEl.innerHTML = "";
  commandCountEl.textContent = `${state.queue.length} / ${stage.maxCommands}`;

  state.queue.forEach((commandId, index) => {
    const command = commands[commandId];
    const item = document.getElementById("commandItemTemplate").content.firstElementChild.cloneNode(true);
    const iconEl = item.querySelector(".command-item__icon");

    item.dataset.index = String(index);
    item.querySelector(".command-item__index").textContent = String(index + 1);
    iconEl.textContent = command.icon;
    iconEl.style.background = command.color;
    item.querySelector(".command-item__label").textContent = command.label;
    item.querySelector(".command-item__delete").addEventListener("click", () => {
      state.queue.splice(index, 1);
      renderQueue();
    });

    item.addEventListener("dragstart", () => {
      dragIndex = index;
      item.classList.add("command-item--dragging");
    });
    item.addEventListener("dragend", () => {
      dragIndex = null;
      item.classList.remove("command-item--dragging");
    });
    item.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      const [moved] = state.queue.splice(dragIndex, 1);
      state.queue.splice(index, 0, moved);
      renderQueue();
    });

    commandListEl.appendChild(item);
  });
}

function resetPlayer() {
  state.player = structuredClone(stage.start);
  updateFacingLabel();
}

function renderBoard(activePosition) {
  boardEl.innerHTML = "";
  for (let y = 0; y < stage.size; y += 1) {
    for (let x = 0; x < stage.size; x += 1) {
      const tile = document.createElement("div");
      tile.className = `tile ${getTileClass(x, y)}`;
      const isWall = stage.walls.some(([wx, wy]) => wx === x && wy === y);

      if (activePosition && activePosition.x === x && activePosition.y === y) {
        tile.classList.add("tile--active");
      }

      if (isWall) {
        const obstacle = document.createElement("div");
        obstacle.className = "obstacle-rock";
        obstacle.setAttribute("aria-hidden", "true");
        tile.appendChild(obstacle);
      }

      if (state.player.x === x && state.player.y === y) {
        const character = document.createElement("div");
        character.className = "character";
        character.style.setProperty("--character-rotation", characterRotationByDir[state.player.dir]);
        tile.appendChild(character);
      }

      boardEl.appendChild(tile);
    }
  }
}

function getTileClass(x, y) {
  if (isSameCell(stage.goal, x, y)) return "tile--goal tile--path";
  if (isSameCell(stage.start, x, y)) return "tile--start tile--path";
  if (stage.walls.some(([wx, wy]) => wx === x && wy === y)) return "tile--wall";
  if (stage.path.some(([px, py]) => px === x && py === y)) return "tile--path";
  return "tile--grass";
}

function isSameCell(cell, x, y) {
  return cell.x === x && cell.y === y;
}

function updateFacingLabel() {
  facingLabelEl.textContent = `向き: ${directionVectors[state.player.dir].name}`;
}

function setIdleResult() {
  resultPanelEl.className = "result-panel result-panel--idle";
  resultPanelEl.innerHTML = `
    <div class="result-emoji">🤖</div>
    <p class="result-title">準備中</p>
    <p class="result-text">コマンドを作って「実行」を押してください。</p>
  `;
}

function setSuccessResult(stepCount) {
  resultPanelEl.className = "result-panel result-panel--success";
  resultPanelEl.innerHTML = `
    <div class="result-emoji">🎉</div>
    <p class="result-title">成功！</p>
    <p class="result-text">${stepCount}手でゴールしました。コマンドの組み方を変えて短くする遊び方もできます。</p>
  `;
}

function setFailResult(message) {
  resultPanelEl.className = "result-panel result-panel--fail";
  resultPanelEl.innerHTML = `
    <div class="result-emoji">⚠️</div>
    <p class="result-title">失敗...</p>
    <p class="result-text">${message}</p>
  `;
}

function showHint() {
  setFailResult("ヒント: 右を向いた状態で始まります。途中で上向きに変える必要があります。");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runProgram() {
  if (state.locked || state.queue.length === 0) return;

  state.locked = true;
  runButtonEl.disabled = true;
  resetPlayer();
  renderBoard();

  for (let index = 0; index < state.queue.length; index += 1) {
    const commandId = state.queue[index];
    executeCommand(commandId);
    updateFacingLabel();
    renderBoard({ x: state.player.x, y: state.player.y });
    await sleep(520);

    const status = validatePlayerPosition();
    if (!status.ok) {
      setFailResult(`${index + 1}手目で ${status.reason}`);
      finishRun();
      return;
    }

    if (isSameCell(stage.goal, state.player.x, state.player.y)) {
      setSuccessResult(index + 1);
      finishRun();
      return;
    }
  }

  setFailResult("ゴールに届きませんでした。向きと進む回数を見直してください。");
  finishRun();
}

function finishRun() {
  state.locked = false;
  runButtonEl.disabled = false;
  renderBoard();
}

function executeCommand(commandId) {
  if (commandId === "left") {
    state.player.dir = (state.player.dir + 3) % 4;
    return;
  }
  if (commandId === "right") {
    state.player.dir = (state.player.dir + 1) % 4;
    return;
  }

  const forward = directionVectors[state.player.dir];
  const direction = commandId === "forward" ? 1 : -1;

  state.player.x += forward.x * direction;
  state.player.y += forward.y * direction;
}

function validatePlayerPosition() {
  if (
    state.player.x < 0 ||
    state.player.x >= stage.size ||
    state.player.y < 0 ||
    state.player.y >= stage.size
  ) {
    return { ok: false, reason: "ボードの外に出ました" };
  }

  if (stage.walls.some(([wx, wy]) => wx === state.player.x && wy === state.player.y)) {
    return { ok: false, reason: "岩にぶつかりました" };
  }

  return { ok: true };
}

init();
