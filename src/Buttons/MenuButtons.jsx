import { Link } from "react-router-dom";
import styles from "../styles/buttons/ButtonMenu.module.css";

export default function MenuButtons({ menu,title,setHoveredMenu,playButtonMusic }) {
    return <>
        <div>
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
        </div>
    </>
}