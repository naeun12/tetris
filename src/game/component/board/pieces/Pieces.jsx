import IPiece from './IPieces';
import JPiece from './JPieces';
import LPiece from './LPieces';
import OPiece from './OPiece';
import SPiece from './SPieces';
import TPiece from './TPieces';
import ZPiece from './ZPieces';

export const PIECES = {
  I: IPiece,
  J: JPiece,
  L: LPiece,
  O: OPiece,
  S: SPiece,
  T: TPiece,
  Z: ZPiece,
};

export const PIECE_TYPES = Object.keys(PIECES);

export default PIECES;