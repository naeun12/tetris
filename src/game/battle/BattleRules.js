/** @format */

export const BATTLE_RULES = {
  boardWidth: 10,
  boardHeight: 20,

  garbage: {
    enabled: true,
    randomHole: true,
  },

  combo: {
    enabled: true,
  },

  backToBack: {
    enabled: true,
  },

  perfectClear: {
    enabled: true,
  },

  spin: {
    enabled: true,
  },

  tSpin: {
    enabled: true,
  },

  hold: {
    enabled: true,
  },

  gameOver: {
    enabled: true,
  },
};

export const isBattleOver = (battleState) => {
  if (!battleState) {
    return false;
  }

  return !battleState.player.alive || !battleState.enemy.alive;
};

export const getWinner = (battleState) => {
  if (!battleState) {
    return null;
  }

  if (!battleState.player.alive && battleState.enemy.alive) {
    return "enemy";
  }

  if (!battleState.enemy.alive && battleState.player.alive) {
    return "player";
  }

  return null;
};
