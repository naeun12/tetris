/** @format */

class VSScore {
  constructor() {
    this.value = 0;
  }

  reset() {
    this.value = 0;
  }

  add(amount) {
    this.value += Math.max(0, Number(amount) || 0);
  }

  subtract(amount) {
    this.value -= Math.max(0, Number(amount) || 0);
  }

  set(amount) {
    this.value = Math.max(0, Number(amount) || 0);
  }

  getValue() {
    return this.value;
  }
}

export default VSScore;
