/** @format */

/*
=========================================================
 BOARD CELL
=========================================================
*/

const isOccupied = (board, x, y) => {
  if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) {
    return true;
  }

  return Boolean(board[y][x]);
};

/*
=========================================================
 SPIN PIECES
=========================================================
*/

const SPIN_PIECES = ["I", "J", "L", "S", "Z", "T"];

/*
=========================================================
 GET CORNERS
=========================================================
*/

const getCorners = (piece) => {
  /*
    J/L/S/Z/T = 3x3
    */

  const centerX = piece.x + 1;

  const centerY = piece.y + 1;

  return [
    [centerX - 1, centerY - 1],

    [centerX + 1, centerY - 1],

    [centerX - 1, centerY + 1],

    [centerX + 1, centerY + 1],
  ];
};

/*
=========================================================
 COUNT CORNERS
=========================================================
*/

export const countSpinCorners = (board, piece) => {
  const corners = getCorners(piece);

  return corners.filter(([x, y]) => isOccupied(board, x, y)).length;
};

/*
=========================================================
 DETECT ALL SPIN
=========================================================
*/

export const detectSpin = (board, piece) => {
  if (!piece) {
    return {
      isSpin: false,
      type: null,
      corners: 0,
    };
  }

  /*
    O doesn't count as spin
    */

  if (!SPIN_PIECES.includes(piece.type)) {
    return {
      isSpin: false,
      type: null,
      corners: 0,
    };
  }

  /*
    Piece must have rotated
    */

  if (piece.lastRotation !== true) {
    return {
      isSpin: false,
      type: null,
      corners: 0,
    };
  }

  const corners = countSpinCorners(board, piece);

  /*
    ALL-SPIN RULE

    3 or 4 corners occupied
    */

  if (corners >= 3) {
    return {
      isSpin: true,

      type: `${piece.type}-Spin`,

      corners,

      rotation: piece.rotation || "0",

      direction: piece.rotationDirection || 0,
    };
  }

  return {
    isSpin: false,

    type: null,

    corners,
  };
};

/*
=========================================================
 IS SPIN
=========================================================
*/

export const isPieceSpin = (board, piece) => {
  return detectSpin(board, piece).isSpin;
};

/*
=========================================================
 SPIN NAME
=========================================================
*/

export const getSpinName = (board, piece) => {
  return detectSpin(board, piece).type;
};
