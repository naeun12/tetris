/** @format */

export const DEFAULT_CONTROLS = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  softDrop: "ArrowDown",
  hardDrop: "Space",
  rotateCW: "ArrowUp",
  rotateCCW: "KeyZ",
  rotate180: "KeyA",
  hold: "KeyC",
  pause: "Escape",
  restart: "KeyR",
};

export const getControls = () => {
  const saved = localStorage.getItem("tetrisControls");

  if (!saved) {
    return { ...DEFAULT_CONTROLS };
  }

  try {
    return {
      ...DEFAULT_CONTROLS,
      ...JSON.parse(saved),
    };
  } catch {
    return { ...DEFAULT_CONTROLS };
  }
};
