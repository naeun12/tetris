/** @format */

import styles from "../../../styles/indicators/LevelIndicators.module.css";
import lineIndicator from "../../../../public/assets/images/gameAssets/indicator/lineindicator.png";

const LevelIndicator = ({ level = 1, lines = 0 }) => {
    // Calculate lines in the current level (0-9)
    const linesInLevel = lines % 10;
    
    // If 10 lines are reached, show 100% full bar instead of 0%
    const currentProgress = lines > 0 && linesInLevel === 0 ? 10 : linesInLevel;
    const progressPercentage = (currentProgress / 10) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.levelInfo}>
                <span className={styles.label}>Level</span>
                <span className={styles.value}>{level}</span>
            </div>

            <div
                className={styles.bar}
                style={{
                    backgroundImage: `url(${lineIndicator.src || lineIndicator})`,
                }}
            >
                <div
                    className={styles.progress}
                    style={{
                        height: `${progressPercentage}%`,
                    }}
                />
            </div>

            <div className={styles.next}>
                {linesInLevel}/10
            </div>
        </div>
    );
};

export default LevelIndicator;