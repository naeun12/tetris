// Static 10×20 cell grid (DOM) used as the board backdrop.
// The Pixi canvas is layered on top and draws the actual cells.

import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './config/BoardConfig.js';

export default function GameGrid() {
  const cells = [];
  for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
    cells.push(
      <div key={i} className="border-[0.5px] border-white/[0.06] bg-white/[0.01]" />
    );
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
        gridAutoRows: `${CELL_SIZE}px`,
      }}
    >
      {cells}
    </div>
  );
}
