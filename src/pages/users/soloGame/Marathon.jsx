import { useRef } from "react";
import styles from "../../../styles/users/soloGameStyles/SoloGameIndex.module.css";
import Board from "../../../game/tetris";
import MarathonStats from "../../../game/modes/marathon/MarathonStats";
import MarathonStatsPanel from "../../../game/modes/marathon/MarathonStatsPanel";

export default function Marathon() {
    const statsRef = useRef(
        new MarathonStats()
    );

    return (
        <div className={styles.soloGameIndex}>
            <div className={styles.gameContainer}>
                <Board
                    stats={statsRef.current}
                />
            </div>

            <div className={styles.content}>
                <div className={styles.rightPanel}>
                    <MarathonStatsPanel
                        stats={statsRef.current}
                    />
                </div>

                <div className={styles.leftPanel}></div>
            </div>
        </div>
    );
}