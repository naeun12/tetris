import { extend } from '@pixi/react';
import { Graphics } from 'pixi.js';
import { CELL_SIZE } from './board/config/BoardConfig';
extend({ Graphics });

const GameGrid = ({ x, y, color }) => (
  <pixiGraphics
    x={x * CELL_SIZE}
    y={y * CELL_SIZE}
    draw={(g) => {
      g.clear();
      g.rect(1, 1, CELL_SIZE - 2, CELL_SIZE - 2).fill(color);
    }}
  />
);

export default GameGrid;