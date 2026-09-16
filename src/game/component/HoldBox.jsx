// "HOLD" panel: shows the stored piece (press C to swap it in).

import NextPiece from './NextPiece.jsx';

export default function HoldBox({ pieceName, available }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-[11px] font-semibold tracking-[0.25em] text-slate-400">
        HOLD
      </span>
      <div className="flex h-16 w-20 items-center justify-center">
        {pieceName ? (
          <div style={{ opacity: available ? 1 : 0.35, transition: 'opacity 150ms' }}>
            <NextPiece pieceName={pieceName} />
          </div>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </div>
      <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
        C
      </span>
    </div>
  );
}
