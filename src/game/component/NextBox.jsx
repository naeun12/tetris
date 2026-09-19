import React from "react";
import NextPiece from "./NextPiece";
import styles from "../../styles/gameComponent/NextBox.module.css";

const NextBox = ({ types = [] }) => (
    <div className={styles.nextContainer}>
       
        <div className={styles.piecesBox}>
            <div className={styles.piecesList}>
                {types.map((t, i) => (
                    <NextPiece key={`${t}-${i}`} type={t} />
                ))}
            </div>
        </div>
    </div>
);

export default NextBox;