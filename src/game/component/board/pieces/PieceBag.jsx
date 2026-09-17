import { PIECE_TYPES } from './Pieces';

const shuffled = (types) => {
  const arr = [...types];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default class PieceBag {
  constructor() {
    this.queue = shuffled(PIECE_TYPES);
  }

  _ensure(count) {
    while (this.queue.length < count) {
      this.queue.push(...shuffled(PIECE_TYPES));
    }
  }

  next() {
    this._ensure(1);
    return this.queue.shift();
  }

  peek(count = 3) {
    this._ensure(count);
    return this.queue.slice(0, count);
  }
}