/** @format */

import PiecesSelector from "./PiecesSelector";
const piecesSelector = new PiecesSelector();

const LPiece = {
    type: "L",

    asset: piecesSelector.select,

    color: "#ff9f1c",

    shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
};

export default LPiece;