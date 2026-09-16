/** @format */

import Collision from "../collision/Collision";

export default class HardDrop {
  constructor(piece, config, boardState) {
    this.piece = piece;
    this.config = config;
    this.boardState = boardState;
  }

  execute() {
    while (
      Collision.canMove(
        this.piece,
        this.boardState,
        this.piece.x,
        this.piece.y + 1,
      )
    ) {
      this.piece.y += 1;
    }

    this.piece.updatePosition();

    if (this.piece.onLand) {
      this.piece.onLand();
    }
  }
}
