/** @format */

let music = null;
export const playMusic = () => {
  if (!music) {
    music = new Audio(
      "/music/gregorquendel-tetris-theme-korobeiniki-rearranged-arr-for-strings-185592.mp3",
    );

    music.loop = true;
    music.volume = 0.5;
  }

  music.play().catch((error) => {
    console.log("Music could not play:", error);
  });
};

export const setMusicVolume = (volume) => {
  if (music) {
    music.volume = volume;
  }
};
