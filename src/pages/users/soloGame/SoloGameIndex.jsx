import styles from "../../../styles/users/soloGameStyles/SoloGameIndex.module.css";
import Board from "../../../game/component/Board";

export default function SoloGameIndex() {
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