/** @format */

import { useEffect, useRef, useState, useCallback } from "react";

import { Application } from "@pixi/react";

import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    CELL_SIZE,
    COLORS,
    SCORE_TABLE,
    TICK_BASE_MS,
    TICK_MIN_MS,
    TICK_LEVEL_STEP_MS,
    LOCK_DELAY_MS,
    DAS_MS,
    ARR_MS,
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
} from "./board/movement/Movement";

import Board from "./Board";
import HoldBox from "./HoldBox";
import NextBox from "./NextBox";
import LevelIndicator from "./indicators/LevelIndicator";

import styles from "../../styles/gameComponent/GameBoard.module.css";


/* =========================================================
   SPAWN PIECE
========================================================= */

const spawnPiece = (type) => {
    const piece = PIECES[type];

    return {
        type,
        shape: piece.shape,
        image: piece.image,
        x: Math.floor(
            (BOARD_WIDTH - piece.shape[0].length) / 2
        ),
        y: 0,
    };
};


/* =========================================================
   GAME BOARD
========================================================= */

const GameBoard = () => {

    /* =====================================================
       PIECE BAG
    ===================================================== */

    const bagRef = useRef(null);

    if (bagRef.current === null) {
        bagRef.current = new PieceBag();
    }


    /* =====================================================
       GAME STATE
    ===================================================== */

    const [board, setBoard] = useState(
        createEmptyBoard
    );

    const [piece, setPiece] = useState(() =>
        spawnPiece(
            bagRef.current.next()
        )
    );

    const [hold, setHold] = useState(null);

    const [canHold, setCanHold] = useState(true);

    const [score, setScore] = useState(0);

    const [lines, setLines] = useState(0);

    const [gameOver, setGameOver] = useState(false);


    /* =====================================================
       LOCK DELAY
    ===================================================== */

    const [lockTimer, setLockTimer] = useState(null);


    /* =====================================================
       DAS / ARR
    ===================================================== */

    const dasTimerRef = useRef(null);

    const arrTimerRef = useRef(null);

    const heldDirectionRef = useRef(null);


    /* =====================================================
       LEVEL
    ===================================================== */

    const level =
        Math.floor(lines / 10) + 1;


    /* =====================================================
       GHOST PIECE
    ===================================================== */

    const ghostY =
        getDropY(board, piece);


    /* =====================================================
       CLEAR DAS / ARR
    ===================================================== */

    const clearHorizontalTimers =
        useCallback(() => {

            if (dasTimerRef.current) {
                clearTimeout(
                    dasTimerRef.current
                );

                dasTimerRef.current = null;
            }

            if (arrTimerRef.current) {
                clearInterval(
                    arrTimerRef.current
                );

                arrTimerRef.current = null;
            }

            heldDirectionRef.current = null;

        }, []);


    /* =====================================================
       LOCK PIECE
    ===================================================== */

    const lockPiece = useCallback(
        (lockedPiece) => {

            const merged =
                mergePiece(
                    board,
                    lockedPiece
                );


            const {
                board: clearedBoard,
                cleared,
            } = clearLines(merged);


            setBoard(clearedBoard);


            /* SCORE */

            if (cleared > 0) {

                const lineScore =
                    SCORE_TABLE[cleared] || 0;

                setScore(
                    (currentScore) =>
                        currentScore +
                        lineScore * level
                );

                setLines(
                    (currentLines) =>
                        currentLines + cleared
                );
            }


            /* NEXT PIECE */

            const next =
                spawnPiece(
                    bagRef.current.next()
                );


            /* GAME OVER CHECK */

            if (
                collides(
                    clearedBoard,
                    next.shape,
                    next.x,
                    next.y
                )
            ) {

                setGameOver(true);

                clearHorizontalTimers();

                return;
            }


            setPiece(next);

            setCanHold(true);

            setLockTimer(null);

        },
        [
            board,
            level,
            clearHorizontalTimers,
        ]
    );


    /* =====================================================
       NORMAL MOVEMENT
    ===================================================== */

    const movePiece = useCallback(
        (dx, dy) => {

            const moved =
                tryMove(
                    board,
                    piece,
                    dx,
                    dy
                );


            if (moved) {

                setPiece(moved);

                /*
                    Any successful movement
                    resets lock delay.
                */

                setLockTimer(null);
            }

        },
        [
            board,
            piece,
        ]
    );


    /* =====================================================
       SOFT DROP
    ===================================================== */

    const softDrop = useCallback(() => {

        const moved =
            tryMove(
                board,
                piece,
                0,
                1
            );


        if (moved) {

            setPiece(moved);

            setScore(
                (currentScore) =>
                    currentScore + 1
            );

            setLockTimer(null);

        } else {

            /*
                Start lock delay.
            */

            if (lockTimer === null) {

                setLockTimer(
                    Date.now()
                );
            }
        }

    }, [
        board,
        piece,
        lockTimer,
    ]);


    /* =====================================================
       ROTATION
       
       dir = 1   -> 90° clockwise
       dir = -1  -> 90° counter-clockwise
       dir = 2   -> 180°
    ===================================================== */

    const rotate = useCallback(
        (dir) => {

            const rotated =
                tryRotate(
                    board,
                    piece,
                    dir
                );


            if (rotated) {

                setPiece(rotated);

                /*
                    Rotation resets lock delay.
                */

                setLockTimer(null);
            }

        },
        [
            board,
            piece,
        ]
    );


    /* =====================================================
       HARD DROP
    ===================================================== */

    const hardDrop = useCallback(() => {

        const y =
            getDropY(
                board,
                piece
            );


        const dropped = {
            ...piece,
            y,
        };


        const distance =
            y - piece.y;


        setScore(
            (currentScore) =>
                currentScore +
                distance * 2
        );


        clearHorizontalTimers();

        setLockTimer(null);


        /*
            Hard drop locks immediately.
        */

        lockPiece(dropped);

    }, [
        board,
        piece,
        lockPiece,
        clearHorizontalTimers,
    ]);


    /* =====================================================
       HOLD
    ===================================================== */

    const holdPiece = useCallback(() => {

        if (!canHold) {
            return;
        }


        clearHorizontalTimers();

        setLockTimer(null);


        const current =
            piece.type;


        /* ================================================
           THERE IS ALREADY A HOLD PIECE
        ================================================ */

        if (hold) {

            const swapped =
                spawnPiece(hold);


            if (
                collides(
                    board,
                    swapped.shape,
                    swapped.x,
                    swapped.y
                )
            ) {

                setGameOver(true);

                return;
            }


            setPiece(swapped);

        }

        /* ================================================
           FIRST HOLD
        ================================================ */

        else {

            const next =
                spawnPiece(
                    bagRef.current.next()
                );

            setPiece(next);
        }


        setHold(current);

        setCanHold(false);

    }, [
        canHold,
        piece.type,
        hold,
        board,
        clearHorizontalTimers,
    ]);


    /* =====================================================
       RESTART
    ===================================================== */

    const restart = useCallback(() => {

        clearHorizontalTimers();

        setLockTimer(null);


        bagRef.current =
            new PieceBag();


        setBoard(
            createEmptyBoard()
        );


        setPiece(
            spawnPiece(
                bagRef.current.next()
            )
        );


        setHold(null);

        setCanHold(true);

        setScore(0);

        setLines(0);

        setGameOver(false);

    }, [
        clearHorizontalTimers,
    ]);


    /* =====================================================
       GRAVITY TICK
    ===================================================== */

    const tickRef =
        useRef(() => {});


    tickRef.current = () => {

        if (gameOver) {
            return;
        }


        const moved =
            tryMove(
                board,
                piece,
                0,
                1
            );


        if (moved) {

            setPiece(moved);

            setLockTimer(null);

        } else {

            /*
                Piece reached the floor.
                Start lock delay.
            */

            if (lockTimer === null) {

                setLockTimer(
                    Date.now()
                );
            }
        }
    };


    /* =====================================================
       GRAVITY INTERVAL
    ===================================================== */

    useEffect(() => {

        if (gameOver) {
            return;
        }


        const speed =
            Math.max(
                TICK_MIN_MS,
                TICK_BASE_MS -
                    (level - 1) *
                        TICK_LEVEL_STEP_MS
            );


        const id =
            setInterval(
                () => {
                    tickRef.current();
                },
                speed
            );


        return () => {
            clearInterval(id);
        };

    }, [
        gameOver,
        level,
    ]);


    /* =====================================================
       LOCK DELAY
    ===================================================== */

    useEffect(() => {

        if (
            lockTimer === null ||
            gameOver
        ) {
            return;
        }


        const id =
            setTimeout(() => {

                /*
                    Check one more time if
                    the piece is still touching
                    the floor.
                */

                const moved =
                    tryMove(
                        board,
                        piece,
                        0,
                        1
                    );


                if (!moved) {

                    lockPiece(piece);

                } else {

                    /*
                        Piece moved again,
                        so don't lock.
                    */

                    setPiece(moved);
                }


                setLockTimer(null);

            }, LOCK_DELAY_MS);


        return () => {
            clearTimeout(id);
        };

    }, [
        lockTimer,
        gameOver,
        board,
        piece,
        lockPiece,
    ]);


    /* =====================================================
       DAS + ARR
    ===================================================== */

    const startHorizontalMovement =
        useCallback(
            (direction) => {

                /*
                    Clear previous direction.
                */

                clearHorizontalTimers();


                /*
                    Initial movement.
                */

                movePiece(
                    direction,
                    0
                );


                heldDirectionRef.current =
                    direction;


                /*
                    DAS
                */

                dasTimerRef.current =
                    setTimeout(() => {

                        /*
                            First repeated movement.
                        */

                        movePiece(
                            direction,
                            0
                        );


                        /*
                            ARR
                        */

                        arrTimerRef.current =
                            setInterval(() => {

                                if (
                                    heldDirectionRef.current ===
                                    direction
                                ) {

                                    movePiece(
                                        direction,
                                        0
                                    );
                                }

                            }, ARR_MS);

                    }, DAS_MS);

            },
            [
                movePiece,
                clearHorizontalTimers,
            ]
        );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    useEffect(() => {

        const onKeyDown = (e) => {

            /*
                Prevent browser scrolling.
            */

            if (
                [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowDown",
                    "ArrowUp",
                    " ",
                ].includes(e.key)
            ) {

                e.preventDefault();
            }


            /* =============================================
               GAME OVER
            ============================================= */

            if (gameOver) {

                if (
                    e.key === "Enter"
                ) {

                    restart();
                }

                return;
            }


            /* =============================================
               LEFT
            ============================================= */

            if (
                e.key === "ArrowLeft"
            ) {

                if (!e.repeat) {

                    startHorizontalMovement(
                        -1
                    );
                }

                return;
            }


            /* =============================================
               RIGHT
            ============================================= */

            if (
                e.key === "ArrowRight"
            ) {

                if (!e.repeat) {

                    startHorizontalMovement(
                        1
                    );
                }

                return;
            }


            /* =============================================
               OTHER CONTROLS
            ============================================= */

            switch (e.key) {

                /*
                    SOFT DROP
                */

                case "ArrowDown":
                    softDrop();
                    break;


                /*
                    90° CLOCKWISE
                    ↑ / X
                */

                case "ArrowUp":
                case "x":
                case "X":

                    rotate(1);

                    break;


                /*
                    90° COUNTER-CLOCKWISE
                    Z
                */

                case "z":
                case "Z":

                    rotate(-1);

                    break;


                /*
                    180° ROTATION
                    A
                */

                case "a":
                case "A":

                    rotate(2);

                    break;


                /*
                    HARD DROP
                    SPACE
                */

                case " ":

                    hardDrop();

                    break;


                /*
                    HOLD
                    C
                */

                case "c":
                case "C":

                    holdPiece();

                    break;


                default:
                    break;
            }
        };


        /* =================================================
           KEY UP
        ================================================= */

        const onKeyUp = (e) => {

            if (
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {

                clearHorizontalTimers();
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

            clearHorizontalTimers();
        };

    }, [
        gameOver,
        restart,
        startHorizontalMovement,
        softDrop,
        rotate,
        hardDrop,
        holdPiece,
        clearHorizontalTimers,
    ]);


    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className={styles.game}>

            {/* HOLD */}

            <div className={styles.holdArea}>

                <HoldBox
                    type={hold}
                />

            </div>


            {/* LEVEL */}

            <LevelIndicator
                level={level}
                lines={lines}
            />


            {/* BOARD */}

            <div
                className={
                    styles.boardWrap
                }
            >

                <Application
                    width={
                        BOARD_WIDTH *
                        CELL_SIZE
                    }
                    height={
                        BOARD_HEIGHT *
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
                    />

                </Application>


                {/* GAME OVER */}

                {gameOver && (

                    <div
                        className={
                            styles.overlay
                        }
                    >

                        <div
                            className={
                                styles.gameOverBox
                            }
                        >

                            <h2>
                                Game Over
                            </h2>

                            <p>
                                Score: {score}
                            </p>

                            <button
                                onClick={
                                    restart
                                }
                            >
                                Restart
                            </button>

                            <span>
                                Press Enter
                            </span>

                        </div>

                    </div>
                )}

            </div>


            {/* SIDE */}

            <div
                className={
                    styles.side
                }
            >

                <NextBox
                    types={
                        bagRef.current.peek(3)
                    }
                />


                {/* STATS */}

                <div
                    className={
                        styles.stats
                    }
                >

                    <div
                        className={
                            styles.statItem
                        }
                    >

                        <h3>
                            Score
                        </h3>

                        <p>
                            {score}
                        </p>

                    </div>


                    <div
                        className={
                            styles.statItem
                        }
                    >

                        <h3>
                            Lines
                        </h3>

                        <p>
                            {lines}
                        </p>

                    </div>


                    <div
                        className={
                            styles.statItem
                        }
                    >

                        <h3>
                            Level
                        </h3>

                        <p>
                            {level}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default GameBoard;