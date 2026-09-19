import PiecesSelector from "./PiecesSelector";
const piecesSelector = new PiecesSelector();
const TPiece = {
  type: 'T',
      asset: piecesSelector.select,
  color: '#b537f2',
  shape: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};
export default TPiece;