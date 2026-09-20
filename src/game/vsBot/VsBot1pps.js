/** @format */ import BotBrain from "./BotBrain";
class VsBot1pps {
  constructor({
    pps = 1,
    getBoard,
    getPiece,
    rotate,
    movePiece,
    hardDrop,
  } = {}) {
    this.pps = pps;
    this.getBoard = getBoard;
    this.getPiece = getPiece;
    this.rotate = rotate;
    this.movePiece = movePiece;
    this.hardDrop = hardDrop;
    this.brain = new BotBrain();
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
    if (
      typeof this.getBoard !== "function" ||
      typeof this.getPiece !== "function"
    ) {
      console.error("VsBot1pps: getBoard/getPiece is missing.");
      this.stop();
      return;
    }
    const board = this.getBoard();
    const piece = this.getPiece();
    if (!board || !piece) {
      return;
    }
    const bestMove = this.brain.chooseBestMove(board, piece);
    if (!bestMove) {
      return;
    }
    this.busy = true;
    this.executeMove(bestMove);
  }
  executeMove(move) {
    if (
      typeof this.rotate !== "function" ||
      typeof this.movePiece !== "function" ||
      typeof this.hardDrop !== "function"
    ) {
      console.error("VsBot1pps: rotate/movePiece/hardDrop is missing.");
      this.busy = false;
      return;
    }
    const piece = this.getPiece();
    if (!piece) {
      this.busy = false;
      return;
    }
    const currentRotation = Number(piece.rotation || 0);
    let rotations = (move.rotation - currentRotation + 4) % 4;
    while (rotations > 0) {
      this.rotate(1);
      rotations--;
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
        for (let i = 0; i < Math.abs(difference); i++) {
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
export default VsBot1pps;
