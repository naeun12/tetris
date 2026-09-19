import PiecesSelector from "./PiecesSelector";
const piecesSelector = new PiecesSelector();
const SPiece = {
  type: 'S',
    asset: piecesSelector.select,
  color: '#3ddc5f',
  shape: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
};
export default SPiece;