// Collision detection for pieces against walls, floor and locked cells.

import { BOARD_WIDTH, BOARD_HEIGHT } from '../config/BoardConfig.js';

/**
 * Returns true when the given tetromino shape fits on the board
 * at the given offset.
 */
export function isValidPosition(shape, board, x, y) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const bx = x + c;
      const by = y + r;
      if (bx < 0 || bx >= BOARD_WIDTH || by >= BOARD_HEIGHT) return false;
      if (by >= 0 && board[by][bx]) return false;
    }
  }
  return true;
}

/**
 * Finds the lowest valid row for the shape dropped straight down
 * from (x, y). Used for the ghost piece and hard drops.
 */
export function getDropY(shape, board, x, y) {
  let dropY = y;
  while (isValidPosition(shape, board, x, dropY + 1)) dropY += 1;
  return dropY;
}
