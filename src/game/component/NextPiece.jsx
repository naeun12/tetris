/** @format */

import { PIECES } from "./board/pieces/Pieces";

const NextPiece = ({
    type,
    cellSize = 14,
    offsetX = 0,
    offsetY = 0,
}) => {
    // =========================================================
    // NO PIECE
    // =========================================================

    if (!type) {
        return null;
    }

    // =========================================================
    // GET PIECE
    // =========================================================

    const piece = PIECES[type];

    if (!piece) {
        return null;
    }

    // =========================================================
    // PIECE DATA
    // =========================================================

    const {
        shape,
        color,
        asset,
    } = piece;

    // =========================================================
    // GET IMAGE
    // =========================================================

    const image =
        asset?.path ||
        asset?.image ||
        asset?.src ||
        asset?.url ||
        asset;

    // =========================================================
    // REMOVE EMPTY ROWS
    // =========================================================

    const rows = shape.filter((row) =>
        row.some(Boolean)
    );

    // =========================================================
    // REMOVE EMPTY COLUMNS
    // =========================================================

    const keptCols = shape[0]
        .map((_, x) => x)
        .filter((x) =>
            shape.some((row) => row[x])
        );

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="next-piece"
            style={{
                display: "grid",

                gridTemplateColumns:
                    `repeat(${keptCols.length}, ${cellSize}px)`,

                gridAutoRows:
                    `${cellSize}px`,

                justifyContent: "center",
                alignItems: "center",

                // =============================================
                // POSITION
                // =============================================

                transform:
                    `translate(${offsetX}px, ${offsetY}px)`,
            }}
        >
            {rows.flatMap((row, y) =>
                keptCols.map((x) => {
                    const filled = row[x];

                    return (
                        <div
                            key={`${y}-${x}`}
                            style={{
                                width: cellSize,
                                height: cellSize,

                                // =================================
                                // FALLBACK COLOR
                                // =================================

                                backgroundColor:
                                    filled
                                        ? color
                                        : "transparent",

                                // =================================
                                // PIECE IMAGE
                                // =================================

                                backgroundImage:
                                    filled && image
                                        ? `url("${image}")`
                                        : "none",

                                backgroundSize:
                                    "contain",

                                backgroundPosition:
                                    "center",

                                backgroundRepeat:
                                    "no-repeat",
                            }}
                        />
                    );
                })
            )}
        </div>
    );
};

export default NextPiece;