/** @format */

export class BattleState {
  constructor() {
    this.player = this.createPlayerState();
    this.enemy = this.createPlayerState();

    this.gameOver = false;
    this.winner = null;
  }

  createPlayerState() {
    return {
      garbageQueue: 0,
      combo: -1,
      backToBack: false,
      attack: 0,
      alive: true,
    };
  }

  reset() {
    this.player = this.createPlayerState();
    this.enemy = this.createPlayerState();

    this.gameOver = false;
    this.winner = null;
  }

  addGarbage(target, amount) {
    if (!this[target] || amount <= 0) return;

    this[target].garbageQueue += amount;
  }

  cancelGarbage(target, amount) {
    if (!this[target] || amount <= 0) return 0;

    const cancelled = Math.min(this[target].garbageQueue, amount);

    this[target].garbageQueue -= cancelled;

    return cancelled;
  }

  getGarbage(target) {
    return this[target]?.garbageQueue ?? 0;
  }

  setAlive(target, alive) {
    if (!this[target]) return;

    this[target].alive = alive;

    if (!alive) {
      this.gameOver = true;
      this.winner = target === "player" ? "enemy" : "player";
    }
  }
}
