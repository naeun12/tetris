import PiecesSelector from "./PiecesSelector";
const piecesSelector = new PiecesSelector();
const JPiece = {
  type: 'J',
  asset: piecesSelector.select,
  color: '#2f6bff',
  shape: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};
export default JPiece;