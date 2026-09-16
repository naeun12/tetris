// Central configuration for the Tetris board.

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 32; // px per cell

export const BOARD_WIDTH_PX = BOARD_WIDTH * CELL_SIZE;
export const BOARD_HEIGHT_PX = BOARD_HEIGHT * CELL_SIZE;

// How often (ms) a piece automatically drops one row.
export const DROP_INTERVAL_MS = 500;

// Score awarded per number of lines cleared at once (index = lines).
export const LINE_SCORES = [0, 100, 300, 500, 800];

// Score awarded per manual soft-drop row.
export const SOFT_DROP_SCORE = 1;
