/** @format */

import { Sprite, Assets } from "pixi.js";

import TPiece1Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/tPieces/blue_t1.png";
import TPiece2Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/tPieces/blue_t2.png";
import TPiece3Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/tPieces/blue_t3.png";
import TPiece4Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/tPieces/blue_t4.png";

import PieceMovement from "../movement/PieceMovement";
import SoftDrop from "../movement/SoftDrop";
import HardDrop from "../movement/HardDrop";
import Gravity from "../movement/Gravity";
import Collision from "../collision/Collision";

export default async function TPieces({
    app,
    boardX,
    config,
    boardState,
    spawnNext,
    onGameOver,
}) {
    const shapes = [
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ],
    ];

    const textures = await Promise.all([
        Assets.load(TPiece1Image),
        Assets.load(TPiece2Image),
        Assets.load(TPiece3Image),
        Assets.load(TPiece4Image),
    ]);

    let rotation = 0;

    const gridWidth =
        config.boardWidth -
        config.borderLeft -
        config.borderRight;

    const gridHeight =
        config.boardHeight -
        config.borderTop -
        config.borderBottom;

    const cellWidth =
        gridWidth / config.columns;

    const cellHeight =
        gridHeight / config.rows;

    const piece = {
        sprite: null,

        x: config.spawnColumn,
        y: config.spawnRow,

        widthCells: 3,
        heightCells: 2,

        cells: shapes[0],

        active: true,

        updateSize() {
            this.widthCells = this.cells[0].length;
            this.heightCells = this.cells.length;
        },

        updatePosition() {
            if (!this.sprite) {
                return;
            }

            this.sprite.x =
                boardX +
                config.borderLeft +
                this.x * cellWidth;

            this.sprite.y =
                config.borderTop +
                this.y * cellHeight;
        },

        onLand: null,
        onMove: null,
    };

    piece.updateSize();

   function createPieceSprite() {
    const sprite = new Sprite(textures[rotation]);

    sprite.anchor.set(0, 0);

    sprite.width = 150;
    sprite.height = 100;

    return sprite;
}

    function drawPiece() {
        if (piece.sprite) {
            app.stage.removeChild(piece.sprite);
            piece.sprite.destroy();
            piece.sprite = null;
        }

        piece.sprite = createPieceSprite();

        app.stage.addChild(piece.sprite);

        piece.updatePosition();
    }

    drawPiece();

    const movement = new PieceMovement(
        piece,
        config,
        boardState
    );

    const softDrop = new SoftDrop(
        piece,
        config,
        boardState
    );

    const hardDrop = new HardDrop(
        piece,
        config,
        boardState
    );

    const gravity = new Gravity(
        piece,
        config,
        boardState
    );

    piece.onMove = () => {
        gravity.resetLockDelay();
    };

    function rotate() {
        const oldRotation = rotation;
        const oldCells = piece.cells;
        const oldX = piece.x;
        const oldY = piece.y;

        const nextRotation =
            (rotation + 1) % textures.length;

        rotation = nextRotation;
        piece.cells = shapes[nextRotation];

        piece.updateSize();

        if (
            Collision.canMove(
                piece,
                boardState,
                piece.x,
                piece.y
            )
        ) {
            drawPiece();
            gravity.resetLockDelay();
            return;
        }

        if (
            Collision.canMove(
                piece,
                boardState,
                piece.x - 1,
                piece.y
            )
        ) {
            piece.x--;

            drawPiece();
            gravity.resetLockDelay();
            return;
        }

        if (
            Collision.canMove(
                piece,
                boardState,
                piece.x + 1,
                piece.y
            )
        ) {
            piece.x++;

            drawPiece();
            gravity.resetLockDelay();
            return;
        }

        if (
            Collision.canMove(
                piece,
                boardState,
                piece.x,
                piece.y - 1
            )
        ) {
            piece.y--;

            drawPiece();
            gravity.resetLockDelay();
            return;
        }

        rotation = oldRotation;
        piece.cells = oldCells;
        piece.x = oldX;
        piece.y = oldY;

        piece.updateSize();
    }

    let active = true;
    let locked = false;

    function checkGameOverBeforeLock() {
        for (
            let row = 0;
            row < piece.heightCells;
            row++
        ) {
            for (
                let col = 0;
                col < piece.widthCells;
                col++
            ) {
                if (!piece.cells[row]?.[col]) {
                    continue;
                }

                const x = piece.x + col;
                const y = piece.y + row;

                if (y < 0) {
                    return true;
                }
            }
        }

        return false;
    }

    function lockPiece() {
        if (locked || !active) {
            return;
        }

        if (checkGameOverBeforeLock()) {
            locked = true;
            active = false;
            piece.active = false;

            if (piece.sprite) {
                app.stage.removeChild(piece.sprite);
                piece.sprite.destroy();
                piece.sprite = null;
            }

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            app.ticker.remove(update);

            piece.onLand = null;
            piece.onMove = null;

            if (onGameOver) {
                onGameOver();
            } else if (boardState.onGameOver) {
                boardState.onGameOver();
            }

            return;
        }

        locked = true;

        for (
            let row = 0;
            row < piece.heightCells;
            row++
        ) {
            for (
                let col = 0;
                col < piece.widthCells;
                col++
            ) {
                if (!piece.cells[row]?.[col]) {
                    continue;
                }

                const x = piece.x + col;
                const y = piece.y + row;

                if (y < 0) {
                    continue;
                }

                if (
                    !boardState.isInside(
                        x,
                        y
                    )
                ) {
                    continue;
                }

                const block = new Sprite(
                    textures[rotation]
                );

                block.anchor.set(0, 0);

                block.width = cellWidth;
                block.height = cellHeight;

                block.x =
                    boardX +
                    config.borderLeft +
                    x * cellWidth;

                block.y =
                    config.borderTop +
                    y * cellHeight;

                app.stage.addChild(block);

                boardState.setCell(
                    x,
                    y,
                    {
                        type: "T",
                        sprite: block,
                    }
                );
            }
        }

        if (piece.sprite) {
            app.stage.removeChild(piece.sprite);
            piece.sprite.destroy();
            piece.sprite = null;
        }

        active = false;
        piece.active = false;

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

        app.ticker.remove(update);

        piece.onLand = null;
        piece.onMove = null;

        const linesCleared =
            boardState.clearLines();

        console.log("T Piece locked");
        console.log(
            "Lines cleared:",
            linesCleared
        );

        if (spawnNext) {
            spawnNext(piece);
        }
    }

    piece.onLand = lockPiece;

    function handleKeyDown(event) {
        if (!active || locked) {
            return;
        }

        if (
            event.key ===
            config.keys.left
        ) {
            movement.moveLeft();
            return;
        }

        if (
            event.key ===
            config.keys.right
        ) {
            movement.moveRight();
            return;
        }

        if (
            event.key ===
            config.keys.softDrop
        ) {
            softDrop.execute();
            return;
        }

        if (
            event.key ===
            config.keys.rotate
        ) {
            rotate();
            return;
        }

        if (
            event.key ===
            config.keys.hardDrop
        ) {
            hardDrop.execute();
        }
    }

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    function update(ticker) {
        if (!active || locked) {
            return;
        }

        gravity.update(ticker.deltaMS);
    }

    app.ticker.add(update);

    return piece;
}