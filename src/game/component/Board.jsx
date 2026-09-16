// The board area: title + score header, the playable GameBoard and the
// game-over overlay. The actual grid/Pixi rendering lives in GameBoard.

import { BOARD_WIDTH_PX } from '../component/config/BoardConfig.js';
import GameBoard from './GameBoard.jsx';

export default function Board({ gameData, score, gameOver, onRestart }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-end justify-between"
        style={{ width: BOARD_WIDTH_PX }}
      >
        <h1 className="text-2xl font-bold tracking-[0.3em] text-white">
          TETRIS
        </h1>
        <div className="text-right">
          <div className="text-[10px] tracking-[0.25em] text-slate-500">
            SCORE
          </div>
          <div className="text-xl tabular-nums text-cyan-300">{score}</div>
        </div>
      </div>

      <div className="relative">
        <GameBoard gameData={gameData} />

        {gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/75">
            <p className="text-2xl font-bold tracking-[0.25em] text-red-400">
              GAME OVER
            </p>
            <p className="text-sm tabular-nums text-slate-400">
              Final score: {score}
            </p>
            <button
              onClick={onRestart}
              className="rounded bg-cyan-500 px-5 py-2 text-sm font-bold tracking-widest text-slate-950 transition hover:bg-cyan-400"
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <p
        className="text-[10px] leading-relaxed text-slate-500"
        style={{ width: BOARD_WIDTH_PX }}
      >
        ← → move · ↓ soft drop · ↑ rotate · SPACE hard drop · C hold
      </p>
    </div>
  );
}
