/** @format */

// ==========================================
// MINI SPIN SCORE TABLE
// ==========================================

export const MINI_SPIN_SCORE = {
  0: 100,
  1: 200,
  2: 400,
  3: 600,
};

// ==========================================
// GET MINI SPIN SCORE
// ==========================================

export const getMiniSpinScore = (linesCleared = 0) => {
  const lines = Number(linesCleared);

  return MINI_SPIN_SCORE[lines] ?? 0;
};

// ==========================================
// SPIN DETECTION
// ==========================================

export const isSpin = (clearType) => {
  if (!clearType) return false;

  return clearType.toUpperCase().includes("SPIN");
};

// ==========================================
// T-SPIN DETECTION
// ==========================================

export const isTSpin = (pieceType, clearType) => {
  if (!pieceType || !clearType) return false;

  return (
    pieceType.toUpperCase() === "T" && clearType.toUpperCase().includes("SPIN")
  );
};

// ==========================================
// MINI SPIN DETECTION
// ==========================================

export const isMiniSpin = (pieceType, clearType) => {
  if (!pieceType || !clearType) return false;

  const type = pieceType.toUpperCase();
  const clear = clearType.toUpperCase();

  return type !== "T" && clear.includes("SPIN");
};
