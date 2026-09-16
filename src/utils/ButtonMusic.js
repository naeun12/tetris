/** @format */

let buttonMusic = null;
export const playButtonMusic = () => {
  if (!buttonMusic) {
    buttonMusic = new Audio(
      "/music/buttonMusic/freesound_community-game-start-6104.mp3",
    );

    buttonMusic.loop = false;
    buttonMusic.volume = 0.5;
  }
  buttonMusic.play().catch((error) => {
    console.log("Button music could not play:", error);
  });
};
export const setMusicVolume = (volume) => {
  if (buttonMusic) {
    buttonMusic.volume = volume;
  }
};
