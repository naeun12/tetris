/** @format */

import CharacterModel from "../model/CharacterModel";

const CharacterData = [
  new CharacterModel(
    1,
    "Cyrus",
    "A calm and precise player who specializes in defense and long combos.",
    "/images/characters/astra.png",
    [
      {
        skillId: 1,
        skillName: "Iron Shield",
        description: "Reduces incoming damage from opponents.",
        effect: "damage_reduction",
        value: 1,
      },
    ],
    {
      tetris: "/audio/sfx/character/tiny/TETRIS.mp3",
      tSpin: "/audio/sfx/character/tiny/TSPIN.mp3",
      perfectClear: "/audio/sfx/character/tiny/PERFECT CLEAR!.mp3",
      gameOver: "/audio/sfx/character/tiny/TSPIN.mp3",
    },
  ),

  new CharacterModel(
    2,
    "Tiny",
    "A fast player who gains advantages from maintaining combos.",
    "/images/characters/luna.png",
    [
      {
        skillId: 2,
        skillName: "Combo Master",
        description:
          "Increases attack power when performing consecutive clears.",
        effect: "combo_bonus",
        value: 1,
      },
    ],
    {
      tetris: "/audio/sfx/characters/tiny/TETRIS.mp3",
      tSpin: "/audio/sfx/characters/tiny/TETRIS.mp3",
      perfectClear: "/audio/characters/luna/perfect-clear.mp3",
      gameOver: "/audio/characters/luna/game-over.mp3",
    },
  ),

  new CharacterModel(
    3,
    "Doming - si",
    "An aggressive player focused on powerful T-Spins and back-to-back attacks.",
    "/images/characters/raven.png",
    [
      {
        skillId: 3,
        skillName: "Back-to-Back",
        description:
          "Provides an additional attack bonus while maintaining B2B.",
        effect: "b2b_bonus",
        value: 1,
      },
    ],
    {
      tetris: "/audio/characters/raven/tetris.mp3",
      tSpin: "/audio/characters/raven/tspin.mp3",
      perfectClear: "/audio/characters/raven/perfect-clear.mp3",
      gameOver: "/audio/characters/raven/game-over.mp3",
    },
  ),
];

export default CharacterData;
