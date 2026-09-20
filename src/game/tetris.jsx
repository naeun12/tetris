/** @format */

import { useLocation } from "react-router-dom";
import MarathonConfig from "./modes/marathon/MarathonConfig";
import GameBoard from "./component/GameBoard";

const Tetris = ({
    stats = null,
    character = null,
    mode: modeProp = null,
    side = "player",
    incomingGarbage = 0,
    onAttack = null,
    onGarbageApplied = null,
}) => {
    const location = useLocation();

    let mode = modeProp;
    let config = null;

    if (!modeProp) {
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
    }

    return (
        <main className="tetris-page">
            <GameBoard
                stats={stats}
                character={character}
                mode={mode}
                config={config}
                side={side}
                incomingGarbage={incomingGarbage}
                onAttack={onAttack}
                onGarbageApplied={
                    onGarbageApplied
                }
            />
        </main>
    );
};

export default Tetris;

