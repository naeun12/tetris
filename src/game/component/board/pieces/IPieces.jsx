/** @format */

import PiecesSelector from "./PiecesSelector";

const piecesSelector = new PiecesSelector();

const IPiece = {
    type: "I",
    asset: piecesSelector.select,
    color: "#00e5ff",
    shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
};

export default IPiece;