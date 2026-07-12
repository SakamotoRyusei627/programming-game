"use client";

import { useEffect, useRef, useState } from "react";

import {
  advanceBlockBreaker,
  blockBreakerField,
  createBlockBreakerState,
  movePaddle,
  resetBlockBreaker,
  restartBlockBreaker,
  setPaddlePosition,
  startBlockBreaker,
  type BlockBreakerState,
} from "@/features/games/block-breaker/lib/block-breaker";

const frameMs = 16;
const paddleKeyboardSpeed = 3.2;

const statusLabel = {
  ready: {
    title: "スタート待ち",
    text: "左右にパドルを動かして、ボールで全部のブロックを壊します。",
  },
  playing: {
    title: "プレイ中",
    text: "落とさないように角度を付けて、上段のブロックから崩してください。",
  },
  won: {
    title: "クリア",
    text: "すべてのブロックを壊しました。もう一度遊べます。",
  },
  lost: {
    title: "ゲームオーバー",
    text: "ボールを落としました。リスタートして再挑戦できます。",
  },
} as const;

function getBoardX(clientX: number, rect: DOMRect) {
  const relativeX = ((clientX - rect.left) / rect.width) * blockBreakerField.width;

  return Math.min(Math.max(relativeX, 0), blockBreakerField.width);
}

export function BlockBreakerGame() {
  const [state, setState] = useState<BlockBreakerState>(() => createBlockBreakerState());
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const shellRef = useRef<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const pressedKeysRef = useRef({ left: false, right: false });
  const speedMultiplierRef = useRef(speedMultiplier);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === shellRef.current);
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setState((current) => {
        let nextState = current;

        if (pressedKeysRef.current.left && !pressedKeysRef.current.right) {
          nextState = movePaddle(nextState, -paddleKeyboardSpeed);
        }

        if (pressedKeysRef.current.right && !pressedKeysRef.current.left) {
          nextState = movePaddle(nextState, paddleKeyboardSpeed);
        }

        if (nextState.status === "playing") {
          return advanceBlockBreaker(nextState, speedMultiplierRef.current);
        }

        return nextState;
      });
    }, frameMs);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isSpaceKey = event.key === " " || event.code === "Space";
      const isEnterKey = event.key === "Enter";
      const isEscapeKey = event.key === "Escape";

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        pressedKeysRef.current.left = true;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        pressedKeysRef.current.right = true;
      }

      if (isSpaceKey || isEnterKey) {
        event.preventDefault();
        setState(restartBlockBreaker());
      }

      if (isEscapeKey && isSettingsOpen) {
        event.preventDefault();
        setIsSettingsOpen(false);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        pressedKeysRef.current.left = false;
      }

      if (event.key === "ArrowRight") {
        pressedKeysRef.current.right = false;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isSettingsOpen]);

  const aliveCount = state.blocks.filter((block) => block.alive).length;
  const message = statusLabel[state.status];

  function handlePointerMove(clientX: number) {
    const board = boardRef.current;

    if (!board) {
      return;
    }

    const rect = board.getBoundingClientRect();
    const paddleX = getBoardX(clientX, rect);

    setState((current) => setPaddlePosition(current, paddleX));
  }

  async function toggleFullscreen() {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    if (document.fullscreenElement === shell) {
      await document.exitFullscreen();
      return;
    }

    await shell.requestFullscreen();
  }

  return (
    <section
      ref={shellRef}
      className={`block-breaker-shell${isFullscreen ? " block-breaker-shell--fullscreen" : ""}`}
    >
      <div className="block-breaker-board-card">
        <div className="block-breaker-header">
          <div className="block-breaker-stat">
            <span>Score</span>
            <strong>{state.score}</strong>
          </div>
          <div className="block-breaker-stat">
            <span>Blocks</span>
            <strong>{aliveCount}</strong>
          </div>
          <div className="block-breaker-stat">
            <span>Control</span>
            <strong>{isFullscreen ? "← → / Space" : "← → / Drag"}</strong>
          </div>
          <div className="block-breaker-stat">
            <span>Power</span>
            <strong>Bar {state.paddleWidth.toFixed(0)} / Lv {state.ballPowerLevel}</strong>
          </div>
        </div>

        <div
          ref={boardRef}
          className="block-breaker-board"
          onMouseMove={(event) => handlePointerMove(event.clientX)}
          onTouchMove={(event) => handlePointerMove(event.touches[0].clientX)}
        >
          <div className="block-breaker-board__glow" />

          {state.blocks.filter((block) => block.alive).map((block) => (
            <div
              key={block.id}
              className="block-breaker-block"
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.width}%`,
                height: `${block.height}%`,
              }}
            />
          ))}

          {state.items.map((item) => (
            <div
              key={`${item.type}-${item.id}-${item.y.toFixed(2)}`}
              className={`block-breaker-item block-breaker-item--${item.type}`}
              style={{
                left: `${item.x - blockBreakerField.itemSize / 2}%`,
                top: `${item.y - blockBreakerField.itemSize / 2}%`,
                width: `${blockBreakerField.itemSize}%`,
                height: `${blockBreakerField.itemSize}%`,
              }}
            >
              {item.type === "wide" ? "W" : "P"}
            </div>
          ))}

          <div
            className="block-breaker-paddle"
            style={{
              left: `${state.paddleX - state.paddleWidth / 2}%`,
              top: `${blockBreakerField.paddleY}%`,
              width: `${state.paddleWidth}%`,
              height: `${blockBreakerField.paddleHeight}%`,
            }}
          />

          <div
            className="block-breaker-ball"
            style={{
              left: `${state.ball.x - blockBreakerField.ballRadius}%`,
              top: `${state.ball.y - blockBreakerField.ballRadius}%`,
              width: `${blockBreakerField.ballRadius * 2}%`,
              height: `${blockBreakerField.ballRadius * 2}%`,
            }}
          />
        </div>
      </div>

      {!isFullscreen ? (
        <aside className="block-breaker-side">
          <div className="block-breaker-message-card">
            <p className="block-breaker-message-card__eyebrow">Block Breaker</p>
            <h2>{message.title}</h2>
            <p>{message.text}</p>
          </div>
        </aside>
      ) : null}

      <div className="block-breaker-floating-actions">
        <div className="block-breaker-actions">
          <button
            className="block-breaker-primary"
            type="button"
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? "全画面を終了" : "全画面で遊ぶ"}
          </button>
          <button
            className="block-breaker-secondary"
            type="button"
            onClick={() => setState((current) => startBlockBreaker(current))}
          >
            {state.status === "playing" ? "プレイ中" : "スタート"}
          </button>
          <button
            className="block-breaker-secondary"
            type="button"
            onClick={() => setState(resetBlockBreaker())}
          >
            リセット
          </button>
          {!isFullscreen ? (
            <button
              className="block-breaker-secondary"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
            >
              設定
            </button>
          ) : null}
          <button
            className="block-breaker-secondary"
            type="button"
            onClick={() => setState((current) => movePaddle(current, -10))}
          >
            左へ
          </button>
          <button
            className="block-breaker-secondary"
            type="button"
            onClick={() => setState((current) => movePaddle(current, 10))}
          >
            右へ
          </button>
        </div>
      </div>

      {!isFullscreen && isSettingsOpen ? (
        <div
          className="block-breaker-settings-backdrop"
          role="presentation"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="block-breaker-settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="ゲーム設定"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="block-breaker-settings-head">
              <div>
                <p className="block-breaker-message-card__eyebrow">Settings</p>
                <h2>ゲーム設定</h2>
              </div>
              <button
                className="block-breaker-secondary"
                type="button"
                onClick={() => setIsSettingsOpen(false)}
              >
                閉じる
              </button>
            </div>

            <div className="block-breaker-panel">
              <h3>遊び方</h3>
              <ul>
                <li>パドルを左右に動かしてボールを落とさないようにします。</li>
                <li>中央で受けるとまっすぐ、端で受けると斜めに返せます。</li>
                <li>全ブロック破壊でクリアです。</li>
                <li>ブロックを壊すとアイテムが落ち、取ると強化されます。</li>
              </ul>
            </div>

            <div className="block-breaker-panel">
              <h3>アイテム</h3>
              <ul>
                <li>W を取るとパドル幅が広がります。</li>
                <li>P を取るとボール速度が強化されます。</li>
              </ul>
            </div>

            <div className="block-breaker-panel">
              <div className="block-breaker-speed-head">
                <h3>ボール速度</h3>
                <strong>{speedMultiplier.toFixed(1)}x</strong>
              </div>
              <label className="block-breaker-speed-control">
                <span>遅い</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={speedMultiplier}
                  onChange={(event) => setSpeedMultiplier(Number(event.target.value))}
                />
                <span>速い</span>
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
