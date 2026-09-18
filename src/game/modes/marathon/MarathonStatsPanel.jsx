/** @format */

import { useEffect, useState } from "react";
import styles from "../../../styles/statsPanel/MarathonStatsPanel.module.css";

const MarathonStatsPanel = ({ stats }) => {
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((value) => value + 1);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (!stats) {
        return null;
    }

    const data = stats.getStats();

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <span className={styles.label}>MARATHON</span>
                    <h2>STATS</h2>
                </div>
            </div>

            <div className={styles.mainStats}>
                <div className={styles.mainStatCard}>
                    <span>SCORE</span>
                    <strong>{data.score.toLocaleString()}</strong>
                </div>

                <div className={styles.mainStatCard}>
                    <span>LEVEL</span>
                    <strong>{data.level}</strong>
                </div>

                <div className={styles.mainStatCard}>
                    <span>LINES</span>
                    <strong>{data.lines}</strong>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <span>PERFORMANCE</span>
                </div>
                <div className={styles.grid}>
                    <Stat label="PPS" value={data.ppsFormatted} />
                    <Stat label="APM" value={data.apmFormatted} />
                    <Stat label="PIECES" value={data.pieces} />
                    <Stat label="ATTACK" value={data.attack} />
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <span>COMBAT</span>
                </div>
                <div className={styles.grid}>
                    <Stat label="COMBO" value={data.combo >= 0 ? data.combo : 0} />
                    <Stat label="MAX COMBO" value={data.maxCombo} />
                    <Stat label="B2B" value={data.backToBack} />
                    <Stat label="MAX B2B" value={data.maxBackToBack} />
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <span>SPECIALS</span>
                </div>
                <div className={styles.grid}>
                    <Stat label="T-SPINS" value={data.tSpins} />
                    <Stat label="T-SPIN SINGLE" value={data.tSpinSingles} />
                    <Stat label="T-SPIN DOUBLE" value={data.tSpinDoubles} />
                    <Stat label="T-SPIN TRIPLE" value={data.tSpinTriples} />
                    <Stat label="PERFECT CLEAR" value={data.perfectClears} />
                </div>
            </div>
        </div>
    );
};

const Stat = ({ label, value }) => {
    return (
        <div className={styles.statCard}>
            <span className={styles.statLabel}>{label}</span>
            <strong className={styles.statValue}>{value}</strong>
        </div>
    );
};

export default MarathonStatsPanel;