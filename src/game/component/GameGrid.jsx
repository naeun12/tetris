import { Sprite, Assets, Container } from "pixi.js";

import GridImage from "../../../public/assets/images/gameAssets/grid/grid.png";

export default async function GameGrid({
    app,
    boardX,
    boardWidth,
    boardHeight,
}) {
    const columns = 10;
    const rows = 20;

    const borderLeft = 20;
    const borderRight = 20;
    const borderTop = 20;
    const borderBottom = 20;

    const gridWidth =
        boardWidth - borderLeft - borderRight;

    const gridHeight =
        boardHeight - borderTop - borderBottom;

    const cellWidth = gridWidth / columns;
    const cellHeight = gridHeight / rows;

    const gridX = borderLeft;
    const gridY = borderTop;

    const texture = await Assets.load(GridImage);

    const gridContainer = new Container();

    gridContainer.x = boardX + gridX;
    gridContainer.y = gridY;

    app.stage.addChild(gridContainer);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const grid = new Sprite(texture);

            grid.width = cellWidth;
            grid.height = cellHeight;

            grid.x = col * cellWidth;
            grid.y = row * cellHeight;

            gridContainer.addChild(grid);
        }
    }
}