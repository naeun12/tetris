/** @format */

import {
    Sprite,
    Assets,
    Graphics,
} from "pixi.js";

import I1Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/iPieces/purple_I1.png";
import I2Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/iPieces/purple_I2.png";
import I3Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/iPieces/purple_I3.png";
import I4Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/iPieces/purple_I4.png";

import PieceMovement from "../movement/PieceMovement";
import SoftDrop from "../movement/SoftDrop";
import HardDrop from "../movement/HardDrop";
import Gravity from "../movement/Gravity";
import Collision from "../collision/Collision";

export default async function IPiece({
    app,
    boardX,
    config,
    boardState,
    spawnNext,
}) {

    // ==========================================
    // GRID
    // ==========================================

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

    // ==========================================
    // TEXTURES
    // ==========================================

    const textures = await Promise.all([
        Assets.load(I1Image),
        Assets.load(I2Image),
        Assets.load(I3Image),
        Assets.load(I4Image),
    ]);

    // ==========================================
    // ROTATION SIZE
    // ==========================================

    const rotationSizes = [

        {
            width: 4,
            height: 1,
        },

        {
            width: 1,
            height: 4,
        },

        {
            width: 4,
            height: 1,
        },

        {
            width: 1,
            height: 4,
        },
    ];

    // ==========================================
    // ROTATION CELLS
    // ==========================================

    const rotationCells = [

        [
            [1, 1, 1, 1],
        ],

        [
            [1],
            [1],
            [1],
            [1],
        ],

        [
            [1, 1, 1, 1],
        ],

        [
            [1],
            [1],
            [1],
            [1],
        ],
    ];

    let rotation = 0;

    // ==========================================
    // SPRITE
    // ==========================================

    const iPiece =
        new Sprite(
            textures[rotation]
        );

    // ==========================================
    // PIECE
    // ==========================================

    const piece = {

        sprite: iPiece,

        x: config.spawnColumn,

        y: config.spawnRow,

        widthCells:
            rotationSizes[
                rotation
            ].width,

        heightCells:
            rotationSizes[
                rotation
            ].height,

        cells:
            rotationCells[
                rotation
            ],

        onLand: null,

        // ======================================
        // UPDATE SIZE
        // ======================================

        updateSize() {

            iPiece.width =
                cellWidth *
                this.widthCells;

            iPiece.height =
                cellHeight *
                this.heightCells;
        },

        // ======================================
        // UPDATE POSITION
        // ======================================

        updatePosition() {

            iPiece.x =
                boardX +
                config.borderLeft +
                this.x *
                cellWidth;

            iPiece.y =
                config.borderTop +
                this.y *
                cellHeight;
        },
    };

    piece.updateSize();

    piece.updatePosition();

    // ==========================================
    // ADD ACTIVE PIECE
    // ==========================================

    app.stage.addChild(
        iPiece
    );

    // ==========================================
    // MOVEMENT
    // ==========================================

    const movement =
        new PieceMovement(
            piece,
            config,
            boardState
        );

    const softDrop =
        new SoftDrop(
            piece,
            config,
            boardState
        );

    const hardDrop =
        new HardDrop(
            piece,
            config,
            boardState
        );

    const gravity =
        new Gravity(
            piece,
            config,
            boardState
        );

    // ==========================================
    // STATE
    // ==========================================

    let active = true;

    let locked = false;

    // ==========================================
    // CREATE LOCKED BLOCK
    // ==========================================

    function createLockedBlock(x, y) {

        const block =
            new Graphics();

        block
            .rect(
                0,
                0,
                cellWidth,
                cellHeight
            )
            .fill(
                0x9b59b6
            );

        block.x =
            boardX +
            config.borderLeft +
            x * cellWidth;

        block.y =
            config.borderTop +
            y * cellHeight;

        app.stage.addChild(
            block
        );

        return block;
    }

    // ==========================================
    // LOCK PIECE
    // ==========================================

    function lockPiece() {

        if (
            locked ||
            !active
        ) {

            return;
        }

        locked = true;

        // ======================================
        // SAVE I BLOCKS
        // ======================================

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

                if (
                    !piece.cells[row]?.[col]
                ) {

                    continue;
                }

                const x =
                    piece.x + col;

                const y =
                    piece.y + row;

                if (
                    !boardState.isInside(
                        x,
                        y
                    )
                ) {

                    continue;
                }

                const block =
                    createLockedBlock(
                        x,
                        y
                    );

                boardState.setCell(
                    x,
                    y,
                    {
                        type: "I",
                        sprite: block,
                    }
                );
            }
        }

        // ======================================
        // DEBUG BEFORE CLEAR
        // ======================================

        boardState.debugGrid(
            "I BEFORE CLEAR"
        );

        // ======================================
        // REMOVE ACTIVE PIECE
        // ======================================

        app.stage.removeChild(
            iPiece
        );

        iPiece.destroy();

        active = false;

        // ======================================
        // REMOVE EVENTS
        // ======================================

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

        // ======================================
        // REMOVE GAME LOOP
        // ======================================

        app.ticker.remove(
            update
        );

        piece.onLand = null;

        // ======================================
        // CLEAR LINES
        // ======================================

        const linesCleared =
            boardState.clearLines();

        // ======================================
        // DEBUG AFTER CLEAR
        // ======================================

        boardState.debugGrid(
            "I AFTER CLEAR"
        );

        boardState.debugBlocks();

        console.log(
            "Lines cleared:",
            linesCleared
        );

        // ======================================
        // NEXT PIECE
        // ======================================

        if (spawnNext) {
            spawnNext();
        }
    }

    // ==========================================
    // LAND CALLBACK
    // ==========================================

    piece.onLand =
        lockPiece;

    // ==========================================
    // ROTATE
    // ==========================================

    function rotatePiece() {

        if (
            !active ||
            locked
        ) {

            return;
        }

        const nextRotation =
            (rotation + 1) %
            textures.length;

        const nextSize =
            rotationSizes[
                nextRotation
            ];

        const nextCells =
            rotationCells[
                nextRotation
            ];

        let newX =
            piece.x;

        let newY =
            piece.y;

        // ======================================
        // BOARD LIMIT
        // ======================================

        const maxX =
            config.columns -
            nextSize.width;

        const maxY =
            config.rows -
            nextSize.height;

        newX =
            Math.max(
                0,
                Math.min(
                    newX,
                    maxX
                )
            );

        newY =
            Math.max(
                0,
                Math.min(
                    newY,
                    maxY
                )
            );

        // ======================================
        // TEST PIECE
        // ======================================

        const testPiece = {

            x: newX,

            y: newY,

            widthCells:
                nextSize.width,

            heightCells:
                nextSize.height,

            cells:
                nextCells,
        };

        const canRotate =
            Collision.canMove(
                testPiece,
                boardState,
                newX,
                newY
            );

        if (!canRotate) {
            return;
        }

        // ======================================
        // APPLY ROTATION
        // ======================================

        rotation =
            nextRotation;

        piece.x =
            newX;

        piece.y =
            newY;

        piece.widthCells =
            nextSize.width;

        piece.heightCells =
            nextSize.height;

        piece.cells =
            nextCells;

        iPiece.texture =
            textures[
                rotation
            ];

        piece.updateSize();

        piece.updatePosition();
    }

    // ==========================================
    // KEYBOARD
    // ==========================================

    function handleKeyDown(event) {

        if (
            !active ||
            locked
        ) {

            return;
        }

        // LEFT
        if (
            event.key ===
            config.keys.left
        ) {

            movement.moveLeft();

            return;
        }

        // RIGHT
        if (
            event.key ===
            config.keys.right
        ) {

            movement.moveRight();

            return;
        }

        // SOFT DROP
        if (
            event.key ===
            config.keys.softDrop
        ) {

            event.preventDefault();

            softDrop.execute();

            return;
        }

        // ROTATE
        if (
            event.key ===
            config.keys.rotate
        ) {

            event.preventDefault();

            rotatePiece();

            return;
        }

        // HARD DROP
        if (
            event.key ===
            config.keys.hardDrop
        ) {

            event.preventDefault();

            hardDrop.execute();

            gravity.reset();

            return;
        }
    }

    // ==========================================
    // KEYBOARD LISTENER
    // ==========================================

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    // ==========================================
    // GAME LOOP
    // ==========================================

    function update(ticker) {

        if (
            !active ||
            locked
        ) {

            return;
        }

        gravity.update(
            ticker.deltaMS
        );
    }

    // ==========================================
    // ADD GAME LOOP
    // ==========================================

    app.ticker.add(
        update
    );

    // ==========================================
    // RETURN
    // ==========================================

    return piece;
}