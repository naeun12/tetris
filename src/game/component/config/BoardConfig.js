/** @format */

export const BoardConfig = {
  // BOARD
  boardWidth: 500,
  boardHeight: 600,

  // GRID
  columns: 10,
  rows: 20,

  borderLeft: 20,
  borderRight: 20,
  borderTop: 20,
  borderBottom: 20,

  // HOLD
  holdWidth: 100,
  holdHeight: 100,
  holdGap: 5,

  holdX: 0,
  holdY: 20,

  // NEXT
  nextWidth: 100,
  nextHeight: 100,
  nextGap: 5,

  nextX: 0,
  nextY: 20,

  // PIECE
  spawnColumn: 4,
  spawnRow: 0,

  pieceWidth: 2,
  pieceHeight: 3,

  // SOFT DROP
  softDropDistance: 1,

  // GRAVITY
  gravity: {
    enabled: true,

    // How many milliseconds between drops
    interval: 800,
  },

  // KEYBINDS
  keys: {
    left: "ArrowLeft",
    right: "ArrowRight",
    softDrop: "ArrowDown",
    rotate: "ArrowUp",
    hardDrop: " ",
  },
};
