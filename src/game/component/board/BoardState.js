// Board state management: empty board, locking pieces, clearing lines.

import { BOARD_WIDTH, BOARD_HEIGHT, LINE_SCORES } from './config/BoardConfig.js';

/** Returns a fresh empty board (rows of 0 / color strings). */
export function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => new Array(BOARD_WIDTH).fill(0));
}

/**
 * Stamps a locked piece onto the board and returns a new board.
 * `piece` = { shape, x, y, color }
 */
export function lockPieceToBoard(board, piece) {
  const next = board.map((row) => row.slice());
  const { shape, x, y, color } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && y + r >= 0) {
        next[y + r][x + c] = color;
      }
    }
  }
  return next;
}

/**
 * Removes full rows, pushes everything down and returns the new
 * board, how many lines were cleared and the score for that.
 */
export function clearLines(board) {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const cleared = [
    ...Array.from({ length: linesCleared }, () => new Array(BOARD_WIDTH).fill(0)),
    ...remaining,
  ];
  return { board: cleared, linesCleared, score: LINE_SCORES[linesCleared] ?? 0 };
}
