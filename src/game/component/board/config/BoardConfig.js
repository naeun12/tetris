/** @format */

import { getHandlingSettings } from "../../../gameSettings/HandlingSettings";

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const VISIBLE_HEIGHT = 20;

export const CELL_SIZE = 48;

export const TICK_BASE_MS = 1000;
export const TICK_MIN_MS = 10;
export const TICK_LEVEL_STEP_MS = 50;

export const LOCK_DELAY_MS = 500;

const DAS_MAX = 300;
const ARR_MAX = 50;
const DCD_MAX = 100;

export const getDAS = () => {
  const value = Number(getHandlingSettings().das);
  return Math.max(0, DAS_MAX - value);
};

export const getARR = () => {
  const value = Number(getHandlingSettings().arr);
  return Math.max(0, ARR_MAX - value);
};

export const getDCD = () => {
  const value = Number(getHandlingSettings().dcd);
  return Math.max(0, DCD_MAX - value);
};

export const getSDF = () => {
  return Number(getHandlingSettings().sdf);
};

export const SCORE_TABLE = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

export const COLORS = {
  background: "#131317",
  gridLine: "rgba(109, 82, 82, 0.15)",
  ghost: "rgba(255, 255, 255, 0.12)",
};
