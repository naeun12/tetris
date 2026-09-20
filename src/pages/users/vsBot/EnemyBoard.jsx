/** @format */

import { useEffect, useState } from "react";
import { extend } from "@pixi/react";
import { Sprite, Assets, Graphics } from "pixi.js";

import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    CELL_SIZE,
    COLORS,
} from "./board/config/BoardConfig";

import { PIECES } from "./board/pieces/Pieces";
import GameGrid from "./GameGrid";

extend({
    Graphics,
    Sprite,
});

const Board = ({
    board = [],
    piece = null,
    ghostY = 0,
    stats = null,
    mode = "solo",
    side = "player",
}) => {
    const [textures, setTextures] = useState({});

    useEffect(() => {
        let cancelled = false;

        const loadImages = async () => {
            const result = {};

            for (const type of Object.keys(PIECES)) {
                const pieceData = PIECES[type];

                const image =
                    pieceData?.asset?.image ||
                    pieceData?.asset?.path;

                if (!image) {
                    continue;
                }

                try {
                    const texture = await Assets.load(image);
                    result[type] = texture;
                } catch (error) {
                    console.error(
                        `Failed to load ${type} image:`,
                        image,
                        error
                    );
                }
            }

            if (!cancelled) {
                setTextures(result);
            }
        };

        loadImages();

        return () => {
            cancelled = true;
        };
    }, []);

    const cells = [];

    const lockedCells = new Set();
    const activeCells = new Set();
    const ghostCells = new Set();

    if (Array.isArray(board)) {
        board.forEach((row, y) => {
            if (!Array.isArray(row)) {
                return;
            }

            row.forEach((cell, x) => {
                if (!cell) {
                    return;
                }

                if (
                    x < 0 ||
                    x >= BOARD_WIDTH ||
                    y < 0 ||
                    y >= BOARD_HEIGHT
                ) {
                    return;
                }

                const positionKey = `${x}-${y}`;

                if (lockedCells.has(positionKey)) {
                    return;
                }

                lockedCells.add(positionKey);

                const type =
                    typeof cell === "string"
                        ? cell
                        : cell?.type;

                if (!type) {
                    return;
                }

                cells.push({
                    key: `b-${x}-${y}`,
                    x,
                    y,
                    type,
                    locked: true,
                });
            });
        });
    }

    if (
        piece &&
        Array.isArray(piece.shape)
    ) {
        piece.shape.forEach((row, dy) => {
            if (!Array.isArray(row)) {
                return;
            }

            row.forEach((cell, dx) => {
                if (!cell) {
                    return;
                }

                const x = piece.x + dx;
                const y = piece.y + dy;

                if (
                    x < 0 ||
                    x >= BOARD_WIDTH ||
                    y < 0 ||
                    y >= BOARD_HEIGHT
                ) {
                    return;
                }

                activeCells.add(`${x}-${y}`);
            });
        });
    }

    if (
        piece &&
        Array.isArray(piece.shape)
    ) {
        piece.shape.forEach((row, dy) => {
            if (!Array.isArray(row)) {
                return;
            }

            row.forEach((cell, dx) => {
                if (!cell) {
                    return;
                }

                const x = piece.x + dx;
                const y = ghostY + dy;

                if (
                    x < 0 ||
                    x >= BOARD_WIDTH ||
                    y < 0 ||
                    y >= BOARD_HEIGHT
                ) {
                    return;
                }

                const positionKey = `${x}-${y}`;

                if (
                    lockedCells.has(positionKey) ||
                    activeCells.has(positionKey) ||
                    ghostCells.has(positionKey)
                ) {
                    return;
                }

                ghostCells.add(positionKey);

                cells.push({
                    key: `g-${x}-${y}-${piece.type}`,
                    x,
                    y,
                    type: piece.type,
                    ghost: true,
                });
            });
        });
    }

    if (
        piece &&
        Array.isArray(piece.shape)
    ) {
        piece.shape.forEach((row, dy) => {
            if (!Array.isArray(row)) {
                return;
            }

            row.forEach((cell, dx) => {
                if (!cell) {
                    return;
                }

                const x = piece.x + dx;
                const y = piece.y + dy;

                if (
                    x < 0 ||
                    x >= BOARD_WIDTH ||
                    y < 0 ||
                    y >= BOARD_HEIGHT
                ) {
                    return;
                }

                const positionKey = `${x}-${y}`;

                if (
                    activeCells.has(positionKey) === false
                ) {
                    return;
                }

                cells.push({
                    key: `p-${x}-${y}-${piece.type}`,
                    x,
                    y,
                    type: piece.type,
                    active: true,
                });
            });
        });
    }

    const getTint = (type) => {
        const pieceData = PIECES[type];

        const pieceColor =
            pieceData?.color ?? 0xffffff;

        if (typeof pieceColor === "string") {
            return parseInt(
                pieceColor.replace("#", ""),
                16
            );
        }

        if (typeof pieceColor === "number") {
            return pieceColor;
        }

        return 0xffffff;
    };

    return (
        <>
            <pixiGraphics
                draw={(g) => {
                    g.clear();

                    for (
                        let x = 0;
                        x <= BOARD_WIDTH;
                        x++
                    ) {
                        g.moveTo(
                            x * CELL_SIZE,
                            0
                        );

                        g.lineTo(
                            x * CELL_SIZE,
                            BOARD_HEIGHT *
                                CELL_SIZE
                        );
                    }

                    for (
                        let y = 0;
                        y <= BOARD_HEIGHT;
                        y++
                    ) {
                        g.moveTo(
                            0,
                            y * CELL_SIZE
                        );

                        g.lineTo(
                            BOARD_WIDTH *
                                CELL_SIZE,
                            y * CELL_SIZE
                        );
                    }

                    g.stroke({
                        width: 1,
                        color: COLORS.gridLine,
                    });
                }}
            />

            {cells.map((cell) => {
                const pieceData =
                    PIECES[cell.type];

                const texture =
                    textures[cell.type];

                const tint = getTint(
                    cell.type
                );

                if (texture) {
                    return (
                        <pixiSprite
                            key={cell.key}
                            texture={texture}
                            x={
                                cell.x *
                                CELL_SIZE
                            }
                            y={
                                cell.y *
                                CELL_SIZE
                            }
                            width={CELL_SIZE}
                            height={CELL_SIZE}
                            tint={tint}
                            alpha={
                                cell.ghost
                                    ? 0.25
                                    : 1
                            }
                        />
                    );
                }

                return (
                    <GameGrid
                        key={cell.key}
                        x={cell.x}
                        y={cell.y}
                        color={
                            cell.ghost
                                ? COLORS.ghost
                                : pieceData?.color ??
                                  0xffffff
                        }
                    />
                );
            })}
        </>
    );
};

export default Board;

