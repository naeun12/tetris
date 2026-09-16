// Renders a single tetromino as a mini CSS grid of colored cells.
// Reused by the Next box and the Hold box.

import { PIECES } from './board/pieces/Pieces.jsx';

const DEFAULT_CELL = 16;

export default function NextPiece({ pieceName, cellSize = DEFAULT_CELL }) {
  const piece = pieceName ? PIECES[pieceName] : null;
  if (!piece) {
    return <div style={{ width: cellSize * 3, height: cellSize * 3 }} />;
  }
  const { shape, color } = piece;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
      }}
    >
      {shape.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={
              cell
                ? {
                    margin: 1,
                    background: color,
                    borderRadius: 3,
                    boxShadow:
                      'inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(0,0,0,0.3)',
                  }
                : undefined
            }
          />
        ))
      )}
    </div>
  );
}
