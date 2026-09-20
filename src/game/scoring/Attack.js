/** @format */

/** @format */

export const getLineAttack = (lines) => {
  switch (lines) {
    case 0:
      return 0;

    case 1:
      return 0;

    case 2:
      return 1;

    case 3:
      return 2;

    case 4:
      return 4;

    default:
      return 0;
  }
};

export const getTSpinAttack = (lines) => {
  switch (lines) {
    case 0:
      return 0;

    case 1:
      return 2;

    case 2:
      return 4;

    case 3:
      return 6;

    default:
      return 0;
  }
};

export const getTSpinMiniAttack = (lines) => {
  switch (lines) {
    case 0:
      return 0;

    case 1:
      return 1;

    case 2:
      return 2;

    default:
      return 0;
  }
};

export const getSpinAttack = (lines) => {
  switch (lines) {
    case 0:
      return 0;

    case 1:
      return 2;

    case 2:
      return 4;

    case 3:
      return 6;

    case 4:
      return 8;

    default:
      return 0;
  }
};

export const getComboAttack = (combo) => {
  if (combo <= 0) {
    return 0;
  }

  const comboTable = [
    0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9,
    9, 10,
  ];

  if (combo < comboTable.length) {
    return comboTable[combo];
  }

  return 10;
};

export const getPerfectClearAttack = () => {
  return 10;
};

export const getB2BAttack = (attack, b2b) => {
  if (!b2b || attack <= 0) {
    return attack;
  }

  return attack + 1;
};

export const calculateAttack = ({
  lines = 0,
  tSpin = false,
  tSpinMini = false,
  spin = false,
  combo = -1,
  perfectClear = false,
  b2b = false,
}) => {
  let attack = 0;

  if (tSpinMini) {
    attack += getTSpinMiniAttack(lines);
  } else if (tSpin) {
    attack += getTSpinAttack(lines);
  } else if (spin) {
    attack += getSpinAttack(lines);
  } else {
    attack += getLineAttack(lines);
  }

  attack += getComboAttack(combo);

  if (perfectClear) {
    attack += getPerfectClearAttack();
  }

  attack = getB2BAttack(attack, b2b);

  return Math.max(0, attack);
};
