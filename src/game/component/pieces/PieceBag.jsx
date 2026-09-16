// Classic "7-bag" randomizer: every piece appears exactly once per
// bag before the next bag is shuffled.

import { PIECE_NAMES } from './Pieces.jsx';

export class PieceBag {
  constructor() {
    this.bag = [];
    this.refill();
  }

  refill() {
    this.bag = PIECE_NAMES.slice();
    // Fisher–Yates shuffle
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  /** Returns the next piece name (refills the bag when empty). */
  next() {
    if (this.bag.length === 0) this.refill();
    return this.bag.pop();
  }
}
