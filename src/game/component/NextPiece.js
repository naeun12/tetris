/** @format */

import { Container, Graphics } from "pixi.js";

const COLORS = {
  I: 0x00ffff,
  O: 0xffff00,
  T: 0xaa00ff,
  S: 0x00ff00,
  Z: 0xff0000,
  J: 0x0000ff,
  L: 0xff8800,
};

const SHAPES = {
  I: [[1, 1, 1, 1]],

  O: [
    [1, 1],
    [1, 1],
  ],

  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],

  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],

  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],

  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],

  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export default class NextPiece {
  constructor(type, cellSize = 22) {
    this.type = type;
    this.cellSize = cellSize;

    this.container = new Container();

    this.draw();
  }

  draw() {
    const shape = SHAPES[this.type];

    const color = COLORS[this.type];

    if (!shape) {
      return;
    }

    const rows = shape.length;

    const columns = shape[0].length;

    const totalWidth = columns * this.cellSize;

    const totalHeight = rows * this.cellSize;

    const offsetX = -totalWidth / 2;

    const offsetY = -totalHeight / 2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        if (!shape[y][x]) {
          continue;
        }

        const block = new Graphics();

        block.rect(0, 0, this.cellSize - 2, this.cellSize - 2);

        block.fill(color);

        block.x = offsetX + x * this.cellSize;

        block.y = offsetY + y * this.cellSize;

        this.container.addChild(block);
      }
    }
  }

  destroy() {
    if (this.container && !this.container.destroyed) {
      this.container.destroy({
        children: true,
      });
    }
  }
}
