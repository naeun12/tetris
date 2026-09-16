/** @format */

// Piece movement: rotation (with wall kicks) and hard drops.

import { isValidPosition, getDropY } from "../collision/Collision.js";

/**
 * Rotates a square matrix 90° clockwise and returns a new matrix.
 */
export function rotateClockwise(shape) {
  const n = shape.length;
  const out = shape.map((row) => row.slice());
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      out[c][n - 1 - r] = shape[r][c];
    }
  }
  return out;
}

/**
 * Tries to rotate the piece clockwise with simple wall kicks
 * (offsets 0, -1, +1, -2, +2). Returns { shape, x, y } or null
 * when no orientation fits.
 */
export function tryRotate(shape, board, x, y) {
  const rotated = rotateClockwise(shape);
  for (const kick of [0, -1, 1, -2, 2]) {
    if (isValidPosition(rotated, board, x + kick, y)) {
      return { shape: rotated, x: x + kick, y };
    }
  }
  return null;
}

/** Final row for a hard drop (same rule as the ghost preview). */
export const getHardDropY = getDropY;
