/** @format */

export const isB2BEligible = (clearType) => {
  if (!clearType) {
    return false;
  }

  const type = String(clearType).toUpperCase();

  if (type === "TETRIS") {
    return true;
  }

  if (type.includes("SPIN")) {
    return true;
  }

  return false;
};

export const updateB2B = (currentB2B, clearType) => {
  const current = Number(currentB2B) || 0;

  if (!isB2BEligible(clearType)) {
    return {
      active: false,
      count: 0,
    };
  }

  return {
    active: true,
    count: current + 1,
  };
};
