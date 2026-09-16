// Aggregates every tetromino definition in one lookup table.

import { IPiece } from './IPieces.jsx';
import { JPiece } from './JPieces.jsx';
import { LPiece } from './LPieces.jsx';
import { OPiece } from './OPiece.jsx';
import { SPiece } from './SPieces.jsx';
import { TPiece } from './TPPieces.jsx';
import { ZPiece } from './ZPieces.jsx';

export const PIECES = {
  I: IPiece,
  J: JPiece,
  L: LPiece,
  O: OPiece,
  S: SPiece,
  T: TPiece,
  Z: ZPiece,
};

export const PIECE_NAMES = Object.keys(PIECES);

/** Deep-copies a piece shape matrix so it can be mutated freely. */
export function cloneShape(shape) {
  return shape.map((row) => row.slice());
}
