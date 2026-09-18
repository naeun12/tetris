/** @format */

import { collides } from "../collision/Collision";
import { getKicks, get180Kicks } from "../rotation/SRS";
import { playSfx } from "../../../audio/SfxPlayer";

const ROTATION_STATES = ["0", "R", "2", "L"];
const SPIN_PIECES = ["I", "J", "L", "S", "Z", "T"];

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

const rotateCW = (matrix) => {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[columnIndex]).reverse(),
  );
};

const rotateCCW = (matrix) => {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[matrix[0].length - 1 - columnIndex]),
  );
};

const rotate180 = (matrix) => {
  return matrix.map((row) => [...row].reverse()).reverse();
};

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

export const tryMove = (board, piece, dx, dy) => {
  const moved = {
    ...piece,
    x: piece.x + dx,
    y: piece.y + dy,
    lastRotation: piece.lastRotation,
    rotationDirection: piece.rotationDirection,
    rotationKick: piece.rotationKick || [0, 0],
    rotationKickIndex: piece.rotationKickIndex || 0,
  };

  if (collides(board, moved.shape, moved.x, moved.y)) {
    return null;
  }

  return moved;
};

export const tryRotate = (board, piece, dir = 1) => {
  if (!piece) {
    return null;
  }

  const currentRotation = piece.rotation || "0";

  if (piece.type === "O") {
    playSfx("rotation");

    return {
      ...piece,
      rotation: getNextRotationState(currentRotation, dir),
      lastRotation: true,
      rotationDirection: dir,
      rotationKick: [0, 0],
      rotationKickIndex: 0,
    };
  }

  if (dir === 2) {
    const nextRotation = getNextRotationState(currentRotation, 2);

    const rotated = rotateMatrix(piece.shape, 2);

    const kicks = get180Kicks(piece.type);

    for (let i = 0; i < kicks.length; i++) {
      const [kickX, kickY] = kicks[i];

      const newX = piece.x + kickX;

      const newY = piece.y - kickY;

      if (!collides(board, rotated, newX, newY)) {
        playSfx("rotation");

        return {
          ...piece,
          shape: rotated,
          x: newX,
          y: newY,
          rotation: nextRotation,
          lastRotation: true,
          rotationDirection: 2,
          rotationKick: [kickX, kickY],
          rotationKickIndex: i,
        };
      }
    }

    return null;
  }

  const nextRotation = getNextRotationState(currentRotation, dir);

  const rotated = rotateMatrix(piece.shape, dir);

  const kicks = getKicks(piece.type, currentRotation, nextRotation);

  for (let i = 0; i < kicks.length; i++) {
    const [kickX, kickY] = kicks[i];

    const newX = piece.x + kickX;

    const newY = piece.y - kickY;

    if (!collides(board, rotated, newX, newY)) {
      playSfx("rotation");

      return {
        ...piece,
        shape: rotated,
        x: newX,
        y: newY,
        rotation: nextRotation,
        lastRotation: true,
        rotationDirection: dir,
        rotationKick: [kickX, kickY],
        rotationKickIndex: i,
      };
    }
  }

  return null;
};

export const getDropY = (board, piece) => {
  let y = piece.y;

  while (!collides(board, piece.shape, piece.x, y + 1)) {
    y++;
  }

  return y;
};

const isOccupied = (board, x, y) => {
  if (x < 0 || x >= board[0].length || y >= board.length) {
    return true;
  }

  if (y < 0) {
    return true;
  }

  return Boolean(board[y][x]);
};

const getSpinCorners = (board, piece) => {
  if (!board || !piece || !board.length || !board[0]) {
    return 0;
  }

  const centerX = piece.x + 1;

  const centerY = piece.y + 1;

  const corners = [
    [centerX - 1, centerY - 1],
    [centerX + 1, centerY - 1],
    [centerX - 1, centerY + 1],
    [centerX + 1, centerY + 1],
  ];

  return corners.reduce((count, [x, y]) => {
    return count + (isOccupied(board, x, y) ? 1 : 0);
  }, 0);
};

export const isTSpin = (board, piece) => {
  if (!piece || piece.type !== "T") {
    return false;
  }

  if (!piece.lastRotation) {
    return false;
  }

  return getSpinCorners(board, piece) >= 3;
};

export const isSpin = (board, piece) => {
  if (!piece) {
    return false;
  }

  if (!SPIN_PIECES.includes(piece.type)) {
    return false;
  }

  if (!piece.lastRotation) {
    return false;
  }

  const corners = getSpinCorners(board, piece);

  if (piece.type === "T") {
    return corners >= 3;
  }

  return corners >= 3;
};

export const getSpinType = (board, piece, cleared) => {
  if (!isSpin(board, piece)) {
    return null;
  }

  if (piece.type === "T") {
    if (cleared === 0) {
      return "TSPIN";
    }

    return `TSPIN ${cleared}`;
  }

  if (cleared === 0) {
    return `${piece.type} SPIN`;
  }

  return `${piece.type} SPIN ${cleared}`;
};
