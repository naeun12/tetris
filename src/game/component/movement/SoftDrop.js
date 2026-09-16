/** @format */

import Collision from "../collision/Collision";

export default class SoftDrop {
  constructor(piece, config, boardState) {
    this.piece = piece;
    this.config = config;
    this.boardState = boardState;
  }

  execute() {
    const newY = this.piece.y + 1;

    if (Collision.canMove(this.piece, this.boardState, this.piece.x, newY)) {
      this.piece.y = newY;
      this.piece.updatePosition();

      return true;
    }

    if (this.piece.onLand) {
      this.piece.onLand();
    }

    return false;
  }
}
