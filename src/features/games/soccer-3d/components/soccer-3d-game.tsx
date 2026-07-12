"use client";

import { useEffect, useState } from "react";

import {
  adjustPower,
  createSoccer3DState,
  moveAim,
  resetSoccer3DRound,
  shootBall,
  stepSoccer3D,
  type Soccer3DState,
} from "@/features/games/soccer-3d/lib/soccer-3d";

function getBallVisual(state: Soccer3DState) {
  const depth = state.ballZ / 100;
  const travelWidth = 58 - depth * 28;
  const top = 84 - depth * 72;
  const left = 50 + (state.ballX / state.config.maxAimX) * travelWidth;
  const scale = 1.12 - depth * 0.62;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
  };
}

function getGoalieVisual(state: Soccer3DState) {
  const left = 50 + (state.goalieX / state.config.goalHalfWidth) * 22;

  return {
    left: `${left}%`,
  };
}

export function Soccer3DGame() {
  const [state, setState] = useState(createSoccer3DState);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setState((current) => stepSoccer3D(current));
    }, 90);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        setState((current) => moveAim(current, -4));
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        setState((current) => moveAim(current, 4));
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setState((current) => adjustPower(current, 5));
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setState((current) => adjustPower(current, -5));
      } else if (event.code === "Space") {
        event.preventDefault();
        setState((current) => shootBall(current));
      } else if (event.code === "Enter") {
        event.preventDefault();
        setState((current) => resetSoccer3DRound(current));
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isRoundFinished = state.phase === "goal" || state.phase === "saved" || state.phase === "miss";
  const aimMarkerLeft = 50 + (state.aimX / state.config.maxAimX) * 38;

  return (
    <section className="soccer-3d-shell">
      <div className="soccer-3d-stage-card">
        <div className="soccer-3d-stage-head">
          <div>
            <p className="soccer-3d-kicker">3D Soccer Route</p>
            <h2>3Dサッカーシュート</h2>
            <p className="soccer-3d-copy">
              立体表現のピッチでコースとパワーを調整し、キーパーの逆を突いてゴールを狙います。
            </p>
          </div>
          <div className="soccer-3d-scoreboard">
            <span>Score {state.score}</span>
            <strong>{state.attempts}</strong>
            <small>shots</small>
          </div>
        </div>

        <div className="soccer-3d-stage" aria-label="3Dサッカーフィールド">
          <div className="soccer-3d-stage__sky" />
          <div className="soccer-3d-goal">
            <div className="soccer-3d-goal__net" />
          </div>
          <div className="soccer-3d-pitch">
            <div className="soccer-3d-pitch__line soccer-3d-pitch__line--center" />
            <div className="soccer-3d-pitch__line soccer-3d-pitch__line--box" />
          </div>
          <div className="soccer-3d-goalie" style={getGoalieVisual(state)} />
          <div className="soccer-3d-ball" style={getBallVisual(state)} />
          <div className="soccer-3d-player" />
          <div className="soccer-3d-aim-marker" style={{ left: `${aimMarkerLeft}%` }} />
        </div>
      </div>

      <div className="soccer-3d-panel-grid">
        <article className="soccer-3d-info-card">
          <h3>操作</h3>
          <ul className="soccer-3d-list">
            <li>← → : コース調整</li>
            <li>↑ ↓ : パワー調整</li>
            <li>Space : シュート</li>
            <li>Enter : 次の1本へリセット</li>
          </ul>
        </article>

        <article className="soccer-3d-info-card">
          <h3>現在の設定</h3>
          <dl className="soccer-3d-stats">
            <div>
              <dt>狙い</dt>
              <dd>{state.aimX}</dd>
            </div>
            <div>
              <dt>パワー</dt>
              <dd>{state.power}</dd>
            </div>
            <div>
              <dt>状態</dt>
              <dd>{state.phase}</dd>
            </div>
          </dl>
        </article>

        <article className="soccer-3d-info-card soccer-3d-info-card--message">
          <h3>判定</h3>
          <p>{state.message}</p>
          <button
            className="soccer-3d-reset-button"
            onClick={() => setState((current) => resetSoccer3DRound(current))}
            type="button"
          >
            {isRoundFinished ? "次の1本へ" : "最初から調整し直す"}
          </button>
        </article>
      </div>
    </section>
  );
}
