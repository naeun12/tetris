/** @format */

import { useLocation } from "react-router-dom";

import MarathonConfig from "./modes/marathon/MarathonConfig";

import GameBoard from "./component/GameBoard";

const Tetris = ({
stats = null,
character = null,
}) => {
const location = useLocation();
let mode = null;
let config = null;

switch (location.pathname) {
    case "/solo/marathon":
        mode = "Marathon Mode";
        config = MarathonConfig;
        break;

    case "/solo/time-attack":
        mode = "40-Line Sprint";
        config = null;
        break;

    case "/solo/ultra":
        mode = "Ultra Attack";
        config = null;
        break;

    case "/solo/practice":
        mode = "Free Play / Practice";
        config = null;
        break;

    default:
        mode = null;
        config = null;
}

return (
    <main className="tetris-page">
        <GameBoard
            stats={stats}
            mode={mode}
            config={config}
        />
    </main>
);


};

export default Tetris;
