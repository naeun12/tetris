// "NEXT" panel: shows the upcoming piece.

import NextPiece from './NextPiece.jsx';

export default function NextBox({ pieceName }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-[11px] font-semibold tracking-[0.25em] text-slate-400">
        NEXT
      </span>
      <div className="flex h-16 w-20 items-center justify-center">
        {pieceName ? (
          <NextPiece pieceName={pieceName} />
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>
    </div>
  );
}
