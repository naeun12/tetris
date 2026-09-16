/** @format */

import MenuModel from "../models/MenuModel";

export const HomepageMenuData = [
  new MenuModel(
    "Multiplayer",
    "Battle against real players in real-time Tetris matches.",
    "/multiplayer",
    "⚔",
  ),

  new MenuModel(
    "Solo Game",
    "Play classic Tetris and improve your skills.",
    "/solo",
    "◆",
  ),

  new MenuModel(
    "VS Bot",
    "Challenge an AI opponent and test your abilities.",
    "/vs-bot",
    "♟",
  ),

  new MenuModel(
    "Guild",
    "Join a guild, compete with friends, and climb the guild rankings.",
    "/guild",
    "♜",
  ),

  new MenuModel(
    "Inventory",
    "Manage your skins, effects, themes, avatars, and other items.",
    "/inventory",
    "▣",
  ),

  new MenuModel(
    "Leaderboards",
    "Check the rankings and see who dominates the game.",
    "/leaderboards",
    "♛",
  ),

  new MenuModel(
    "Settings",
    "Customize your gameplay, controls, audio, and preferences.",
    "/settings",
    "⚙",
  ),
];

export default HomepageMenuData;
