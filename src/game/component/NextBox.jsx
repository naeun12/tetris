/** @format */

import {
    Container,
    Sprite,
    Assets,
} from "pixi.js";

import NextImage from "../../../public/assets/images/gameAssets/next/next.png";

export default async function NextBox({
    app,
    boardX,
    boardWidth,
    width,
    height,
    gap,
}) {
    const texture = await Assets.load(
        NextImage
    );

    // ==========================================
    // MAIN CONTAINER
    // ==========================================

    const container = new Container();

    container.x =
        boardX +
        boardWidth +
        gap;

    container.y = 20;

    app.stage.addChild(container);

    // ==========================================
    // NEXT BACKGROUND
    // ==========================================

    const next = new Sprite(texture);

    next.width = width;
    next.height = height;

    next.x = 0;
    next.y = 0;

    container.addChild(next);

    // ==========================================
    // PIECE CONTAINER
    // ==========================================

    const pieceContainer =
        new Container();

    pieceContainer.x = width / 2;
    pieceContainer.y = height / 2;

    container.addChild(
        pieceContainer
    );

    // ==========================================
    // RETURN
    // ==========================================

    return {
        container,
        pieceContainer,
    };
}