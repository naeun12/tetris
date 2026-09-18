/** @format */

import PPS from "../../stats/PPS";
import APM from "../../stats/APM";

class MarathonStats {
  constructor() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.combo = -1;
    this.maxCombo = 0;
    this.backToBack = 0;
    this.maxBackToBack = 0;
    this.tSpins = 0;
    this.tSpinSingles = 0;
    this.tSpinDoubles = 0;
    this.tSpinTriples = 0;
    this.perfectClears = 0;
    this.pps = new PPS();
    this.apm = new APM();
  }

  addPiece(piece = null) {
    this.pps.addPiece();
  }

  addLines(cleared) {
    const count = Number(cleared) || 0;

    if (count <= 0) {
      this.combo = -1;
      return;
    }

    this.lines += count;
    this.combo += 1;

    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    this.updateLevel();
  }

  addScore(points) {
    const value = Number(points) || 0;
    this.score += value;
  }

  addAttack(amount = 0) {
    const value = Math.max(0, Number(amount) || 0);

    if (value <= 0) {
      return;
    }

    this.apm.addAttack(value);
  }

  updateLevel() {
    const newLevel = Math.floor(this.lines / 10) + 1;

    this.level = newLevel;
  }

  addCombo() {
    this.combo += 1;

    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
  }

  resetCombo() {
    this.combo = -1;
  }

  addBackToBack() {
    this.backToBack += 1;

    if (this.backToBack > this.maxBackToBack) {
      this.maxBackToBack = this.backToBack;
    }
  }

  setBackToBack(value = 0) {
    const count = Math.max(0, Number(value) || 0);

    this.backToBack = count;

    if (this.backToBack > this.maxBackToBack) {
      this.maxBackToBack = this.backToBack;
    }
  }

  resetBackToBack() {
    this.backToBack = 0;
  }

  addTSpin(lines = 0) {
    const cleared = Number(lines) || 0;

    this.tSpins += 1;

    if (cleared === 1) {
      this.tSpinSingles += 1;
    } else if (cleared === 2) {
      this.tSpinDoubles += 1;
    } else if (cleared === 3) {
      this.tSpinTriples += 1;
    }
  }

  addPerfectClear() {
    this.perfectClears += 1;
  }

  getPPS() {
    return this.pps.getValue();
  }

  getFormattedPPS() {
    return this.pps.getFormatted();
  }

  getAPM() {
    return this.apm.getValue();
  }

  getFormattedAPM() {
    return this.apm.getFormatted();
  }

  getStats() {
    return {
      score: this.score,
      lines: this.lines,
      level: this.level,

      pieces: this.pps.getPieces(),
      pps: this.pps.getValue(),
      ppsFormatted: this.pps.getFormatted(),

      attack: this.apm.getAttack(),
      apm: this.apm.getValue(),
      apmFormatted: this.apm.getFormatted(),

      combo: this.combo,
      maxCombo: this.maxCombo,

      backToBack: this.backToBack,
      maxBackToBack: this.maxBackToBack,

      tSpins: this.tSpins,
      tSpinSingles: this.tSpinSingles,
      tSpinDoubles: this.tSpinDoubles,
      tSpinTriples: this.tSpinTriples,

      perfectClears: this.perfectClears,
    };
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this.level = 1;

    this.combo = -1;
    this.maxCombo = 0;

    this.backToBack = 0;
    this.maxBackToBack = 0;

    this.tSpins = 0;
    this.tSpinSingles = 0;
    this.tSpinDoubles = 0;
    this.tSpinTriples = 0;

    this.perfectClears = 0;

    this.pps.reset();
    this.apm.reset();
  }
}

export default MarathonStats;
