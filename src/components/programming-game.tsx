"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

import {
  characterRotationByDir,
  commands,
  directionVectors,
  executeCommand,
  getHintMessage,
  getInitialPlayer,
  getTileClassName,
  isSameCell,
  paletteCommands,
  stage,
  validatePlayerPosition,
} from "@/lib/programming-game";

type ResultState = {
  tone: "idle" | "success" | "fail";
  emoji: string;
  title: string;
  text: string;
};

const idleResult: ResultState = {
  tone: "idle",
  emoji: "🤖",
  title: "準備中",
  text: "コマンドを作って「実行」を押してください。",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function ProgrammingGame() {
  const [queue, setQueue] = useState<string[]>([]);
  const [player, setPlayer] = useState(getInitialPlayer);
  const [locked, setLocked] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activePosition, setActivePosition] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<ResultState>(idleResult);

  const facingLabel = `向き: ${directionVectors[player.dir].name}`;

  function addCommand(commandId: string) {
    if (locked || queue.length >= stage.maxCommands) return;
    setQueue((current) => [...current, commandId]);
  }

  function deleteCommand(index: number) {
    if (locked) return;
    setQueue((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function clearCommands() {
    if (locked) return;
    setQueue([]);
    setResult(idleResult);
  }

  function resetAll() {
    if (locked) return;
    setQueue([]);
    setPlayer(getInitialPlayer());
    setActivePosition(null);
    setResult(idleResult);
  }

  function showHint() {
    setResult({
      tone: "fail",
      emoji: "💡",
      title: "ヒント",
      text: getHintMessage(),
    });
  }

  async function runQueue() {
    if (locked || queue.length === 0) return;

    const currentQueue = [...queue];
    let currentPlayer = getInitialPlayer();

    setLocked(true);
    setPlayer(currentPlayer);
    setActivePosition({ x: currentPlayer.x, y: currentPlayer.y });

    for (let index = 0; index < currentQueue.length; index += 1) {
      currentPlayer = executeCommand(currentPlayer, currentQueue[index]);
      setPlayer(currentPlayer);
      setActivePosition({ x: currentPlayer.x, y: currentPlayer.y });
      await sleep(520);

      const status = validatePlayerPosition(currentPlayer);
      if (!status.ok) {
        setResult({
          tone: "fail",
          emoji: "⚠️",
          title: "失敗...",
          text: `${index + 1}手目で ${status.reason}`,
        });
        setLocked(false);
        setActivePosition(null);
        return;
      }

      if (isSameCell(stage.goal, currentPlayer.x, currentPlayer.y)) {
        setResult({
          tone: "success",
          emoji: "🎉",
          title: "成功！",
          text: `${index + 1}手でゴールしました。コマンドの組み方を変えて短くする遊び方もできます。`,
        });
        setLocked(false);
        setActivePosition(null);
        return;
      }
    }

    setResult({
      tone: "fail",
      emoji: "⚠️",
      title: "失敗...",
      text: "ゴールに届きませんでした。向きと進む回数を見直してください。",
    });
    setLocked(false);
    setActivePosition(null);
  }

  function moveCommand(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) return;

    setQueue((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="stage-bar">
          <div className="stage-card">
            <span className="stage-card__label">ステージ</span>
            <strong>{stage.number}</strong>
          </div>
          <div className="message-card">
            <p className="message-card__title">コマンドを順番に並べてゴールまで導こう！</p>
            <p className="message-card__sub">
              実行前に進む・下がる・回るをセットして、結果を見て調整できます。
            </p>
          </div>
          <div className="action-pills">
            <button className="small-pill" type="button" onClick={showHint} disabled={locked}>
              ヒント
            </button>
            <button className="small-pill" type="button" onClick={resetAll} disabled={locked}>
              やり直す
            </button>
          </div>
        </div>

        <div className="play-area">
          <section className="board-card">
            <div className="board-card__header">
              <div className="legend">
                <span>
                  <i className="swatch swatch--start" />
                  START
                </span>
                <span>
                  <i className="swatch swatch--goal" />
                  GOAL
                </span>
                <span>
                  <i className="swatch swatch--wall" />
                  NG
                </span>
              </div>
              <div className="status-chip">{facingLabel}</div>
            </div>
            <div className="board" aria-label="ゲームボード">
              {Array.from({ length: stage.size * stage.size }, (_, index) => {
                const x = index % stage.size;
                const y = Math.floor(index / stage.size);
                const isWall = stage.walls.some(([wallX, wallY]) => wallX === x && wallY === y);
                const isActive = activePosition?.x === x && activePosition?.y === y;
                const tileClassName = `tile ${getTileClassName(x, y)}${isActive ? " tile--active" : ""}`;

                return (
                  <div className={tileClassName} key={`${x}-${y}`}>
                    {isWall ? <div className="obstacle-rock" aria-hidden="true" /> : null}
                    {player.x === x && player.y === y ? (
                      <div
                        className="character"
                        style={
                          {
                            "--character-rotation":
                              characterRotationByDir[
                                player.dir as keyof typeof characterRotationByDir
                              ],
                          } as CSSProperties
                        }
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="program-card">
            <div className="program-card__header">
              <h2>コマンドリスト</h2>
              <span>
                {queue.length} / {stage.maxCommands}
              </span>
            </div>
            <ol className="command-list">
              {queue.map((commandId, index) => {
                const command = commands[commandId as keyof typeof commands];

                return (
                  <li
                    className={`command-item${dragIndex === index ? " command-item--dragging" : ""}`}
                    key={`${commandId}-${index}`}
                    draggable={!locked}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDragIndex(index)}
                    onDrop={(event) => {
                      event.preventDefault();
                      moveCommand(index);
                    }}
                  >
                    <span className="command-item__index">{index + 1}</span>
                    <span className="command-item__icon" style={{ background: command.color }}>
                      {command.icon}
                    </span>
                    <span className="command-item__label">{command.label}</span>
                    <button
                      className="command-item__delete"
                      type="button"
                      aria-label="削除"
                      onClick={() => deleteCommand(index)}
                      disabled={locked}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="program-card__actions">
              <button className="run-button" type="button" onClick={runQueue} disabled={locked}>
                実行
              </button>
              <button className="ghost-button" type="button" onClick={clearCommands} disabled={locked}>
                クリア
              </button>
            </div>
          </section>
        </div>
      </section>

      <aside className="side-panel">
        <section className="toolbox-card">
          <div className="section-heading">
            <h2>コマンド</h2>
            <p>クリックで追加、ドラッグで並び替え</p>
          </div>
          <div className="command-palette">
            {paletteCommands.map((command) => (
              <button
                className="palette-button"
                key={command.id}
                type="button"
                style={{ background: command.color }}
                onClick={() => addCommand(command.id)}
                disabled={locked}
              >
                <span className="palette-button__icon">{command.icon}</span>
                <span className="palette-button__label">{command.label}</span>
                <span className="palette-button__text">{command.help}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="result-card">
          <div className="section-heading">
            <h2>実行結果</h2>
            <p>成功か失敗かをここで確認</p>
          </div>
          <div className={`result-panel result-panel--${result.tone}`}>
            <div className="result-emoji">{result.emoji}</div>
            <p className="result-title">{result.title}</p>
            <p className="result-text">{result.text}</p>
          </div>
        </section>

        <section className="hint-card">
          <div className="section-heading">
            <h2>遊び方</h2>
          </div>
          <ul className="hint-list">
            <li>「まえにすすむ」は向いている方向へ1マス進みます。</li>
            <li>「うしろにすすむ」は向いている方向の逆へ1マス進みます。</li>
            <li>回転はその場で向きだけ変わります。</li>
            <li>道の外や岩に当たると失敗です。</li>
          </ul>
          <div className="guide-character" aria-hidden="true">
            <Image
              src="/game/character-front-smile.png"
              alt=""
              className="guide-character__image"
              width={96}
              height={96}
            />
            <p className="guide-character__text">がんばって！</p>
          </div>
        </section>
      </aside>
    </main>
  );
}
