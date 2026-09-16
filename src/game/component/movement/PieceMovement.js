/** @format */

import Collision from "../collision/Collision";

export default class PieceMovement {
  constructor(piece, config, boardState) {
    this.piece = piece;
    this.config = config;
    this.boardState = boardState;
  }

  moveLeft() {
    const canMove = Collision.canMove(
      this.piece,
      this.boardState,
      this.piece.x - 1,
      this.piece.y,
    );

    if (canMove) {
      this.piece.x--;

      this.piece.updatePosition();

      if (this.piece.onMove) {
        this.piece.onMove();
      }
    }
  }

  moveRight() {
    const canMove = Collision.canMove(
      this.piece,
      this.boardState,
      this.piece.x + 1,
      this.piece.y,
    );

    if (canMove) {
      this.piece.x++;

      this.piece.updatePosition();

      if (this.piece.onMove) {
        this.piece.onMove();
      }
    }
  }
}
