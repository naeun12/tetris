/** @format */
import SfxAssetsModel from "../model/SfxAssetsModel";
import CharacterData from "./CharacterData";

const SfxAssetsData = {
  drop: new SfxAssetsModel(
    "Default Sound",
    "Drop",
    "/audio/sfx/default/drop.mp3",
  ),

  gameOver: new SfxAssetsModel(
    "Default Sound",
    "Game Over",
    "/audio/sfx/default/game_over.mp3",
  ),

  hold: new SfxAssetsModel(
    "Default Sound",
    "Hold",
    "/audio/sfx/default/hold.mp3",
  ),

  rotation: new SfxAssetsModel(
    "Default Sound",
    "Rotation",
    "/audio/sfx/default/rotation.mp3",
  ),

  tetrisClear: new SfxAssetsModel(
    "Default Sound",
    "Tetris Clear",
    "/audio/sfx/default/tetris_clear.mp3",
  ),
};

export default SfxAssetsData;
