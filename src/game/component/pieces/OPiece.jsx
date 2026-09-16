/** @format */

import {
    Sprite,
    Assets,
} from "pixi.js";

import OTexture from "../../../../public/assets/images/gameAssets/pieces/defaultPieces/oPieces/red_O1.png";

import PieceMovement from "../movement/PieceMovement";
import SoftDrop from "../movement/SoftDrop";
import HardDrop from "../movement/HardDrop";
import Gravity from "../movement/Gravity";

export default async function OPiece({
    app,
    boardX,
    config,
    boardState,
    spawnNext,
}) {
    const columns = 10;
    const rows = 20;

    const borderLeft = 20;
    const borderRight = 20;
    const borderTop = 20;
    const borderBottom = 20;

    const gridWidth =
        config.boardWidth -
        borderLeft -
        borderRight;

    const gridHeight =
        config.boardHeight -
        borderTop -
        borderBottom;

    const cellWidth =
        gridWidth / columns;

    const cellHeight =
        gridHeight / rows;

    const pieceWidth =
        cellWidth * 2;

    const pieceHeight =
        cellHeight * 2;

    const pieceScale = 1;

    const rotationCells = [
        [
            [1, 1],
            [1, 1],
        ],
    ];

    const piece = {
        x: config.spawnColumn,
        y: config.spawnRow,

        widthCells: 2,
        heightCells: 2,

        cells: rotationCells[0],

        sprite: null,

        onMove: null,
        onLand: null,

        updateSize() {
            if (!this.sprite) {
                return;
            }

            this.sprite.width =
                pieceWidth * pieceScale;

            this.sprite.height =
                pieceHeight * pieceScale;
        },

        updatePosition() {
            if (!this.sprite) {
                return;
            }

            this.sprite.x =
                boardX +
                borderLeft +
                this.x * cellWidth;

            this.sprite.y =
                borderTop +
                this.y * cellHeight;
        },
    };

    const texture =
        await Assets.load(OTexture);

    console.log(
        "=== O PIECE DEBUG ==="
    );

    console.log(
        "Board width:",
        config.boardWidth
    );

    console.log(
        "Board height:",
        config.boardHeight
    );

    console.log(
        "Cell width:",
        cellWidth
    );

    console.log(
        "Cell height:",
        cellHeight
    );

    console.log(
        "O width:",
        pieceWidth
    );

    console.log(
        "O height:",
        pieceHeight
    );

    console.log(
        "Texture width:",
        texture.width
    );

    console.log(
        "Texture height:",
        texture.height
    );

    const sprite =
        new Sprite(texture);

    sprite.anchor.set(0, 0);

    piece.sprite =
        sprite;

    piece.updateSize();

    piece.updatePosition();

    app.stage.addChild(
        sprite
    );

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

    let active = true;
    let locked = false;

    piece.onMove = () => {
        piece.updatePosition();

        gravity.resetLockDelay();
    };

    function createLockedBlock() {
        const block =
            new Sprite(texture);

        block.anchor.set(0, 0);

        block.width =
            pieceWidth * pieceScale;

        block.height =
            pieceHeight * pieceScale;

        block.x =
            boardX +
            borderLeft +
            piece.x * cellWidth;

        block.y =
            borderTop +
            piece.y * cellHeight;

        app.stage.addChild(
            block
        );

        return block;
    }

    function lockPiece() {
        if (
            locked ||
            !active
        ) {
            return;
        }

        locked = true;

        const lockedSprite =
            createLockedBlock();

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

                boardState.setCell(
                    x,
                    y,
                    {
                        type: "O",
                        sprite:
                            lockedSprite,
                    }
                );
            }
        }

        if (piece.sprite) {
            piece.sprite.destroy();

            piece.sprite = null;
        }

        active = false;

        window.removeEventListener(
            "keydown",
            keyDown
        );

        app.ticker.remove(
            update
        );

        piece.onLand = null;

        const linesCleared =
            boardState.clearLines();

        console.log(
            "O Piece locked"
        );

        console.log(
            "Lines cleared:",
            linesCleared
        );

        if (spawnNext) {
            spawnNext();
        }
    }

    piece.onLand =
        lockPiece;

    function rotatePiece() {
        gravity.resetLockDelay();
    }

    function keyDown(event) {
        if (
            !active ||
            locked
        ) {
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
            event.preventDefault();

            softDrop.execute();

            return;
        }

        if (
            event.key ===
            config.keys.rotate
        ) {
            event.preventDefault();

            rotatePiece();

            return;
        }

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

    window.addEventListener(
        "keydown",
        keyDown
    );

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

        piece.updatePosition();
    }

    app.ticker.add(
        update
    );

    return piece;
}