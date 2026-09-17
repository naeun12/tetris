/** @format */
/** @format */

import PieceAssetModel from "../model/PieceAssetModel";

const PieceAssetData = {
  crystal: new PieceAssetModel(
    "Crystal",
    "/assets/images/gameAssets/pieces/block-crystal.png",
  ),

  cyber: new PieceAssetModel(
    "Cyber",
    "/assets/images/gameAssets/pieces/block-cyber.png",
  ),

  jewel: new PieceAssetModel(
    "Jewel",
    "/assets/images/gameAssets/pieces/block-jewel.png",
  ),
};

export default PieceAssetData;
