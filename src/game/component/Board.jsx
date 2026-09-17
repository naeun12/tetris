/** @format */

import { useEffect, useState } from "react";

import { extend } from "@pixi/react";
import { Sprite, Assets, Graphics } from "pixi.js";
import {BOARD_WIDTH, BOARD_HEIGHT,CELL_SIZE, COLORS,} from "./board/config/BoardConfig";
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
}) => {
    const [textures, setTextures] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Load piece images
    |--------------------------------------------------------------------------
    */

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
                    console.warn(
                        `No image found for piece "${type}"`,
                        pieceData
                    );

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

    /*
    |--------------------------------------------------------------------------
    | Create cells to render
    |--------------------------------------------------------------------------
    */

    const cells = [];

    /*
    |--------------------------------------------------------------------------
    | Locked board cells
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(board)) {
        board.forEach((row, y) => {
            if (!Array.isArray(row)) return;

            row.forEach((cell, x) => {
                if (!cell) return;

                cells.push({
                    key: `b-${x}-${y}`,
                    x,
                    y,
                    type: cell,
                    locked: true,
                });
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Ghost piece
    |--------------------------------------------------------------------------
    */

    if (
        piece &&
        Array.isArray(piece.shape)
    ) {
        piece.shape.forEach((row, dy) => {
            if (!Array.isArray(row)) return;

            row.forEach((cell, dx) => {
                if (!cell) return;

                const y = ghostY + dy;

                if (y < 0 || y >= BOARD_HEIGHT) {
                    return;
                }

                const x = piece.x + dx;

                if (x < 0 || x >= BOARD_WIDTH) {
                    return;
                }

                cells.push({
                    key: `g-${dx}-${dy}`,
                    x,
                    y,
                    type: piece.type,
                    ghost: true,
                });
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Active piece
    |--------------------------------------------------------------------------
    */

    if (
        piece &&
        Array.isArray(piece.shape)
    ) {
        piece.shape.forEach((row, dy) => {
            if (!Array.isArray(row)) return;

            row.forEach((cell, dx) => {
                if (!cell) return;

                const y = piece.y + dy;

                if (y < 0 || y >= BOARD_HEIGHT) {
                    return;
                }

                const x = piece.x + dx;

                if (x < 0 || x >= BOARD_WIDTH) {
                    return;
                }

                cells.push({
                    key: `p-${dx}-${dy}`,
                    x,
                    y,
                    type: piece.type,
                    active: true,
                });
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            {/* ---------------------------------------------------------- */}
            {/* Board Grid */}
            {/* ---------------------------------------------------------- */}

            <pixiGraphics
                draw={(g) => {
                    g.clear();

                    for (let x = 0; x <= BOARD_WIDTH; x++) {
                        g.moveTo(
                            x * CELL_SIZE,
                            0
                        );

                        g.lineTo(
                            x * CELL_SIZE,
                            BOARD_HEIGHT * CELL_SIZE
                        );
                    }

                    for (let y = 0; y <= BOARD_HEIGHT; y++) {
                        g.moveTo(
                            0,
                            y * CELL_SIZE
                        );

                        g.lineTo(
                            BOARD_WIDTH * CELL_SIZE,
                            y * CELL_SIZE
                        );
                    }

                    g.stroke({
                        width: 1,
                        color: COLORS.gridLine,
                    });
                }}
            />

            {/* ---------------------------------------------------------- */}
            {/* Pieces */}
            {/* ---------------------------------------------------------- */}

            {cells.map((cell) => {
                const pieceData = PIECES[cell.type];
                const texture = textures[cell.type];
                const pieceColor =
                    pieceData?.color ?? 0xffffff;
                let tint = 0xffffff;
                if (
                    typeof pieceColor === "string"
                ) {
                    tint = parseInt(
                        pieceColor.replace("#", ""),
                        16
                    );
                } else if (
                    typeof pieceColor === "number"
                ) {
                    tint = pieceColor;
                }

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

                            /*
                            | IMPORTANT:
                            | Do NOT use 0xffffff here.
                            | This keeps the piece's color.
                            */

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
                                : pieceColor
                        }
                    />
                );
            })}
        </>
    );
};

export default Board;