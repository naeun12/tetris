/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import settingsPanelStyle from "../../../styles/users/settingsStyles/SettingsPanel.module.css";
import styles from "../../../styles/users/settingsStyles/Handling.module.css";

import {
    DEFAULT_HANDLING,
    getHandlingSettings,
    saveHandlingSettings,
    resetHandlingSettings,
} from "../../../game/gameSettings/HandlingSettings";

export default function Handling() {
    const navigate = useNavigate();
    const savedSettings = getHandlingSettings();

    const [arr, setArr] = useState(savedSettings.arr);
    const [das, setDas] = useState(savedSettings.das);
    const [dcd, setDcd] = useState(savedSettings.dcd);
    const [sdf, setSdf] = useState(savedSettings.sdf);

    const handleReset = () => {
        resetHandlingSettings();

        setArr(DEFAULT_HANDLING.arr);
        setDas(DEFAULT_HANDLING.das);
        setDcd(DEFAULT_HANDLING.dcd);
        setSdf(DEFAULT_HANDLING.sdf);
    };

    const handleSave = () => {
        const currentSettings = {
            arr,
            das,
            dcd,
            sdf,
        };

        saveHandlingSettings(currentSettings);
        console.log("Handling settings saved:", currentSettings);
        navigate(-1);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={settingsPanelStyle.settingsPanel}>
            <div className={styles.containerHandling}>

                {/* HEADER TITLE (Opsyonal pero nindot i-apil para uniform sa Controls) */}
                <div className={styles.Arr} style={{ padding: "14px 20px" }}>
                    <div className={styles.settingHeader}>
                        <div className={styles.settingInfo}>
                            <h2>Handling Configuration</h2>
                            <p>Customize your game responsiveness and handling speeds.</p>
                        </div>
                    </div>
                </div>

                {/* ARR */}
                <div className={styles.Arr}>
                    <div className={styles.settingHeader}>
                        <div className={styles.settingInfo}>
                            <h2>ARR</h2>
                            <p>Auto Repeat Rate</p>
                        </div>
                        <div className={styles.settingValue}>
                            <span>{arr} ms</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={arr}
                        onChange={(e) => setArr(Number(e.target.value))}
                        className={styles.settingSlider}
                    />
                </div>

                {/* DAS */}
                <div className={styles.Das}>
                    <div className={styles.settingHeader}>
                        <div className={styles.settingInfo}>
                            <h2>DAS</h2>
                            <p>Delayed Auto Shift</p>
                        </div>
                        <div className={styles.settingValue}>
                            <span>{das} ms</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="300"
                        value={das}
                        onChange={(e) => setDas(Number(e.target.value))}
                        className={styles.settingSlider}
                    />
                </div>

                {/* DCD */}
                <div className={styles.Dcd}>
                    <div className={styles.settingHeader}>
                        <div className={styles.settingInfo}>
                            <h2>DCD</h2>
                            <p>Delayed Cancel DAS</p>
                        </div>
                        <div className={styles.settingValue}>
                            <span>{dcd} ms</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={dcd}
                        onChange={(e) => setDcd(Number(e.target.value))}
                        className={styles.settingSlider}
                    />
                </div>

                {/* SDF */}
                <div className={styles.Sdf}>
                    <div className={styles.settingHeader}>
                        <div className={styles.settingInfo}>
                            <h2>SDF</h2>
                            <p>Soft Drop Factor</p>
                        </div>
                        <div className={styles.settingValue}>
                            <span>{sdf}x</span>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="40"
                        value={sdf}
                        onChange={(e) => setSdf(Number(e.target.value))}
                        className={styles.settingSlider}
                    />
                </div>

                {/* ACTION BUTTONS (Gi-isa na tanan sa usa ka bar para limpyo tan-awon) */}
                <div className={styles.actionButtons}>
                    <button
                        type="button"
                        onClick={handleBack}
                        className={styles.backButton}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className={styles.resetButton}
                    >
                        Reset Defaults
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className={styles.saveButton}
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}