/** @format */

import {
    Sprite,
    Assets,
} from "pixi.js";

import JPiece1Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/jPieces/pink_J1.png";
import JPiece2Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/jPieces/pink_J2.png";
import JPiece3Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/jPieces/pink_J3.png";
import JPiece4Image from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/jPieces/pink_J4.png";

import PieceMovement from "../movement/PieceMovement";
import SoftDrop from "../movement/SoftDrop";
import HardDrop from "../movement/HardDrop";
import Gravity from "../movement/Gravity";
import Collision from "../collision/Collision";

export default async function JPieces({
    app,
    boardX,
    config,
    boardState,
    spawnNext,
}) {

    /*
    ==============================================
    J PIECE ROTATIONS
    ==============================================

    J1

    X..
    XXX

    J2

    XX
    X.
    X.

    J3

    XXX
    ..X

    J4

    .X
    .X
    XX
    */

    const shapes = [

        // J1
        [
            [1, 0, 0],
            [1, 1, 1],
        ],

        // J2
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],

        // J3
        [
            [1, 1, 1],
            [0, 0, 1],
        ],

        // J4
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
    ];

    /*
    ==============================================
    LOAD TEXTURES
    ==============================================
    */

    const textures = [

        await Assets.load(
            JPiece1Image
        ),

        await Assets.load(
            JPiece2Image
        ),

        await Assets.load(
            JPiece3Image
        ),

        await Assets.load(
            JPiece4Image
        ),
    ];

    let rotation = 0;

    /*
    ==============================================
    PIECE
    ==============================================
    */

    const piece = {

        sprite: null,

        x:
            config.spawnColumn,

        y:
            config.spawnRow,

        widthCells: 3,

        heightCells: 2,

        cells:
            shapes[0],

        updateSize() {

            this.widthCells =
                this.cells[0].length;

            this.heightCells =
                this.cells.length;
        },

        updatePosition() {

            if (!this.sprite) {
                return;
            }

            const gridWidth =
                config.boardWidth -
                config.borderLeft -
                config.borderRight;

            const gridHeight =
                config.boardHeight -
                config.borderTop -
                config.borderBottom;

            const cellWidth =
                gridWidth /
                config.columns;

            const cellHeight =
                gridHeight /
                config.rows;

            this.sprite.x =
                boardX +
                config.borderLeft +
                this.x *
                    cellWidth;

            this.sprite.y =
                config.borderTop +
                this.y *
                    cellHeight;
        },

        onLand: null,

        onMove: null,
    };

    piece.updateSize();

    /*
    ==============================================
    CELL SIZE
    ==============================================
    */

    const gridWidth =
        config.boardWidth -
        config.borderLeft -
        config.borderRight;

    const gridHeight =
        config.boardHeight -
        config.borderTop -
        config.borderBottom;

    const cellWidth =
        gridWidth /
        config.columns;

    const cellHeight =
        gridHeight /
        config.rows;

    /*
    ==============================================
    CREATE ACTIVE SPRITE
    ==============================================
    */

    function createPieceSprite() {

        const sprite =
            new Sprite(
                textures[rotation]
            );

        sprite.anchor.set(
            0,
            0
        );

        sprite.width =
            piece.widthCells *
            cellWidth;

        sprite.height =
            piece.heightCells *
            cellHeight;

        return sprite;
    }

    /*
    ==============================================
    DRAW PIECE
    ==============================================
    */

    function drawPiece() {

        if (
            piece.sprite
        ) {

            app.stage.removeChild(
                piece.sprite
            );

            piece.sprite.destroy();

            piece.sprite =
                null;
        }

        const sprite =
            createPieceSprite();

        piece.sprite =
            sprite;

        app.stage.addChild(
            sprite
        );

        piece.updatePosition();
    }

    drawPiece();

    /*
    ==============================================
    MOVEMENT
    ==============================================
    */

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

    piece.onMove = () => {

        gravity.resetLockDelay();

    };

    /*
    ==============================================
    ROTATION
    ==============================================
    */

    function rotate() {

        const oldRotation =
            rotation;

        const oldCells =
            piece.cells;

        const oldWidth =
            piece.widthCells;

        const oldHeight =
            piece.heightCells;

        const oldX =
            piece.x;

        const oldY =
            piece.y;

        const nextRotation =
            (rotation + 1) %
            shapes.length;

        rotation =
            nextRotation;

        piece.cells =
            shapes[nextRotation];

        piece.updateSize();

        /*
        Normal rotation
        */

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

        /*
        Kick LEFT
        */

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

        /*
        Kick RIGHT
        */

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

        /*
        Kick UP
        */

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

        /*
        Rotation failed
        */

        rotation =
            oldRotation;

        piece.cells =
            oldCells;

        piece.widthCells =
            oldWidth;

        piece.heightCells =
            oldHeight;

        piece.x =
            oldX;

        piece.y =
            oldY;
    }

    /*
    ==============================================
    LOCKED BLOCK
    ==============================================
    */

    function createLockedBlock() {

        const block =
            new Sprite(
                textures[rotation]
            );

        block.width =
            cellWidth;

        block.height =
            cellHeight;

        return block;
    }

    let active = true;

    let locked = false;

    /*
    ==============================================
    LOCK PIECE
    ==============================================
    */

    function lockPiece() {

        if (
            locked ||
            !active
        ) {
            return;
        }

        locked = true;

        /*
        Save J blocks
        */

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
                    piece.x +
                    col;

                const y =
                    piece.y +
                    row;

                if (
                    !boardState.isInside(
                        x,
                        y
                    )
                ) {
                    continue;
                }

                const block =
                    createLockedBlock();

                block.x =
                    boardX +
                    config.borderLeft +
                    x *
                        cellWidth;

                block.y =
                    config.borderTop +
                    y *
                        cellHeight;

                app.stage.addChild(
                    block
                );

                boardState.setCell(
                    x,
                    y,
                    {
                        type: "J",
                        sprite: block,
                    }
                );
            }
        }

        /*
        Remove active J
        */

        if (
            piece.sprite
        ) {

            app.stage.removeChild(
                piece.sprite
            );

            piece.sprite.destroy();

            piece.sprite =
                null;
        }

        active = false;

        /*
        Remove events
        */

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

        app.ticker.remove(
            update
        );

        piece.onLand =
            null;

        piece.onMove =
            null;

        /*
        Clear lines
        */

        const linesCleared =
            boardState.clearLines();

        console.log(
            "J Piece locked"
        );

        console.log(
            "Lines cleared:",
            linesCleared
        );

        /*
        Spawn next
        */

        if (
            spawnNext
        ) {

            spawnNext();
        }
    }

    piece.onLand =
        lockPiece;

    /*
    ==============================================
    KEYBOARD
    ==============================================
    */

    function handleKeyDown(
        event
    ) {

        if (
            !active ||
            locked
        ) {
            return;
        }

        /*
        LEFT
        */

        if (
            event.key ===
            config.keys.left
        ) {

            movement.moveLeft();

            return;
        }

        /*
        RIGHT
        */

        if (
            event.key ===
            config.keys.right
        ) {

            movement.moveRight();

            return;
        }

        /*
        SOFT DROP
        */

        if (
            event.key ===
            config.keys.softDrop
        ) {

            softDrop.execute();

            return;
        }

        /*
        ROTATE
        */

        if (
            event.key ===
            config.keys.rotate
        ) {

            rotate();

            return;
        }

        /*
        HARD DROP
        */

        if (
            event.key ===
            config.keys.hardDrop
        ) {

            hardDrop.execute();

            return;
        }
    }

    window.addEventListener(
        "keydown",
        handleKeyDown
    );

    /*
    ==============================================
    GRAVITY
    ==============================================
    */

    function update(
        ticker
    ) {

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

    app.ticker.add(
        update
    );

    return piece;
}