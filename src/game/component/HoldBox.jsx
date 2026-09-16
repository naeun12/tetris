import { Sprite, Assets } from "pixi.js";

import HoldImage from "../../../public/assets/images/gameAssets/hold/hold.png";

export default async function HoldBox({
    app,
    width,
    height,
}) {
    const texture = await Assets.load(HoldImage);

    const hold = new Sprite(texture);

    hold.width = width;
    hold.height = height;

    hold.x = 0;
    hold.y = 20;

    app.stage.addChild(hold);
}