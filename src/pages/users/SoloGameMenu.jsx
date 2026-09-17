
import { useState } from "react";

import SoloGameMenuData from "../../../datas/SoloGameMenuData";
import styles from "../../styles/users/SoloGameMenu.module.css";

import MenuButtons from "../../Buttons/MenuButtons";
import { playButtonMusic } from "../../utils/ButtonMusic.js";

export default function SoloGameMenu() {
    const [hoveredMenu, setHoveredMenu] = useState(null);

    return (
        <div className ={ styles.container}>
                <div className={styles.Rigthcontent}>
                                <div className={styles.textWrapper}>
                                    {hoveredMenu ? (
                                        <div className={styles.dynamicContent}>
                                            <h1>{hoveredMenu.title}</h1>
                                            <p>{hoveredMenu.description}</p>
                                        </div>
                                    ) : (
                                 
                                    <div className={styles.defaultContent}>
                                        <h1>Choose Your Solo Mode</h1>
                                        <p>Select a solo game mode and start playing!</p>
                                    </div>


                                     )}
                                </div>
                </div>
            <div className={styles.LeftContent}>
                                <div className={styles.menuContainer}>
                
                         {SoloGameMenuData.map((menu) => (
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
        
    );
}

