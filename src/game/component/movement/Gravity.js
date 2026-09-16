/** @format */

import Collision from "../collision/Collision";

export default class Gravity {
  constructor(piece, config, boardState) {
    this.piece = piece;
    this.config = config;
    this.boardState = boardState;

    this.interval = config.gravity.interval;

    // Gravity timer
    this.timer = 0;

    // 500ms lock delay
    this.lockDelay = 500;
    this.lockTimer = 0;

    this.isGrounded = false;

    // Real-time clock
    this.lastTime = performance.now();

    console.log("[Gravity] CREATED");
    console.log("[Gravity] Interval:", this.interval);
  }

  update() {
    if (!this.config.gravity.enabled) {
      return;
    }

    if (!this.piece) {
      return;
    }

    // ==========================================
    // REAL ELAPSED TIME
    // ==========================================

    const now = performance.now();

    const deltaMS = now - this.lastTime;

    this.lastTime = now;

    // ==========================================
    // ADD REAL TIME
    // ==========================================

    this.timer += deltaMS;

    // ==========================================
    // GRAVITY
    // ==========================================

    while (this.timer >= this.interval) {
      this.timer -= this.interval;

      const newY = this.piece.y + 1;

      const canMove = Collision.canMove(
        this.piece,
        this.boardState,
        this.piece.x,
        newY,
      );

      if (canMove) {
        this.piece.y = newY;

        this.piece.updatePosition();

        this.isGrounded = false;
        this.lockTimer = 0;

        continue;
      }

      // Cannot move down
      this.isGrounded = true;

      break;
    }

    // ==========================================
    // LOCK DELAY
    // ==========================================

    if (this.isGrounded) {
      const canMoveDown = Collision.canMove(
        this.piece,
        this.boardState,
        this.piece.x,
        this.piece.y + 1,
      );

      if (canMoveDown) {
        this.isGrounded = false;
        this.lockTimer = 0;

        return;
      }

      this.lockTimer += deltaMS;

      if (this.lockTimer >= this.lockDelay) {
        this.lockTimer = 0;
        this.isGrounded = false;

        console.log("[Gravity] LOCK");

        if (this.piece.onLand) {
          this.piece.onLand();
        }
      }
    }
  }

  // ==========================================
  // RESET
  // ==========================================

  reset() {
    this.timer = 0;
    this.lockTimer = 0;
    this.isGrounded = false;

    this.lastTime = performance.now();
  }

  // ==========================================
  // RESET LOCK DELAY
  // ==========================================

  resetLockDelay() {
    this.lockTimer = 0;
    this.isGrounded = false;
  }
}
