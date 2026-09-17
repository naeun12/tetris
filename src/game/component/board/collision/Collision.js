/** @format */

import { BOARD_WIDTH, BOARD_HEIGHT } from "../config/BoardConfig";

export const collides = (board, shape, offsetX, offsetY) => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;

      const bx = offsetX + x;
      const by = offsetY + y;

      if (bx < 0 || bx >= BOARD_WIDTH || by >= BOARD_HEIGHT) return true;
      if (by >= 0 && board[by][bx]) return true;
    }
  }
  return false;
};
