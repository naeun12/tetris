import { Sprite, Assets } from "pixi.js";
import BoardImage from "../../../public/assets/images/gameAssets/board.png";

export default async function GameBoard({
    app,
    boardX,
    boardWidth,
    boardHeight,
}) {
    const texture = await Assets.load(BoardImage);

    const board = new Sprite(texture);

    board.width = boardWidth;
    board.height = boardHeight;

    board.x = boardX;
    board.y = 0;

    app.stage.addChild(board);
}