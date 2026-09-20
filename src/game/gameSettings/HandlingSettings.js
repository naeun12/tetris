/** @format */

export const DEFAULT_HANDLING = {
  arr: 0, // Auto Repeat Rate (in frames). 0 = instant / teleports to wall
  das: 10, // Delayed Auto Shift (in frames)
  dcd: 0, // DAS Cut Delay (in frames)
  sdf: 40, // Soft Drop Factor (multiplier, e.g., 40x or Infinity)
};

export const HANDLING_LIMITS = {
  arr: {
    min: 0,
    max: 40, // Max frames typically capped around 40f (~667ms)
  },

  das: {
    min: 0,
    max: 200, // Frames
  },

  dcd: {
    min: 0,
    max: 40, // Frames
  },

  sdf: {
    min: 1,
    max: 100, // Multiplier (or use a special representation/alias if you support Infinity)
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
