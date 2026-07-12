export type Soccer3DPhase = "aiming" | "flying" | "goal" | "saved" | "miss";

export type Soccer3DConfig = {
  goalHalfWidth: number;
  goalieReach: number;
  maxAimX: number;
  minPower: number;
  maxPower: number;
  shotSpeed: number;
  goalieBaseX: number;
  goalieRange: number;
  goalieSpeed: number;
};

export type Soccer3DState = {
  phase: Soccer3DPhase;
  aimX: number;
  power: number;
  ballX: number;
  ballZ: number;
  goalieX: number;
  tick: number;
  attempts: number;
  score: number;
  message: string;
  config: Soccer3DConfig;
};

export type Soccer3DOptions = Partial<
  Pick<Soccer3DState, "aimX" | "power" | "score" | "attempts" | "tick">
> &
  Partial<Pick<Soccer3DConfig, "goalieBaseX" | "goalieRange" | "goalieSpeed">>;

const DEFAULT_CONFIG: Soccer3DConfig = {
  goalHalfWidth: 18,
  goalieReach: 8,
  maxAimX: 26,
  minPower: 45,
  maxPower: 100,
  shotSpeed: 22,
  goalieBaseX: 0,
  goalieRange: 18,
  goalieSpeed: 0.55,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getGoalieX(config: Soccer3DConfig, tick: number) {
  const drift = Math.sin(tick * config.goalieSpeed) * config.goalieRange;
  return clamp(
    Math.round(config.goalieBaseX + drift),
    -config.goalHalfWidth,
    config.goalHalfWidth,
  );
}

export function createSoccer3DState(options: Soccer3DOptions = {}): Soccer3DState {
  const config: Soccer3DConfig = {
    ...DEFAULT_CONFIG,
    goalieBaseX: options.goalieBaseX ?? DEFAULT_CONFIG.goalieBaseX,
    goalieRange: options.goalieRange ?? DEFAULT_CONFIG.goalieRange,
    goalieSpeed: options.goalieSpeed ?? DEFAULT_CONFIG.goalieSpeed,
  };
  const tick = options.tick ?? 0;

  return {
    phase: "aiming",
    aimX: clamp(options.aimX ?? 0, -config.maxAimX, config.maxAimX),
    power: clamp(options.power ?? 72, config.minPower, config.maxPower),
    ballX: 0,
    ballZ: 0,
    goalieX: getGoalieX(config, tick),
    tick,
    attempts: options.attempts ?? 0,
    score: options.score ?? 0,
    message: "左右でコース、上下でパワー、スペースでシュート。",
    config,
  };
}

export function moveAim(state: Soccer3DState, delta: number): Soccer3DState {
  if (state.phase !== "aiming") {
    return state;
  }

  return {
    ...state,
    aimX: clamp(state.aimX + delta, -state.config.maxAimX, state.config.maxAimX),
  };
}

export function adjustPower(state: Soccer3DState, delta: number): Soccer3DState {
  if (state.phase !== "aiming") {
    return state;
  }

  return {
    ...state,
    power: clamp(state.power + delta, state.config.minPower, state.config.maxPower),
  };
}

export function shootBall(state: Soccer3DState): Soccer3DState {
  if (state.phase !== "aiming") {
    return state;
  }

  return {
    ...state,
    phase: "flying",
    attempts: state.attempts + 1,
    message: "シュート中...",
  };
}

function resolveShot(state: Soccer3DState): Soccer3DState {
  const isInsideGoal = Math.abs(state.ballX) <= state.config.goalHalfWidth;

  if (!isInsideGoal) {
    return {
      ...state,
      phase: "miss",
      message: "シュートは枠を外れました。Enter でもう一度。",
    };
  }

  if (Math.abs(state.ballX - state.goalieX) <= state.config.goalieReach) {
    return {
      ...state,
      phase: "saved",
      message: "キーパーに止められました。Enter でもう一度。",
    };
  }

  return {
    ...state,
    phase: "goal",
    score: state.score + 1,
    message: "ゴール! Enter で次の1本へ。",
  };
}

export function stepSoccer3D(state: Soccer3DState): Soccer3DState {
  const tick = state.tick + 1;
  const goalieX = getGoalieX(state.config, tick);

  if (state.phase !== "flying") {
    return {
      ...state,
      tick,
      goalieX,
    };
  }

  const nextBallZ = clamp(state.ballZ + state.config.shotSpeed, 0, 100);
  const depthRatio = nextBallZ / 100;
  const powerCurve = 0.7 + (state.power - state.config.minPower) / 100;
  const nextBallX = Math.round(state.aimX * depthRatio * powerCurve);
  const nextState: Soccer3DState = {
    ...state,
    ballX: nextBallX,
    ballZ: nextBallZ,
    goalieX,
    tick,
  };

  if (nextBallZ < 100) {
    return nextState;
  }

  return resolveShot(nextState);
}

export function resetSoccer3DRound(state: Soccer3DState): Soccer3DState {
  return createSoccer3DState({
    score: state.score,
    attempts: state.attempts,
    tick: state.tick,
  });
}
