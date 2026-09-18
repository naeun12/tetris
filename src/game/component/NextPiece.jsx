/** @format */

import { PIECES } from "./board/pieces/Pieces";

const NextPiece = ({
    type,
    cellSize = 14,
    offsetX = 0,
    offsetY = 0,
}) => {
    if (!type) {
        return null;
    }

    const piece = PIECES[type];

    if (!piece) {
        return null;
    }

    const {
        shape,
        color,
        asset,
    } = piece;

    const image =
        asset?.path ||
        asset?.image ||
        asset?.src ||
        asset?.url ||
        asset;

    const rows = shape.filter((row) =>
        row.some(Boolean)
    );

    const keptCols = shape[0]
        .map((_, x) => x)
        .filter((x) =>
            shape.some((row) => row[x])
        );

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
                                backgroundColor:
                                    filled
                                        ? color
                                        : "transparent",
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


