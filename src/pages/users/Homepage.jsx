import React, { useState,useEffect } from 'react'
import styles from "../../styles/users/Homepage.module.css"
import { Link } from "react-router-dom";
import { playMusic } from "../../utils/music.js"
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
                        <Link
                            key={menu.title}
                            to={menu.link}
                            onMouseEnter={() => setHoveredMenu(menu)}
                            onMouseLeave={() => setHoveredMenu(null)}
                            onClick={playButtonMusic}
                            className={styles.homepageMenuCard}
                        >
                            <div className={styles.homepageMenuContent}>
                                <h2>{menu.title}</h2>
                            </div>
                            <span className={styles.homepageMenuArrow}>→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </>)
}