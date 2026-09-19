/** @format */

import NextPiece from "./NextPiece";

import styles from "../../styles/gameComponent/Hold.module.css";

import defaultHoldImage from "../../../public/assets/images/gameAssets/hold/DefualtHold.png";

const HoldBox = ({ type }) => {
    return (
        <div
            className={styles.box}
            style={{
                backgroundImage:
                    `url(${defaultHoldImage})`,
            }}
        >
            {type ? (
                <NextPiece
                    type={type}

                    // =========================================
                    // PIECE SIZE
                    // =========================================

                    cellSize={40}

                    // =========================================
                    // PIECE POSITION
                    // =========================================

                    offsetX={0}
                    offsetY={20}
                />
            ) : (
                <div
                    className={`${styles.nextPiece} ${styles.empty}`}
                />
            )}
        </div>
    );
};

export default HoldBox;