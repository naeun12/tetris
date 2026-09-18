/** @format */

class GameTime {
  constructor() {
    this.reset();
  }

  reset() {
    this.startTime = performance.now();
    this.pausedTime = 0;
    this.pauseStart = null;
    this.running = true;
  }

  start() {
    if (this.running) {
      return;
    }

    if (this.pauseStart !== null) {
      this.pausedTime += performance.now() - this.pauseStart;
    }

    this.pauseStart = null;
    this.running = true;
  }

  pause() {
    if (!this.running) {
      return;
    }

    this.pauseStart = performance.now();
    this.running = false;
  }

  getMilliseconds() {
    let now = performance.now();

    if (!this.running && this.pauseStart !== null) {
      now = this.pauseStart;
    }

    return now - this.startTime - this.pausedTime;
  }

  getSeconds() {
    return this.getMilliseconds() / 1000;
  }

  getFormatted() {
    const totalSeconds = Math.floor(this.getSeconds());

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }
}

export default GameTime;
