import styles from "../../../styles/users/soloGameStyles/SoloGameIndex.module.css";
import Board from "../../../game/tetris";
import { Link } from "react-router-dom";

export default function Marathon() {
    return (
        <div className={styles.soloGameIndex}>
            <div className={styles.gameContainer}>
                <Board />
            </div>

            <div className={styles.content}>
                <div className={styles.rightPanel}></div>
                <div className={styles.leftPanel}></div>
            </div>

        </div>
    );
}