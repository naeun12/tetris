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

  return corners.reduce(
    (count, [x, y]) => count + (isOccupied(board, x, y) ? 1 : 0),
    0,
  );
};

const isLockedAtPosition = (board, piece) => {
  if (!board || !piece) {
    return false;
  }

  return collides(board, piece.shape, piece.x, piece.y + 1);
};

const hasValidRotation = (piece) => {
  if (!piece) {
    return false;
  }

  return piece.lastRotation === true && piece.rotationDirection !== 0;
};

const getPieceCells = (piece) => {
  if (!piece || !piece.shape) {
    return [];
  }

  const cells = [];

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (!piece.shape[row][col]) {
        continue;
      }

      cells.push([piece.x + col, piece.y + row]);
    }
  }

  return cells;
};

const getBottomCells = (piece) => {
  if (!piece || !piece.shape) {
    return [];
  }

  const cells = [];

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (!piece.shape[row][col]) {
        continue;
      }

      let hasPieceBelow = false;

      for (let nextRow = row + 1; nextRow < piece.shape.length; nextRow++) {
        if (piece.shape[nextRow][col]) {
          hasPieceBelow = true;

          break;
        }
      }

      if (!hasPieceBelow) {
        cells.push([piece.x + col, piece.y + row]);
      }
    }
  }

  return cells;
};

const getSupportedBottomCells = (board, piece) => {
  const bottomCells = getBottomCells(piece);

  return bottomCells.filter(([x, y]) => isOccupied(board, x, y + 1));
};

const getBlockedSides = (board, piece) => {
  const cells = getPieceCells(piece);

  let leftBlocked = 0;
  let rightBlocked = 0;

  for (const [x, y] of cells) {
    if (isOccupied(board, x - 1, y)) {
      leftBlocked++;
    }

    if (isOccupied(board, x + 1, y)) {
      rightBlocked++;
    }
  }

  return {
    leftBlocked,
    rightBlocked,
  };
};

const hasTightGeometry = (board, piece) => {
  if (!SPIN_PIECES.includes(piece.type)) {
    return false;
  }

  const occupied = piece.shape.reduce(
    (count, row) => count + row.filter(Boolean).length,
    0,
  );

  if (occupied !== 4) {
    return false;
  }

  const supported = getSupportedBottomCells(board, piece);

  if (supported.length === 0) {
    return false;
  }

  const { leftBlocked, rightBlocked } = getBlockedSides(board, piece);

  const corners = getSpinCorners(board, piece);

  if (piece.type === "I") {
    return (
      supported.length >= 2 &&
      (leftBlocked >= 1 || rightBlocked >= 1) &&
      corners >= 2
    );
  }

  if (["J", "L"].includes(piece.type)) {
    return (
      supported.length >= 1 &&
      (leftBlocked >= 1 || rightBlocked >= 1) &&
      corners >= 2
    );
  }

  if (["S", "Z"].includes(piece.type)) {
    return (
      supported.length >= 1 &&
      (leftBlocked >= 1 || rightBlocked >= 1) &&
      corners >= 2
    );
  }

  return false;
};

const isTSpinPosition = (board, piece) => {
  if (!isLockedAtPosition(board, piece)) {
    return false;
  }

  if (!hasValidRotation(piece)) {
    return false;
  }

  return getSpinCorners(board, piece) >= 3;
};

const isAllSpinPosition = (board, piece) => {
  if (!isLockedAtPosition(board, piece)) {
    return false;
  }

  if (!hasValidRotation(piece)) {
    return false;
  }

  if (piece.type === "T" || piece.type === "O") {
    return false;
  }

  if (!SPIN_PIECES.includes(piece.type)) {
    return false;
  }

  return hasTightGeometry(board, piece);
};

export const isTSpin = (board, piece) => {
  if (!piece || piece.type !== "T") {
    return false;
  }

  return isTSpinPosition(board, piece);
};

export const isSpin = (board, piece) => {
  if (!piece) {
    return false;
  }

  if (piece.type === "T") {
    return isTSpinPosition(board, piece);
  }

  return isAllSpinPosition(board, piece);
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
