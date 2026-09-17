import React, { useState,useEffect } from 'react'
import styles from "../../styles/users/Homepage.module.css"
import { playMusic } from "../../utils/music.js"
import MenuButtons from '../../Buttons/MenuButtons.jsx';
import { playButtonMusic } from "../../utils/ButtonMusic.js"
import MenuData from "../../../datas/MenuData.js";
export default function Homepage() {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    return (<>
        <div className={styles.homepage}
            onClick={playMusic}>
            <div className={styles.Rigthcontent}>
                <div className={styles.textWrapper}>
                    {hoveredMenu ? (
                        <div className={styles.dynamicContent}>
                            <h1>{hoveredMenu.title}</h1>
                            <p>{hoveredMenu.description}</p>
                        </div>
                    ) : (
                        <div className={styles.defaultContent}>
                            <h1>Welcome to Tetris Game!</h1>
                            <p>Choose your mode and start playing!</p>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.LeftContent}>
                <div className={styles.menuContainer}>
                    {MenuData.map((menu) => (
                        <MenuButtons
                            key={menu.title}
                            menu={menu}
                            setHoveredMenu={setHoveredMenu}
                            playButtonMusic={playButtonMusic}
                        />
                    ))}
                </div>
            </div>
        </div>
    </>)
}