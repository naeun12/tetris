/** @format */

import SfxAssetsData from "../data/SfxAssetsData";

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
