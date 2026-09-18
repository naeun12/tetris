/** @format */

class APM {
  constructor() {
    this.attack = 0;
    this.startTime = performance.now();
  }

  reset() {
    this.attack = 0;
    this.startTime = performance.now();

    console.log("[APM] Reset");
  }

  addAttack(amount = 1) {
    const value = Math.max(0, Number(amount) || 0);

    if (value <= 0) {
      return;
    }

    this.attack += value;

    console.log("[APM] Attack Added", {
      added: value,
      totalAttack: this.attack,
      apm: this.getFormatted(),
    });
  }

  getAttack() {
    return this.attack;
  }

  getSeconds() {
    return (performance.now() - this.startTime) / 1000;
  }

  getValue() {
    const seconds = this.getSeconds();

    if (seconds <= 0) {
      return 0;
    }

    return (this.attack / seconds) * 60;
  }

  getFormatted() {
    return this.getValue().toFixed(0);
  }

  getStats() {
    const stats = {
      attack: this.getAttack(),
      seconds: this.getSeconds(),
      apm: this.getValue(),
      formatted: this.getFormatted(),
    };

    console.log("[APM] Stats", stats);

    return stats;
  }
}

export default APM;
