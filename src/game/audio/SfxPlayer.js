/** @format */

import SfxAssetsData from "../data/SfxAssetsData";
import CharacterData from "../data/CharacterData";

export const playSfx = (type) => {
  const asset = SfxAssetsData[type];

  if (!asset) {
    console.error("SFX NOT FOUND:", type);
    console.log("Available:", Object.keys(SfxAssetsData));
    return;
  }

  const audio = new Audio();

  audio.src = asset.sound;
  audio.volume = 1;
  audio.load();

  audio.oncanplaythrough = () => {
    audio
      .play()
      .then(() => {})
      .catch((error) => {
        console.error("SFX PLAY FAILED:", error);
      });
  };

  audio.onerror = (error) => {
    console.error("SFX LOAD FAILED:", asset.sound);
    console.error(error);
  };
};
export const playCharacterSound = (soundType) => {
  console.log("CHARACTER SOUND REQUEST:", soundType);

  const character = CharacterData[0];

  if (!character) {
    console.error("CHARACTER NOT FOUND");
    return;
  }

  console.log("CHARACTER:", character.characterName);
  console.log("VOICE DATA:", character.voice);

  const sound = character.voice?.[soundType];

  if (!sound) {
    console.error(
      "CHARACTER SOUND NOT FOUND:",
      character.characterName,
      soundType,
    );
    return;
  }

  const audio = new Audio(sound);
  audio.volume = 1;

  audio.play().catch((error) => {
    console.error("CHARACTER SOUND PLAY FAILED:", error);
  });

  audio.onerror = () => {
    console.error("CHARACTER SOUND LOAD FAILED:", sound);
  };
};
