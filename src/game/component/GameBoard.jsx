import { useEffect, useRef, useState, useCallback } from "react";

import { playSfx } from "../audio/SfxPlayer";
import { getControls } from "../gameSettings/ControlsSetting";
import { Application } from "@pixi/react";

import {
    getLineAttack,
    getTSpinAttack,
    getTSpinMiniAttack,
    getSpinAttack,
} from "../scoring/Attack";

import { updateB2B } from "../scoring/BackToBack";

import {
    BOARD_WIDTH,
    VISIBLE_HEIGHT,
    CELL_SIZE,
    COLORS,
    TICK_BASE_MS,
    TICK_MIN_MS,
    LOCK_DELAY_MS,
    getDAS,
    getARR,
    getDCD,
    getSDF,
} from "./board/config/BoardConfig";

import { PIECES } from "./board/pieces/Pieces";
import PieceBag from "./board/pieces/PieceBag";

import {
    createEmptyBoard,
    mergePiece,
    clearLines,
} from "./board/BoardState";

import { collides } from "./board/collision/Collision";

import {
    tryMove,
    tryRotate,
    getDropY,
    getSpinType,
} from "./board/movement/Movement";

import Board from "./Board";
import HoldBox from "./HoldBox";
import NextBox from "./NextBox";

import styles from "../../styles/gameComponent/GameBoard.module.css";

const GameBoard = ({ stats = null }) => {
    const bagRef = useRef(new PieceBag());

    const spawnPiece = useCallback((type) => {
        const piece = PIECES[type];

        return {
            type,
            shape: piece.shape,
            image: piece.image,
            x: Math.floor(
                (BOARD_WIDTH - piece.shape[0].length) / 2
            ),
            y: -1,
            rotation: "0",
            lastRotation: false,
            rotationDirection: 0,
        };
    }, []);

    const [board, setBoard] = useState(createEmptyBoard);

    const [piece, setPiece] = useState(() =>
        spawnPiece(bagRef.current.next())
    );

    const [hold, setHold] = useState(null);
    const [canHold, setCanHold] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [lockTimer, setLockTimer] = useState(null);

    const boardRef = useRef(board);
    const pieceRef = useRef(piece);

    const horizontalFrameRef = useRef(null);
    const softDropFrameRef = useRef(null);

    const softDropStateRef = useRef({
        active: false,
        nextAt: 0,
    });

    const heldKeysRef = useRef({
        left: false,
        right: false,
        down: false,
    });

    const horizontalStateRef = useRef({
        direction: 0,
        dasAt: 0,
        arrAt: 0,
        switching: false,
        switchDirection: 0,
        switchAt: 0,
        wallReached: false,
    });

    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    useEffect(() => {
        pieceRef.current = piece;
    }, [piece]);

    const cancelHorizontalFrame = useCallback(() => {
        if (horizontalFrameRef.current !== null) {
            cancelAnimationFrame(
                horizontalFrameRef.current
            );

            horizontalFrameRef.current = null;
        }
    }, []);

    const resetHorizontalState = useCallback(() => {
        horizontalStateRef.current = {
            direction: 0,
            dasAt: 0,
            arrAt: 0,
            switching: false,
            switchDirection: 0,
            switchAt: 0,
            wallReached: false,
        };
    }, []);

    const clearHorizontalTimers = useCallback(() => {
        cancelHorizontalFrame();
        resetHorizontalState();
    }, [
        cancelHorizontalFrame,
        resetHorizontalState,
    ]);

    const clearHandlingTimers = useCallback(() => {
        clearHorizontalTimers();

        if (softDropFrameRef.current !== null) {
            cancelAnimationFrame(
                softDropFrameRef.current
            );

            softDropFrameRef.current = null;
        }

        softDropStateRef.current = {
            active: false,
            nextAt: 0,
        };
    }, [clearHorizontalTimers]);

    const lockPiece = useCallback(
    (lockedPiece) => {
        if (gameOver) {
            return;
        }

        const currentBoard =
            boardRef.current;

        const merged = mergePiece(
            currentBoard,
            lockedPiece
        );

        const {
            board: clearedBoard,
            cleared,
        } = clearLines(merged);

        if (stats) {
            stats.addPiece(
                lockedPiece
            );

            const spinType =
                getSpinType(
                    currentBoard,
                    lockedPiece,
                    cleared
                );

            const isTSpin =
                lockedPiece.type === "T" &&
                spinType !== null &&
                spinType.startsWith(
                    "TSPIN"
                );

            const isSpin =
                spinType !== null &&
                spinType.includes(
                    "SPIN"
                );

            if (cleared > 0) {
                stats.addLines(
                    cleared
                );
            }

            let attack = 0;

            if (isTSpin) {
                attack =
                    getTSpinAttack(
                        cleared
                    );
            } else if (isSpin) {
                attack =
                    getSpinAttack(
                        cleared
                    );
            } else {
                attack =
                    getLineAttack(
                        cleared
                    );
            }

            if (attack > 0) {
                stats.addAttack(
                    attack
                );
            }

            const clearType =
                spinType !== null
                    ? spinType
                    : cleared === 4
                        ? "TETRIS"
                        : `${cleared} LINE`;

            if (
                clearType === "TETRIS" ||
                spinType !== null
            ) {
                const b2bState =
                    updateB2B(
                        stats.backToBack,
                        clearType
                    );

                if (
                    b2bState.active
                ) {
                    stats.addBackToBack();
                }
            } else if (
                cleared > 0
            ) {
                stats.resetBackToBack();
            }
        }

        boardRef.current =
            clearedBoard;

        setBoard(
            clearedBoard
        );

        const nextType =
            bagRef.current.next();

        const nextPiece =
            spawnPiece(nextType);

        if (
            collides(
                clearedBoard,
                nextPiece.shape,
                nextPiece.x,
                nextPiece.y
            )
        ) {
            setGameOver(true);
            clearHandlingTimers();
            setLockTimer(null);
            return;
        }

        pieceRef.current =
            nextPiece;

        setPiece(
            nextPiece
        );

        setCanHold(true);
        setLockTimer(null);
    },
    [
        gameOver,
        spawnPiece,
        clearHandlingTimers,
        stats,
    ]
);

    const movePiece = useCallback(
        (dx, dy) => {
            if (gameOver) {
                return false;
            }

            const currentBoard =
                boardRef.current;

            const currentPiece =
                pieceRef.current;

            const moved = tryMove(
                currentBoard,
                currentPiece,
                dx,
                dy
            );

            if (!moved) {
                return false;
            }

            pieceRef.current = moved;
            setPiece(moved);
            setLockTimer(null);

            return true;
        },
        [gameOver]
    );

    const moveToWall = useCallback(
        (direction) => {
            if (gameOver) {
                return false;
            }

            const currentBoard =
                boardRef.current;

            let currentPiece =
                pieceRef.current;

            let moved = false;

            while (true) {
                const nextPiece = tryMove(
                    currentBoard,
                    currentPiece,
                    direction,
                    0
                );

                if (!nextPiece) {
                    break;
                }

                currentPiece = nextPiece;
                moved = true;
            }

            if (moved) {
                pieceRef.current =
                    currentPiece;

                setPiece(currentPiece);
                setLockTimer(null);
            }

            return moved;
        },
        [gameOver]
    );

    const softDrop = useCallback(() => {
        if (gameOver) {
            return false;
        }

        const currentBoard =
            boardRef.current;

        const currentPiece =
            pieceRef.current;

        if (!currentPiece) {
            return false;
        }

        const moved = tryMove(
            currentBoard,
            currentPiece,
            0,
            1
        );

        if (moved) {
            pieceRef.current = moved;
            setPiece(moved);
            setLockTimer(null);

            return true;
        }

        setLockTimer((currentTimer) =>
            currentTimer === null
                ? Date.now()
                : currentTimer
        );

        return false;
    }, [gameOver]);

    const startSoftDrop = useCallback(() => {
        if (gameOver) {
            return;
        }

        if (
            softDropStateRef.current.active
        ) {
            return;
        }

        const sdf = Math.max(
            1,
            Math.min(
                40,
                Number(getSDF()) || 1
            )
        );

        const gravitySpeed = Math.max(
            TICK_MIN_MS,
            TICK_BASE_MS
        );

        const interval =
            sdf >= 40
                ? 1
                : Math.max(
                      1,
                      gravitySpeed / sdf
                  );

        softDropStateRef.current = {
            active: true,
            nextAt: performance.now(),
        };

        const loop = (time) => {
            if (
                !softDropStateRef.current
                    .active ||
                gameOver
            ) {
                softDropFrameRef.current =
                    null;

                return;
            }

            if (
                time >=
                softDropStateRef.current
                    .nextAt
            ) {
                softDrop();

                softDropStateRef.current.nextAt =
                    time + interval;
            }

            softDropFrameRef.current =
                requestAnimationFrame(loop);
        };

        softDropFrameRef.current =
            requestAnimationFrame(loop);
    }, [gameOver, softDrop]);

    const stopSoftDrop = useCallback(() => {
        softDropStateRef.current.active =
            false;

        if (
            softDropFrameRef.current !== null
        ) {
            cancelAnimationFrame(
                softDropFrameRef.current
            );

            softDropFrameRef.current = null;
        }
    }, []);

    const rotate = useCallback(
        (direction) => {
            if (gameOver) {
                return false;
            }

            const currentBoard =
                boardRef.current;

            const currentPiece =
                pieceRef.current;

            const rotated = tryRotate(
                currentBoard,
                currentPiece,
                direction
            );

            if (!rotated) {
                return false;
            }

            pieceRef.current = rotated;
            setPiece(rotated);
            setLockTimer(null);

            return true;
        },
        [gameOver]
    );

    const hardDrop = useCallback(() => {
        if (gameOver) {
            return;
        }

        const currentBoard =
            boardRef.current;

        const currentPiece =
            pieceRef.current;

        if (!currentPiece) {
            return;
        }

        playSfx("drop");

        const y = getDropY(
            currentBoard,
            currentPiece
        );

        const dropped = {
            ...currentPiece,
            y,
        };

        clearHandlingTimers();
        setLockTimer(null);

        lockPiece(dropped);
    }, [
        gameOver,
        clearHandlingTimers,
        lockPiece,
    ]);

    const holdPiece = useCallback(() => {
        if (
            canHold === false ||
            gameOver
        ) {
            return;
        }

        const currentPiece =
            pieceRef.current;

        if (!currentPiece) {
            return;
        }

        clearHandlingTimers();
        setLockTimer(null);

        const currentType =
            currentPiece.type;

        if (hold) {
            playSfx("hold");

            const newPiece =
                spawnPiece(hold);

            if (
                collides(
                    boardRef.current,
                    newPiece.shape,
                    newPiece.x,
                    newPiece.y
                )
            ) {
                setGameOver(true);
                clearHandlingTimers();
                return;
            }

            pieceRef.current = newPiece;
            setPiece(newPiece);
        } else {
            const nextType =
                bagRef.current.next();

            const newPiece =
                spawnPiece(nextType);

            if (
                collides(
                    boardRef.current,
                    newPiece.shape,
                    newPiece.x,
                    newPiece.y
                )
            ) {
                setGameOver(true);
                clearHandlingTimers();
                return;
            }

            pieceRef.current = newPiece;
            setPiece(newPiece);
        }

        setHold(currentType);
        setCanHold(false);
    }, [
        canHold,
        gameOver,
        hold,
        spawnPiece,
        clearHandlingTimers,
    ]);

    const tickRef = useRef(() => {});

    tickRef.current = () => {
        if (gameOver) {
            return;
        }

        const currentBoard =
            boardRef.current;

        const currentPiece =
            pieceRef.current;

        const moved = tryMove(
            currentBoard,
            currentPiece,
            0,
            1
        );

        if (moved) {
            pieceRef.current = moved;
            setPiece(moved);
            setLockTimer(null);
        } else {
            setLockTimer((currentTimer) =>
                currentTimer === null
                    ? Date.now()
                    : currentTimer
            );
        }
    };

    useEffect(() => {
        if (gameOver) {
            return;
        }

        const speed = Math.max(
            TICK_MIN_MS,
            TICK_BASE_MS
        );

        const id = setInterval(() => {
            tickRef.current();
        }, speed);

        return () => {
            clearInterval(id);
        };
    }, [gameOver]);

    useEffect(() => {
        if (
            lockTimer === null ||
            gameOver
        ) {
            return;
        }

        const id = setTimeout(() => {
            if (gameOver) {
                return;
            }

            const currentBoard =
                boardRef.current;

            const currentPiece =
                pieceRef.current;

            const canMoveDown = tryMove(
                currentBoard,
                currentPiece,
                0,
                1
            );

            if (!canMoveDown) {
                lockPiece(currentPiece);
            } else {
                pieceRef.current =
                    canMoveDown;

                setPiece(canMoveDown);
            }

            setLockTimer(null);
        }, LOCK_DELAY_MS);

        return () => {
            clearTimeout(id);
        };
    }, [
        lockTimer,
        gameOver,
        lockPiece,
    ]);

    const horizontalLoop = useCallback(
        (time) => {
            if (gameOver) {
                horizontalFrameRef.current =
                    null;

                return;
            }

            const state =
                horizontalStateRef.current;

            const direction =
                state.direction;

            if (!direction) {
                horizontalFrameRef.current =
                    null;

                return;
            }

            const das = Math.max(
                0,
                Number(getDAS()) || 0
            );

            const arr = Math.max(
                0,
                Number(getARR()) || 0
            );

            const dcd = Math.max(
                0,
                Number(getDCD()) || 0
            );

            if (state.switching) {
                if (
                    time >=
                    state.switchAt
                ) {
                    state.switching = false;

                    state.direction =
                        state.switchDirection;

                    state.dasAt =
                        time + das;

                    state.arrAt =
                        time + das;

                    movePiece(
                        state.direction,
                        0
                    );
                }
            } else if (
                time >= state.dasAt
            ) {
                if (arr === 0) {
                    moveToWall(direction);
                } else if (
                    time >= state.arrAt
                ) {
                    const moved =
                        movePiece(
                            direction,
                            0
                        );

                    if (!moved) {
                        state.wallReached =
                            true;
                    }

                    state.arrAt =
                        time + arr;
                }
            }

            horizontalFrameRef.current =
                requestAnimationFrame(
                    horizontalLoop
                );
        },
        [
            gameOver,
            movePiece,
            moveToWall,
        ]
    );

    const startHorizontalMovement =
        useCallback(
            (direction) => {
                if (gameOver) {
                    return;
                }

                const now =
                    performance.now();

                const das = Math.max(
                    0,
                    Number(getDAS()) || 0
                );

                const arr = Math.max(
                    0,
                    Number(getARR()) || 0
                );

                const state =
                    horizontalStateRef.current;

                state.direction =
                    direction;

                state.switching = false;
                state.switchDirection = 0;
                state.wallReached = false;

                movePiece(direction, 0);

                state.dasAt =
                    now + das;

                state.arrAt =
                    now +
                    das +
                    Math.max(arr, 1);

                cancelHorizontalFrame();

                horizontalFrameRef.current =
                    requestAnimationFrame(
                        horizontalLoop
                    );
            },
            [
                gameOver,
                movePiece,
                cancelHorizontalFrame,
                horizontalLoop,
            ]
        );

    useEffect(() => {
        const onKeyDown = (e) => {
            const controls =
                getControls();

            if (gameOver) {
                e.preventDefault();
                return;
            }

            if (e.repeat) {
                if (
                    e.code ===
                        controls.moveLeft ||
                    e.code ===
                        controls.moveRight
                ) {
                    e.preventDefault();
                }

                return;
            }

            if (
                e.code ===
                    controls.moveLeft ||
                e.code ===
                    controls.moveRight ||
                e.code ===
                    controls.softDrop ||
                e.code ===
                    controls.hardDrop ||
                e.code ===
                    controls.rotateCW ||
                e.code ===
                    controls.rotateCCW ||
                e.code ===
                    controls.rotate180 ||
                e.code ===
                    controls.hold
            ) {
                e.preventDefault();
            }

            if (
                e.code ===
                controls.moveLeft
            ) {
                heldKeysRef.current.left =
                    true;

                if (
                    !heldKeysRef.current
                        .right
                ) {
                    startHorizontalMovement(
                        -1
                    );
                }

                return;
            }

            if (
                e.code ===
                controls.moveRight
            ) {
                heldKeysRef.current.right =
                    true;

                if (
                    !heldKeysRef.current
                        .left
                ) {
                    startHorizontalMovement(
                        1
                    );
                }

                return;
            }

            if (
                e.code ===
                controls.softDrop
            ) {
                heldKeysRef.current.down =
                    true;

                startSoftDrop();
                return;
            }

            if (
                e.code ===
                controls.rotateCW
            ) {
                rotate(1);
                return;
            }

            if (
                e.code ===
                controls.rotateCCW
            ) {
                rotate(-1);
                return;
            }

            if (
                e.code ===
                controls.rotate180
            ) {
                rotate(2);
                return;
            }

            if (
                e.code ===
                controls.hardDrop
            ) {
                hardDrop();
                return;
            }

            if (
                e.code ===
                controls.hold
            ) {
                holdPiece();
                return;
            }

            if (
                e.code ===
                controls.pause
            ) {
                return;
            }
        };

        const onKeyUp = (e) => {
            const controls =
                getControls();

            if (gameOver) {
                return;
            }

            if (
                e.code ===
                controls.moveLeft
            ) {
                heldKeysRef.current.left =
                    false;

                if (
                    heldKeysRef.current
                        .right
                ) {
                    const dcd = Math.max(
                        0,
                        Number(getDCD()) || 0
                    );

                    const state =
                        horizontalStateRef.current;

                    if (dcd === 0) {
                        state.direction = 1;
                        state.switching = false;

                        movePiece(1, 0);

                        const now =
                            performance.now();

                        const das =
                            Math.max(
                                0,
                                Number(
                                    getDAS()
                                ) || 0
                            );

                        const arr =
                            Math.max(
                                0,
                                Number(
                                    getARR()
                                ) || 0
                            );

                        state.dasAt =
                            now + das;

                        state.arrAt =
                            now +
                            das +
                            Math.max(
                                arr,
                                1
                            );
                    } else {
                        state.switching =
                            true;

                        state.switchDirection =
                            1;

                        state.switchAt =
                            performance.now() +
                            dcd;
                    }
                } else {
                    resetHorizontalState();
                    cancelHorizontalFrame();
                }

                return;
            }

            if (
                e.code ===
                controls.moveRight
            ) {
                heldKeysRef.current.right =
                    false;

                if (
                    heldKeysRef.current
                        .left
                ) {
                    const dcd = Math.max(
                        0,
                        Number(getDCD()) || 0
                    );

                    const state =
                        horizontalStateRef.current;

                    if (dcd === 0) {
                        state.direction = -1;
                        state.switching = false;

                        movePiece(-1, 0);

                        const now =
                            performance.now();

                        const das =
                            Math.max(
                                0,
                                Number(
                                    getDAS()
                                ) || 0
                            );

                        const arr =
                            Math.max(
                                0,
                                Number(
                                    getARR()
                                ) || 0
                            );

                        state.dasAt =
                            now + das;

                        state.arrAt =
                            now +
                            das +
                            Math.max(
                                arr,
                                1
                            );
                    } else {
                        state.switching =
                            true;

                        state.switchDirection =
                            -1;

                        state.switchAt =
                            performance.now() +
                            dcd;
                    }
                } else {
                    resetHorizontalState();
                    cancelHorizontalFrame();
                }

                return;
            }

            if (
                e.code ===
                controls.softDrop
            ) {
                heldKeysRef.current.down =
                    false;

                stopSoftDrop();
            }
        };

        window.addEventListener(
            "keydown",
            onKeyDown
        );

        window.addEventListener(
            "keyup",
            onKeyUp
        );

        return () => {
            window.removeEventListener(
                "keydown",
                onKeyDown
            );

            window.removeEventListener(
                "keyup",
                onKeyUp
            );

            clearHandlingTimers();
        };
    }, [
        gameOver,
        startHorizontalMovement,
        startSoftDrop,
        stopSoftDrop,
        rotate,
        hardDrop,
        holdPiece,
        movePiece,
        resetHorizontalState,
        cancelHorizontalFrame,
        clearHandlingTimers,
    ]);

    const ghostY = getDropY(
        board,
        piece
    );

    return (
        <div className={styles.game}>
            <div className={styles.holdArea}>
                <HoldBox type={hold} />
            </div>

            <div className={styles.boardWrap}>
                <Application
                    width={
                        BOARD_WIDTH *
                        CELL_SIZE
                    }
                    height={
                        VISIBLE_HEIGHT *
                        CELL_SIZE
                    }
                    background={
                        COLORS.background
                    }
                >
                    <Board
                        board={board}
                        piece={piece}
                        ghostY={ghostY}
                        stats={stats}
                    />
                </Application>
            </div>

            <div className={styles.side}>
                <NextBox
                    types={bagRef.current.peek(3)}
                />
            </div>
        </div>
    );
};

export default GameBoard;