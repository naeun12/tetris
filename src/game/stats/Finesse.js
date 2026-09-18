/** @format */

class Finesse {
  constructor() {
    this.total = 0;
    this.perfect = 0;
  }

  reset() {
    this.total = 0;
    this.perfect = 0;
  }

  add(perfect = false) {
    this.total++;

    if (perfect) {
      this.perfect++;
    }
  }

  getTotal() {
    return this.total;
  }

  getPerfect() {
    return this.perfect;
  }

  getValue() {
    if (this.total <= 0) {
      return 100;
    }

    return (this.perfect / this.total) * 100;
  }

  getFormatted() {
    return `${this.getValue().toFixed(1)}%`;
  }
}

export default Finesse;
