/** @format */

export default class BoardState {
  constructor(columns, rows) {
    this.columns = columns;
    this.rows = rows;

    this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));

    this.boardX = 0;
    this.boardWidth = 0;
    this.boardHeight = 0;

    this.borderLeft = 0;
    this.borderRight = 0;
    this.borderTop = 0;
    this.borderBottom = 0;

    this.onGameOver = null;
  }

  configureRender({
    boardX,
    boardWidth,
    boardHeight,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
  }) {
    this.boardX = boardX;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;

    this.borderLeft = borderLeft;
    this.borderRight = borderRight;
    this.borderTop = borderTop;
    this.borderBottom = borderBottom;
  }

  isInside(x, y) {
    return x >= 0 && x < this.columns && y >= 0 && y < this.rows;
  }

  getCell(x, y) {
    if (!this.isInside(x, y)) {
      return null;
    }

    return this.grid[y][x];
  }

  setCell(x, y, value) {
    if (y < 0) {
      if (this.onGameOver) {
        this.onGameOver();
      }

      return;
    }

    if (!this.isInside(x, y)) {
      return;
    }

    this.grid[y][x] = value;
  }

  isOccupied(x, y) {
    if (x < 0) {
      return true;
    }

    if (x >= this.columns) {
      return true;
    }

    if (y >= this.rows) {
      return true;
    }

    if (y < 0) {
      return false;
    }

    return this.grid[y][x] !== null;
  }

  isGameOver(piece) {
    if (!piece) {
      return false;
    }

    const blocks = piece.blocks ?? piece.cells ?? [];

    for (const block of blocks) {
      const blockX = piece.x + (block.x ?? 0);

      const blockY = piece.y + (block.y ?? 0);

      if (blockY < 0) {
        console.log(`GAME OVER BLOCK -> x:${blockX}, y:${blockY}`);

        return true;
      }
    }

    return false;
  }

  getCompletedLines() {
    const completedLines = [];

    for (let y = this.rows - 1; y >= 0; y--) {
      let full = true;

      for (let x = 0; x < this.columns; x++) {
        if (this.grid[y][x] === null) {
          full = false;
          break;
        }
      }

      if (full) {
        completedLines.push(y);
      }
    }

    return completedLines;
  }

  clearLines() {
    const completedLines = this.getCompletedLines();

    if (completedLines.length === 0) {
      return 0;
    }

    console.log("CLEARING ROWS:", completedLines);

    const fullRows = new Set(completedLines);

    const destroyedSprites = new Set();

    for (const row of completedLines) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.grid[row][x];

        if (!cell) {
          continue;
        }

        const sprite = cell.sprite;

        if (
          sprite &&
          typeof sprite.destroy === "function" &&
          !destroyedSprites.has(sprite)
        ) {
          destroyedSprites.add(sprite);

          if (!sprite.destroyed) {
            sprite.destroy();
          }
        }
      }
    }

    const newGrid = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(null),
    );

    let writeRow = this.rows - 1;

    for (let readRow = this.rows - 1; readRow >= 0; readRow--) {
      if (fullRows.has(readRow)) {
        console.log(`REMOVE ROW ${readRow}`);

        continue;
      }

      for (let x = 0; x < this.columns; x++) {
        const cell = this.grid[readRow][x];

        if (!cell) {
          continue;
        }

        if (cell.sprite && destroyedSprites.has(cell.sprite)) {
          continue;
        }

        newGrid[writeRow][x] = cell;
      }

      if (readRow !== writeRow) {
        console.log(`MOVE ROW ${readRow} -> ${writeRow}`);
      }

      writeRow--;
    }

    this.grid = newGrid;

    this.updateBlockPositions(destroyedSprites);

    console.log(`LINES CLEARED: ${completedLines.length}`);

    return completedLines.length;
  }

  updateBlockPositions(destroyedSprites = new Set()) {
    const gridWidth = this.boardWidth - this.borderLeft - this.borderRight;

    const gridHeight = this.boardHeight - this.borderTop - this.borderBottom;

    const cellWidth = gridWidth / this.columns;

    const cellHeight = gridHeight / this.rows;

    const sprites = new Map();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.grid[y][x];

        if (!cell) {
          continue;
        }

        const sprite = cell.sprite;

        if (!sprite) {
          continue;
        }

        if (destroyedSprites.has(sprite)) {
          continue;
        }

        if (sprite.destroyed) {
          continue;
        }

        if (!sprites.has(sprite)) {
          sprites.set(sprite, {
            x,
            y,
          });
        }
      }
    }

    for (const [sprite, position] of sprites) {
      if (!sprite || sprite.destroyed) {
        continue;
      }

      sprite.x = this.boardX + this.borderLeft + position.x * cellWidth;

      sprite.y = this.borderTop + position.y * cellHeight;
    }
  }

  debugGrid(label = "BOARD") {
    console.log("");

    console.log(`========== ${label} ==========`);

    let header = "    ";

    for (let x = 0; x < this.columns; x++) {
      header += `${x} `;
    }

    console.log(header);

    for (let y = 0; y < this.rows; y++) {
      let row = "";

      for (let x = 0; x < this.columns; x++) {
        row += this.grid[y][x] ? "X " : ". ";
      }

      console.log(`${String(y).padStart(2, "0")}  ${row}`);
    }

    console.log("================================");

    console.log("");
  }

  debugBlocks() {
    console.log("");

    console.log("========== LOCKED BLOCKS ==========");

    let count = 0;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.grid[y][x];

        if (!cell) {
          continue;
        }

        count++;

        console.log(`Block ${count} -> x:${x}, y:${y}, type:${cell.type}`);
      }
    }

    console.log(`Total blocks: ${count}`);

    console.log("===================================");

    console.log("");
  }
}
