import {
    Sprite,
    Assets,
    Graphics,
} from "pixi.js";

import greenL1 from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/lPieces/green_l1.png";
import greenL2 from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/lPieces/green_l2.png";
import greenL3 from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/lPieces/green_l3.png";
import greenL4 from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/lPieces/green_l4.png";

import PieceMovement from "../movement/PieceMovement";
import SoftDrop from "../movement/SoftDrop";
import HardDrop from "../movement/HardDrop";
import Gravity from "../movement/Gravity";
import Collision from "../collision/Collision";

export default async function LPiece({
    app,
    boardX,
    config,
    boardState,
    spawnNext,
}) {
    // ==========================================
    // GRID SIZE
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
    // LOAD L TEXTURES
    // ==========================================

    const textures = await Promise.all([
        Assets.load(greenL1),
        Assets.load(greenL2),
        Assets.load(greenL3),
        Assets.load(greenL4),
    ]);

    // ==========================================
    // L PIECE SHAPES
    // ==========================================

    const shapes = [
        // L1
        [
            [0, 0, 1],
            [1, 1, 1],
        ],

        // L2
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],

        // L3
        [
            [1, 1, 1],
            [1, 0, 0],
        ],

        // L4
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
    ];

    // ==========================================
    // STATE
    // ==========================================

    let rotation = 0;
    let locked = false;
    let active = true;

    // ==========================================
    // PIECE
    // ==========================================

    const piece = {
        type: "L",

        x: config.spawnColumn,
        y: config.spawnRow,

        rotation: 0,

        cells: shapes[0],

        widthCells: 3,
        heightCells: 2,

        sprite: null,

        // ======================================
        // UPDATE POSITION
        // ======================================

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

        // ======================================
        // UPDATE TEXTURE
        // ======================================

        updateTexture() {
            if (!this.sprite) {
                return;
            }

            this.sprite.texture =
                textures[rotation];

            this.sprite.width =
                this.widthCells *
                cellWidth;

            this.sprite.height =
                this.heightCells *
                cellHeight;
        },

        onMove: null,
        onLand: null,
    };

    // ==========================================
    // CREATE ACTIVE SPRITE
    // ==========================================

    piece.sprite =
        new Sprite(textures[0]);

    piece.sprite.width =
        piece.widthCells *
        cellWidth;

    piece.sprite.height =
        piece.heightCells *
        cellHeight;

    app.stage.addChild(
        piece.sprite
    );

    piece.updatePosition();

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
    // ROTATION
    // ==========================================

    function rotatePiece() {
        if (
            locked ||
            !active
        ) {
            return;
        }

        const oldRotation =
            rotation;

        const nextRotation =
            (rotation + 1) % 4;

        const oldShape =
            piece.cells;

        const oldWidth =
            piece.widthCells;

        const oldHeight =
            piece.heightCells;

        // Apply new rotation
        rotation =
            nextRotation;

        piece.cells =
            shapes[rotation];

        piece.heightCells =
            piece.cells.length;

        piece.widthCells =
            piece.cells[0].length;

        // ======================================
        // ROTATION KICKS
        // ======================================

        const positions = [
            {
                x: piece.x,
                y: piece.y,
            },
            {
                x: piece.x - 1,
                y: piece.y,
            },
            {
                x: piece.x + 1,
                y: piece.y,
            },
            {
                x: piece.x,
                y: piece.y - 1,
            },
        ];

        let rotated = false;

        for (
            const position
            of positions
        ) {
            if (
                Collision.canMove(
                    piece,
                    boardState,
                    position.x,
                    position.y
                )
            ) {
                piece.x =
                    position.x;

                piece.y =
                    position.y;

                rotated = true;

                break;
            }
        }

        // ======================================
        // ROTATION FAILED
        // ======================================

        if (!rotated) {
            rotation =
                oldRotation;

            piece.cells =
                oldShape;

            piece.widthCells =
                oldWidth;

            piece.heightCells =
                oldHeight;

            return;
        }

        // ======================================
        // APPLY ROTATION
        // ======================================

        piece.rotation =
            rotation;

        piece.updateTexture();

        piece.updatePosition();

        gravity.resetLockDelay();
    }

    // ==========================================
    // CREATE LOCKED BLOCK
    // ==========================================

    function createLockedBlock(
        x,
        y
    ) {
        const block =
            new Graphics();

        // Green 1x1 block
        block
            .rect(
                0,
                0,
                cellWidth,
                cellHeight
            )
            .fill(0x00a000);

        // Position on board
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

    piece.onLand = () => {
        if (
            locked ||
            !active
        ) {
            return;
        }

        locked = true;
        active = false;

        // ======================================
        // REMOVE ACTIVE PIECE
        // ======================================

        if (piece.sprite) {
            piece.sprite.destroy();

            piece.sprite = null;
        }

        // ======================================
        // STORE CELLS
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
                // Empty cell
                if (
                    !piece.cells[row]?.[col]
                ) {
                    continue;
                }

                const x =
                    piece.x + col;

                const y =
                    piece.y + row;

                // Outside board
                if (
                    x < 0 ||
                    x >= boardState.columns ||
                    y < 0 ||
                    y >= boardState.rows
                ) {
                    continue;
                }

                // ==================================
                // CREATE REAL 1x1 BLOCK
                // ==================================

                const block =
                    createLockedBlock(
                        x,
                        y
                    );

                // ==================================
                // SAVE TO BOARD STATE
                // ==================================

                boardState.setCell(
                    x,
                    y,
                    {
                        type: "L",
                        sprite: block,
                    }
                );
            }
        }

        console.log(
            "L Piece locked"
        );

        // ======================================
        // CLEAR LINES
        // ======================================

        const cleared =
            boardState.clearLines();

        console.log(
            "Lines cleared:",
            cleared
        );

        // ======================================
        // NEXT PIECE
        // ======================================

        if (spawnNext) {
            spawnNext();
        }
    };

    // ==========================================
    // KEYBOARD
    // ==========================================

    function handleKeyDown(
        event
    ) {
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
        }

        // RIGHT
        if (
            event.key ===
            config.keys.right
        ) {
            movement.moveRight();
        }

        // SOFT DROP
        if (
            event.key ===
            config.keys.softDrop
        ) {
            softDrop.execute();
        }

        // ROTATE
        if (
            event.key ===
            config.keys.rotate
        ) {
            rotatePiece();
        }

        // HARD DROP
        if (
            event.key ===
            config.keys.hardDrop
        ) {
            event.preventDefault();

            hardDrop.execute();
        }
    }

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    // ==========================================
    // GAME LOOP
    // ==========================================

    const update =
        (ticker) => {
            if (
                !active ||
                locked
            ) {
                return;
            }

            gravity.update(
                ticker.deltaMS
            );
        };

    app.ticker.add(
        update
    );

    // ==========================================
    // MOVEMENT CALLBACK
    // ==========================================

    piece.onMove = () => {
        gravity.resetLockDelay();
    };

    return piece;
}