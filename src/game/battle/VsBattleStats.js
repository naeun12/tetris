/** @format */

/** @format */

class VsBattleStats {
  constructor() {
    this.score = 0;
    this.lines = 0;
    this.pieces = 0;
    this.level = 1;

    this.combo = -1;
    this.backToBack = 0;

    this.attack = 0;
    this.garbage = 0;

    this.tetris = 0;
    this.tSpin = 0;
    this.perfectClear = 0;

    this.gameOver = false;
  }

  addPiece() {
    this.pieces += 1;
  }

  addScore(amount) {
    this.score += Number(amount) || 0;
  }

  addLines(amount) {
    this.lines += Number(amount) || 0;
  }

  setCombo(combo) {
    this.combo = combo;
  }

  addBackToBack() {
    this.backToBack += 1;
  }

  resetBackToBack() {
    this.backToBack = 0;
  }

  setBackToBack(value) {
    this.backToBack = value ? 1 : 0;
  }

  addAttack(amount) {
    this.attack += Number(amount) || 0;
  }

  addGarbage(amount) {
    this.garbage += Number(amount) || 0;
  }

  removeGarbage(amount) {
    this.garbage = Math.max(0, this.garbage - (Number(amount) || 0));
  }

  addTetris() {
    this.tetris += 1;
  }

  addTSpin() {
    this.tSpin += 1;
  }

  addPerfectClear() {
    this.perfectClear += 1;
  }

  setGameOver(value) {
    this.gameOver = Boolean(value);
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.pieces = 0;
    this.level = 1;

    this.combo = -1;
    this.backToBack = 0;

    this.attack = 0;
    this.garbage = 0;

    this.tetris = 0;
    this.tSpin = 0;
    this.perfectClear = 0;

    this.gameOver = false;
  }
}

export default VsBattleStats;
