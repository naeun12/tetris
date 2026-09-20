/** @format */

import { calculateAttack } from "../scoring/Attack";

export const calculateBattleAttack = ({
  lines = 0,
  tSpin = false,
  tSpinMini = false,
  spin = false,
  combo = -1,
  perfectClear = false,
  b2b = false,
}) => {
  return calculateAttack({
    lines,
    tSpin,
    tSpinMini,
    spin,
    combo,
    perfectClear,
    b2b,
  });
};

export const resolveAttack = ({ attacker, defender, battleState, attack }) => {
  if (!battleState) {
    return {
      attackSent: 0,
      garbageCancelled: 0,
    };
  }

  if (attack <= 0) {
    return {
      attackSent: 0,
      garbageCancelled: 0,
    };
  }

  const pendingGarbage = battleState.getGarbage(defender);

  const cancelled = battleState.cancelGarbage(defender, attack);

  const remainingAttack = attack - cancelled;

  if (remainingAttack > 0) {
    battleState.addGarbage(defender, remainingAttack);
  }

  battleState[attacker].attack += attack;

  return {
    attackSent: remainingAttack,
    garbageCancelled: cancelled,
  };
};
