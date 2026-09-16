// Main Tetris game: owns the game loop, input, hold/next state and
// lays out the board with the hold + next panels.

import { useCallback, useEffect, useRef, useState } from 'react';
import Board from './component/Board.jsx';
import HoldBox from './component/HoldBox.jsx';
import NextBox from './component/NextBox.jsx';
import { PIECES, cloneShape } from './component/board/pieces/Pieces.jsx';
import { PieceBag } from './component/board/pieces/PieceBag.jsx';
import {
  createEmptyBoard,
  lockPieceToBoard,
  clearLines,
} from './component/board/BoardState.js';
import { isValidPosition } from './component/board/collision/Collision.js';
import {
  tryRotate,
  getHardDropY,
} from './component/board/movement/Movement.js';
import {
  BOARD_WIDTH,
  DROP_INTERVAL_MS,
  SOFT_DROP_SCORE,
} from './component/board/config/BoardConfig.js';

/** Creates a fresh falling piece (with its own shape copy) for a name. */
function spawnPiece(name) {
  const def = PIECES[name];
  return {
    name,
    shape: cloneShape(def.shape),
    x: Math.floor((BOARD_WIDTH - def.shape[0].length) / 2),
    y: 0,
    color: def.color,
  };
}

export default function Tetris() {
  // Mutable game state read every frame by the Pixi board (no re-renders).
  const gameData = useRef({ board: createEmptyBoard(), piece: null });
  const bagRef = useRef(null);
  const dropAccumRef = useRef(0);

  // UI state (drives React re-renders for the panels).
  const [score, setScore] = useState(0);
  const [holdName, setHoldName] = useState(null);
  const [nextName, setNextName] = useState(null);
  const [canHold, setCanHold] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // ── Lock the active piece, clear lines, spawn the next one ──
  const lockAndSpawn = useCallback(() => {
    const { board, piece } = gameData.current;
    if (!piece) return;

    const withPiece = lockPieceToBoard(board, piece);
    const { board: clearedBoard, score: lineScore } = clearLines(withPiece);

    const spawned = spawnPiece(bagRef.current.next());
    gameData.current.board = clearedBoard;
    gameData.current.piece = spawned;
    dropAccumRef.current = 0;

    if (lineScore) setScore((s) => s + lineScore);
    setNextName(bagRef.current.next());
    setCanHold(true);

    if (
      !isValidPosition(spawned.shape, clearedBoard, spawned.x, spawned.y)
    ) {
      setGameOver(true);
    }
  }, []);

  // ── Start / restart the game ──
  const reset = useCallback(() => {
    bagRef.current = new PieceBag();
    gameData.current.board = createEmptyBoard();
    gameData.current.piece = spawnPiece(bagRef.current.next());
    dropAccumRef.current = 0;
    setScore(0);
    setHoldName(null);
    setNextName(bagRef.current.next());
    setCanHold(true);
    setGameOver(false);
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  // ── Hold (press C) — swap current piece into the hold box ──
  const hold = useCallback(() => {
    if (!canHold || gameOver) return;
    const piece = gameData.current.piece;
    if (!piece) return;

    if (holdName) {
      // Swap: held piece comes back, current piece is stored.
      setHoldName(piece.name);
      gameData.current.piece = spawnPiece(holdName);
    } else {
      // First hold: current goes to the box, "next" becomes current.
      setHoldName(piece.name);
      gameData.current.piece = spawnPiece(nextName);
    }
    dropAccumRef.current = 0;
    setNextName(bagRef.current.next());
    setCanHold(false);
  }, [canHold, gameOver, holdName, nextName]);

  // ── Gravity loop (requestAnimationFrame, ms-based) ──
  useEffect(() => {
    if (gameOver) return;
    let raf;
    let last = performance.now();

    const loop = (now) => {
      const dt = now - last;
      last = now;
      const { board, piece } = gameData.current;
      if (piece) {
        dropAccumRef.current += dt;
        if (dropAccumRef.current >= DROP_INTERVAL_MS) {
          dropAccumRef.current = 0;
          if (isValidPosition(piece.shape, board, piece.x, piece.y + 1)) {
            piece.y += 1;
          } else {
            lockAndSpawn();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [gameOver, lockAndSpawn]);

  // ── Keyboard controls ──
  useEffect(() => {
    const onKey = (e) => {
      if (gameOver) return;
      const { board, piece } = gameData.current;
      if (!piece) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (isValidPosition(piece.shape, board, piece.x - 1, piece.y)) {
            piece.x -= 1;
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isValidPosition(piece.shape, board, piece.x + 1, piece.y)) {
            piece.x += 1;
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (isValidPosition(piece.shape, board, piece.x, piece.y + 1)) {
            piece.y += 1;
            dropAccumRef.current = 0;
            setScore((s) => s + SOFT_DROP_SCORE);
          } else {
            lockAndSpawn();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (e.repeat) return; // no rotation on held key
          {
            const rotated = tryRotate(piece.shape, board, piece.x, piece.y);
            if (rotated) Object.assign(piece, rotated);
          }
          break;
        case ' ':
          e.preventDefault();
          if (e.repeat) return;
          {
            piece.y = getHardDropY(piece.shape, board, piece.x, piece.y);
            dropAccumRef.current = 0;
            lockAndSpawn();
          }
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          if (e.repeat) return;
          hold();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameOver, hold, lockAndSpawn]);

  return (
    <div className="flex min-h-screen select-none items-center justify-center bg-[#12121f] font-mono text-slate-200">
      <div className="flex items-start gap-6">
        {/* Left column: title / score / board */}
        <Board
          gameData={gameData}
          score={score}
          gameOver={gameOver}
          onRestart={reset}
        />

        {/* Right column: hold + next */}
        <div className="flex flex-col gap-4 pt-10">
          <HoldBox pieceName={holdName} available={canHold} />
          <NextBox pieceName={nextName} />
        </div>
      </div>
    </div>
  );
}
