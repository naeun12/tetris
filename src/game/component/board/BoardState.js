/** @format */

import { BOARD_WIDTH, BOARD_HEIGHT } from "./config/BoardConfig";

export const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

export const mergePiece = (board, piece) => {
  const newBoard = board.map((row) => [...row]);

  piece.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (!cell) {
        return;
      }

      const by = piece.y + dy;
      const bx = piece.x + dx;

      if (by >= 0 && by < BOARD_HEIGHT && bx >= 0 && bx < BOARD_WIDTH) {
        newBoard[by][bx] = piece.type;
      }
    });
  });

  return newBoard;
};

export const clearLines = (board) => {
  const remaining = board.filter((row) => row.some((cell) => !cell));

  const cleared = BOARD_HEIGHT - remaining.length;

  const newRows = Array.from({ length: cleared }, () =>
    Array(BOARD_WIDTH).fill(null),
  );

  return {
    board: [...newRows, ...remaining],
    cleared,
  };
};
