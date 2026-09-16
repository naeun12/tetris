/** @format */

import { useEffect, useRef } from "react";

import { Application } from "pixi.js";

import GameBoard from "./GameBoard";
import GameGrid from "./GameGrid";
import HoldBox from "./HoldBox";
import NextBox from "./NextBox";
import NextPiece from "./NextPiece";

import IPiece from "./pieces/IPieces";
import OPiece from "./pieces/OPiece";
import TPiece from "./pieces/TPieces";
import ZPieces from "./pieces/ZPieces";
import SPieces from "./pieces/SPieces";
import JPieces from "./pieces/JPieces";
import LPiece from "./pieces/LPieces";

import BoardState from "./board/BoardState";
import PieceBag from "./pieces/PieceBag";

export default function Board() {
    const containerRef = useRef(null);

    useEffect(() => {
        let app;

        async function init() {
            // ==========================================
            // BOARD SIZE
            // ==========================================

            const boardWidth = 500;
            const boardHeight = 600;

            // ==========================================
            // HOLD BOX
            // ==========================================

            const holdWidth = 100;
            const holdHeight = 100;
            const holdGap = 5;

            // ==========================================
            // NEXT BOX
            // ==========================================

            const nextWidth = 100;
            const nextHeight = 100;
            const nextGap = 5;

            // ==========================================
            // TETRIS GRID
            // ==========================================

            const columns = 10;
            const rows = 20;

            // ==========================================
            // BOARD BORDERS
            // ==========================================

            const borderLeft = 20;
            const borderRight = 20;
            const borderTop = 20;
            const borderBottom = 20;

            // ==========================================
            // BOARD POSITION
            // ==========================================

            const boardX =
                holdWidth + holdGap;

            // ==========================================
            // GAME CONFIG
            // ==========================================

            const config = {
                boardWidth,
                boardHeight,

                columns,
                rows,

                borderLeft,
                borderRight,
                borderTop,
                borderBottom,

                spawnColumn: 3,
                spawnRow: 0,

                softDropDistance: 1,

                gravity: {
                    enabled: true,
                    interval: 800,
                },

                keys: {
                    left: "ArrowLeft",
                    right: "ArrowRight",
                    softDrop: "ArrowDown",
                    rotate: "ArrowUp",
                    hardDrop: " ",
                },
            };

            // ==========================================
            // CREATE PIXI APP
            // ==========================================

            app = new Application();

            await app.init({
                width:
                    holdWidth +
                    holdGap +
                    boardWidth +
                    nextGap +
                    nextWidth,

                height: boardHeight,

                backgroundAlpha: 0,

                antialias: true,
            });

            // ==========================================
            // CHECK CONTAINER
            // ==========================================

            if (!containerRef.current) {
                return;
            }

            // ==========================================
            // ADD CANVAS TO REACT
            // ==========================================

            containerRef.current.appendChild(
                app.canvas
            );

            // ==========================================
            // BOARD STATE
            // ==========================================

            const boardState =
                new BoardState(
                    columns,
                    rows
                );

            boardState.configureRender({
                boardX,
                boardWidth,
                boardHeight,

                borderLeft,
                borderRight,
                borderTop,
                borderBottom,
            });

            // ==========================================
            // PIECE BAG
            // ==========================================

            const pieceBag =
                new PieceBag();

            // ==========================================
            // GAME OVER STATE
            // ==========================================

            let gameOver = false;

            // ==========================================
            // GAME OVER
            // ==========================================

            function triggerGameOver() {
                if (gameOver) {
                    return;
                }

                gameOver = true;

                console.log("");
                console.log(
                    "================================"
                );
                console.log(
                    "          GAME OVER"
                );
                console.log(
                    "================================"
                );
                console.log(
                    "GAME DISABLED"
                );
                console.log("");
            }

            // ==========================================
            // HOLD BOX
            // ==========================================

            await HoldBox({
                app,
                width: holdWidth,
                height: holdHeight,
            });

            // ==========================================
            // GRID
            // ==========================================

            await GameGrid({
                app,
                boardX,
                boardWidth,
                boardHeight,
            });

            // ==========================================
            // BOARD
            // ==========================================

            await GameBoard({
                app,
                boardX,
                boardWidth,
                boardHeight,
            });

            // ==========================================
            // NEXT BOX
            // ==========================================

            const nextBox =
                await NextBox({
                    app,

                    boardX,
                    boardWidth,

                    width: nextWidth,
                    height: nextHeight,

                    gap: nextGap,
                });

            // ==========================================
            // NEXT PIECE
            // ==========================================

            let nextPieceType =
                pieceBag.next();

            let nextPieceDisplay = null;

            // ==========================================
            // SHOW NEXT PIECE
            // ==========================================

            function updateNextPiece() {
                if (nextPieceDisplay) {
                    nextPieceDisplay.destroy();

                    nextPieceDisplay = null;
                }

                nextPieceDisplay =
                    new NextPiece(
                        nextPieceType,
                        22
                    );

                nextBox.pieceContainer.addChild(
                    nextPieceDisplay.container
                );

                console.log(
                    "NEXT PREVIEW:",
                    nextPieceType
                );
            }

            // ==========================================
            // INITIAL NEXT
            // ==========================================

            updateNextPiece();

            // ==========================================
            // HANDLE PIECE LANDED
            // ==========================================

            function handlePieceLanded() {
                // Game already over
                if (gameOver) {
                    console.log(
                        "SPAWN BLOCKED - GAME OVER"
                    );

                    return;
                }

                // ======================================
                // CHECK GAME OVER
                // ======================================

                if (
                    boardState.isGameOver()
                ) {
                    triggerGameOver();

                    return;
                }

                // ======================================
                // SPAWN NEXT
                // ======================================

                spawnPiece();
            }

            // ==========================================
            // SPAWN PIECE
            // ==========================================

            async function spawnPiece() {
                // ======================================
                // GAME OVER CHECK
                // ======================================

                if (gameOver) {
                    console.log(
                        "SPAWN BLOCKED - GAME OVER"
                    );

                    return;
                }

                // ======================================
                // CURRENT PIECE
                // ======================================

                const pieceType =
                    nextPieceType;

                // ======================================
                // GENERATE NEXT
                // ======================================

                nextPieceType =
                    pieceBag.next();

                console.log(
                    "CURRENT PIECE:",
                    pieceType
                );

                console.log(
                    "NEXT PIECE:",
                    nextPieceType
                );

                // ======================================
                // UPDATE NEXT PREVIEW
                // ======================================

                updateNextPiece();

                // ======================================
                // I PIECE
                // ======================================

                if (pieceType === "I") {
                    await IPiece({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // O PIECE
                // ======================================

                if (pieceType === "O") {
                    await OPiece({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // T PIECE
                // ======================================

                if (pieceType === "T") {
                    await TPiece({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // Z PIECE
                // ======================================

                if (pieceType === "Z") {
                    await ZPieces({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // S PIECE
                // ======================================

                if (pieceType === "S") {
                    await SPieces({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // J PIECE
                // ======================================

                if (pieceType === "J") {
                    await JPieces({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // L PIECE
                // ======================================

                if (pieceType === "L") {
                    await LPiece({
                        app,
                        boardX,
                        config,
                        boardState,

                        spawnNext:
                            handlePieceLanded,
                    });

                    return;
                }

                // ======================================
                // UNSUPPORTED
                // ======================================

                console.log(
                    `${pieceType} is not implemented yet.`
                );

                await handlePieceLanded();
            }

            // ==========================================
            // START GAME
            // ==========================================

            await spawnPiece();
        }

        // ============================================
        // START PIXI
        // ============================================

        init();

        // ============================================
        // CLEANUP
        // ============================================

        return () => {
            if (app) {
                app.destroy(true);
                app = null;
            }
        };
    }, []);

    // ================================================
    // REACT ELEMENT
    // ================================================

    return (
        <div ref={containerRef} />
    );
}