/** @format */

class PPS {
  constructor() {
    this.pieces = 0;
    this.startTime = performance.now();
  }

  reset() {
    this.pieces = 0;
    this.startTime = performance.now();
  }

  addPiece(count = 1) {
    const value = Math.max(0, Number(count) || 0);

    this.pieces += value;
  }

  getPieces() {
    return this.pieces;
  }

  getSeconds() {
    return (performance.now() - this.startTime) / 1000;
  }

  getValue() {
    const seconds = this.getSeconds();

    if (seconds <= 0) {
      return 0;
    }

    return this.pieces / seconds;
  }

  getFormatted() {
    return this.getValue().toFixed(2);
  }

  getStats() {
    const stats = {
      pieces: this.getPieces(),
      seconds: this.getSeconds(),
      pps: this.getValue(),
      formatted: this.getFormatted(),
    };

    console.log("[PPS] Stats", stats);

    return stats;
  }
}

export default PPS;
