/** @format */

export default class Collision {
  static canMove(piece, boardState, newX, newY) {
    for (let row = 0; row < piece.heightCells; row++) {
      for (let col = 0; col < piece.widthCells; col++) {
        if (!piece.cells[row]?.[col]) {
          continue;
        }

        const x = newX + col;

        const y = newY + row;

        // Left / right / bottom
        if (x < 0 || x >= boardState.columns || y >= boardState.rows) {
          return false;
        }

        // Existing block
        if (y >= 0 && boardState.isOccupied(x, y)) {
          return false;
        }
      }
    }

    return true;
  }

  static canMoveDown(piece, boardState) {
    return this.canMove(piece, boardState, piece.x, piece.y + 1);
  }
}
