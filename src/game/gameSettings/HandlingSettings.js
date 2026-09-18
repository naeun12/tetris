/** @format */

export const DEFAULT_HANDLING = {
  arr: 0,
  das: 100,
  dcd: 50,
  sdf: 20,
};

export const HANDLING_LIMITS = {
  arr: {
    min: 0,
    max: 100,
  },

  das: {
    min: 0,
    max: 1000,
  },

  dcd: {
    min: 0,
    max: 100,
  },

  sdf: {
    min: 1,
    max: 40,
  },
};

const clamp = (value, min, max) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, number));
};

const normalizeHandling = (settings = {}) => {
  return {
    arr: clamp(
      settings.arr ?? DEFAULT_HANDLING.arr,
      HANDLING_LIMITS.arr.min,
      HANDLING_LIMITS.arr.max,
    ),

    das: clamp(
      settings.das ?? DEFAULT_HANDLING.das,
      HANDLING_LIMITS.das.min,
      HANDLING_LIMITS.das.max,
    ),

    dcd: clamp(
      settings.dcd ?? DEFAULT_HANDLING.dcd,
      HANDLING_LIMITS.dcd.min,
      HANDLING_LIMITS.dcd.max,
    ),

    sdf: clamp(
      settings.sdf ?? DEFAULT_HANDLING.sdf,
      HANDLING_LIMITS.sdf.min,
      HANDLING_LIMITS.sdf.max,
    ),
  };
};

export const getHandlingSettings = () => {
  const saved = localStorage.getItem("tetrisHandling");

  if (!saved) {
    return {
      ...DEFAULT_HANDLING,
    };
  }

  try {
    const parsed = JSON.parse(saved);

    return normalizeHandling({
      ...DEFAULT_HANDLING,
      ...parsed,
    });
  } catch {
    return {
      ...DEFAULT_HANDLING,
    };
  }
};

export const saveHandlingSettings = (settings) => {
  const current = getHandlingSettings();

  const normalized = normalizeHandling({
    ...current,
    ...settings,
  });

  localStorage.setItem("tetrisHandling", JSON.stringify(normalized));
};

export const resetHandlingSettings = () => {
  localStorage.removeItem("tetrisHandling");
};
