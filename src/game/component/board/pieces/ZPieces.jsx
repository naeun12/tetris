import PiecesSelector from "./PiecesSelector";
const piecesSelector = new PiecesSelector();
const ZPiece = {
  type: 'Z',
  asset: piecesSelector.select,
  color: '#ff3d5e',
  shape: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};
export default ZPiece;