/** @format */

import { collides } from "../collision/Collision";

import { getKicks, get180Kicks } from "../rotation/SRS";

/*
=========================================================
 ROTATION STATES
=========================================================
*/

const ROTATION_STATES = ["0", "R", "2", "L"];

/*
=========================================================
 NEXT ROTATION
=========================================================
*/

const getNextRotationState = (current, dir) => {
  const index = ROTATION_STATES.indexOf(current);

  const currentIndex = index === -1 ? 0 : index;

  if (dir === 1) {
    return ROTATION_STATES[(currentIndex + 1) % 4];
  }

  if (dir === -1) {
    return ROTATION_STATES[(currentIndex + 3) % 4];
  }

  if (dir === 2) {
    return ROTATION_STATES[(currentIndex + 2) % 4];
  }

  return current;
};

/*
=========================================================
 CLOCKWISE
=========================================================
*/

const rotateCW = (matrix) => {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[columnIndex]).reverse(),
  );
};

/*
=========================================================
 COUNTER-CLOCKWISE
=========================================================
*/

const rotateCCW = (matrix) => {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[matrix[0].length - 1 - columnIndex]),
  );
};

/*
=========================================================
 180°
=========================================================
*/

const rotate180 = (matrix) => {
  return matrix.map((row) => [...row].reverse()).reverse();
};

/*
=========================================================
 ROTATE MATRIX
=========================================================
*/

export const rotateMatrix = (matrix, dir = 1) => {
  if (dir === 1) {
    return rotateCW(matrix);
  }

  if (dir === -1) {
    return rotateCCW(matrix);
  }

  if (dir === 2) {
    return rotate180(matrix);
  }

  return matrix;
};

/*
=========================================================
 MOVE
=========================================================
*/

export const tryMove = (board, piece, dx, dy) => {
  const moved = {
    ...piece,

    x: piece.x + dx,

    y: piece.y + dy,
  };

  if (collides(board, moved.shape, moved.x, moved.y)) {
    return null;
  }

  return moved;
};

/*
=========================================================
 ROTATE
=========================================================
*/

export const tryRotate = (board, piece, dir = 1) => {
  if (!piece) {
    return null;
  }

  const currentRotation = piece.rotation || "0";

  /*
    =====================================================
    O PIECE
    =====================================================
    */

  if (piece.type === "O") {
    return {
      ...piece,

      rotation: getNextRotationState(currentRotation, dir),

      lastRotation: true,

      rotationDirection: dir,
    };
  }

  /*
    =====================================================
    180°
    
    IMPORTANT:
    
    Don't do:
    
        90° + 90°
    
    We directly rotate 180°.
    =====================================================
    */

  if (dir === 2) {
    const nextRotation = getNextRotationState(currentRotation, 2);

    const rotated = rotateMatrix(piece.shape, 2);

    const kicks = get180Kicks(piece.type);

    for (const [kickX, kickY] of kicks) {
      const newX = piece.x + kickX;

      const newY = piece.y - kickY;

      if (!collides(board, rotated, newX, newY)) {
        return {
          ...piece,

          shape: rotated,

          x: newX,

          y: newY,

          rotation: nextRotation,

          lastRotation: true,

          rotationDirection: 2,
        };
      }
    }

    return null;
  }

  /*
    =====================================================
    90° ROTATION
    =====================================================
    */

  const nextRotation = getNextRotationState(currentRotation, dir);

  const rotated = rotateMatrix(piece.shape, dir);

  /*
    =====================================================
    GET SRS KICKS
    =====================================================
    */

  const kicks = getKicks(piece.type, currentRotation, nextRotation);

  /*
    =====================================================
    TRY ALL KICKS
    =====================================================
    */

  for (const [kickX, kickY] of kicks) {
    const newX = piece.x + kickX;

    const newY = piece.y - kickY;

    if (!collides(board, rotated, newX, newY)) {
      return {
        ...piece,

        shape: rotated,

        x: newX,

        y: newY,

        rotation: nextRotation,

        lastRotation: true,

        rotationDirection: dir,
      };
    }
  }

  return null;
};

/*
=========================================================
 DROP POSITION
=========================================================
*/

export const getDropY = (board, piece) => {
  let y = piece.y;

  while (!collides(board, piece.shape, piece.x, y + 1)) {
    y++;
  }

  return y;
};
