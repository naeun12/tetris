/** @format */
import SoloGameMenuModel from "../models/SoloGameMenuModel";

const SoloGameMenuData = [
  new SoloGameMenuModel(
    "Marathon Mode",
    "Classic endless Tetris. Keep going until you top out as the difficulty steadily increases.",
    "/solo/marathon",
  ),

  new SoloGameMenuModel(
    "40-Line Sprint",
    "Clear 40 lines as fast as possible. Test your speed and efficiency!",
    "/solo/time-attack",
  ),

  new SoloGameMenuModel(
    "Ultra Attack",
    "Rack up the highest score possible within a strict 2-minute time limit.",
    "/solo/ultra",
  ),

  new SoloGameMenuModel(
    "Free Play / Practice",
    "No pressure or time limits. Focus on your movement, stacking, combos, T-Spins, and clean placements.",
    "/solo/practice",
  ),
];

export default SoloGameMenuData;
