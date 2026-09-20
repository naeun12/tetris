/** @format */

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../component/board/config/BoardConfig";

export const normalizeGarbage = (amount) => {
  return Math.max(0, Math.floor(Number(amount) || 0));
};

export const clampHole = (hole) => {
  return Math.max(0, Math.min(BOARD_WIDTH - 1, Math.floor(Number(hole) || 0)));
};

export const createGarbageRow = (hole = null) => {
  const holeX =
    hole === null ? Math.floor(Math.random() * BOARD_WIDTH) : clampHole(hole);

  return Array.from({ length: BOARD_WIDTH }, (_, x) =>
    x === holeX ? null : "garbage",
  );
};

export const createGarbageBatch = (amount, hole = null) => {
  const count = normalizeGarbage(amount);

  if (count <= 0) {
    return {
      amount: 0,
      hole: null,
    };
  }

  const batchHole =
    hole === null ? Math.floor(Math.random() * BOARD_WIDTH) : clampHole(hole);

  return {
    amount: count,
    hole: batchHole,
  };
};

export const queueGarbage = (queue, amount) => {
  const count = normalizeGarbage(amount);

  if (count <= 0) {
    return Array.isArray(queue) ? [...queue] : [];
  }

  const currentQueue = Array.isArray(queue) ? [...queue] : [];

  currentQueue.push(createGarbageBatch(count));

  return currentQueue;
};

export const getGarbageAmount = (queue) => {
  if (!Array.isArray(queue)) {
    return normalizeGarbage(queue);
  }

  return queue.reduce(
    (total, batch) => total + normalizeGarbage(batch?.amount),
    0,
  );
};

export const cancelGarbage = (queue, outgoing) => {
  const currentQueue = Array.isArray(queue)
    ? queue.map((batch) => ({
        amount: normalizeGarbage(batch.amount),
        hole: clampHole(batch.hole),
      }))
    : [];

  let remainingOutgoing = normalizeGarbage(outgoing);

  let cancelled = 0;

  while (remainingOutgoing > 0 && currentQueue.length > 0) {
    const batch = currentQueue[0];

    const removeAmount = Math.min(batch.amount, remainingOutgoing);

    batch.amount -= removeAmount;

    remainingOutgoing -= removeAmount;

    cancelled += removeAmount;

    if (batch.amount <= 0) {
      currentQueue.shift();
    }
  }

  return {
    cancelled,
    remainingIncoming: getGarbageAmount(currentQueue),
    remainingOutgoing,
    queue: currentQueue,
  };
};

export const consumeGarbage = (queue, amount) => {
  const currentQueue = Array.isArray(queue)
    ? queue.map((batch) => ({
        amount: normalizeGarbage(batch.amount),
        hole: clampHole(batch.hole),
      }))
    : [];

  let remaining = normalizeGarbage(amount);

  let consumed = 0;

  while (remaining > 0 && currentQueue.length > 0) {
    const batch = currentQueue[0];

    const removeAmount = Math.min(batch.amount, remaining);

    batch.amount -= removeAmount;

    remaining -= removeAmount;

    consumed += removeAmount;

    if (batch.amount <= 0) {
      currentQueue.shift();
    }
  }

  return {
    queue: currentQueue,
    consumed,
  };
};

export const addGarbage = (board, queue) => {
  const batches = Array.isArray(queue)
    ? queue
    : normalizeGarbage(queue) > 0
      ? [createGarbageBatch(queue)]
      : [];

  const totalGarbage = getGarbageAmount(batches);

  if (totalGarbage <= 0) {
    return {
      board: board.map((row) => [...row]),
      toppedOut: false,
      amount: 0,
    };
  }

  const safeCount = Math.min(totalGarbage, BOARD_HEIGHT);

  const rowsToPushOut = board.slice(0, safeCount);

  const toppedOut = rowsToPushOut.some((row) =>
    row.some((cell) => cell !== null && cell !== undefined && cell !== ""),
  );

  const garbageRows = [];

  let remainingRows = safeCount;

  for (const batch of batches) {
    if (remainingRows <= 0) {
      break;
    }

    const count = Math.min(normalizeGarbage(batch.amount), remainingRows);

    for (let i = 0; i < count; i++) {
      garbageRows.push(createGarbageRow(batch.hole));
    }

    remainingRows -= count;
  }

  const shiftedBoard = board.slice(safeCount);

  const nextBoard = [...shiftedBoard, ...garbageRows];

  return {
    board: nextBoard.slice(-BOARD_HEIGHT),
    toppedOut,
    amount: garbageRows.length,
  };
};
