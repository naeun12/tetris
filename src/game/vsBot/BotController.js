/** @format */

class BotController {
  constructor({
    brain,
    getBoard,
    getPiece,
    rotate,
    movePiece,
    hardDrop,
    pps = 1,
  }) {
    this.brain = brain;

    this.getBoard = getBoard;
    this.getPiece = getPiece;

    this.rotate = rotate;
    this.movePiece = movePiece;
    this.hardDrop = hardDrop;

    this.pps = pps;

    this.timer = null;
    this.running = false;
    this.busy = false;
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;

    this.run();

    const interval = 1000 / Math.max(0.1, this.pps);

    this.timer = setInterval(() => {
      this.run();
    }, interval);
  }

  stop() {
    this.running = false;
    this.busy = false;

    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  run() {
    if (!this.running || this.busy) {
      return;
    }

    const board = this.getBoard();
    const piece = this.getPiece();

    if (!board || !piece) {
      return;
    }

    const move = this.brain.chooseBestMove(board, piece);

    if (!move) {
      return;
    }

    this.busy = true;

    this.executeMove(move);
  }

  executeMove(move) {
    const currentRotation = Number(this.getPiece()?.rotation || 0);

    let rotationCount = (move.rotation - currentRotation + 4) % 4;

    while (rotationCount > 0) {
      this.rotate(1);
      rotationCount--;
    }

    setTimeout(() => {
      if (!this.running) {
        return;
      }

      const currentPiece = this.getPiece();

      if (!currentPiece) {
        this.busy = false;
        return;
      }

      const difference = move.x - currentPiece.x;

      if (difference !== 0) {
        const direction = difference > 0 ? 1 : -1;

        const steps = Math.abs(difference);

        for (let i = 0; i < steps; i++) {
          this.movePiece(direction, 0);
        }
      }

      setTimeout(() => {
        if (!this.running) {
          return;
        }

        this.hardDrop();
        this.busy = false;
      }, 50);
    }, 50);
  }
}

export default BotController;
