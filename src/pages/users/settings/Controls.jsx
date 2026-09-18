import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import settingsPanelStyle from "../../../styles/users/settingsStyles/SettingsPanel.module.css";
import styles from "../../../styles/users/settingsStyles/Controls.module.css";

const DEFAULT_CONTROLS = {
    moveLeft: "ArrowLeft",
    moveRight: "ArrowRight",
    softDrop: "ArrowDown",
    hardDrop: "Space",
    rotateCW: "ArrowUp",
    rotateCCW: "KeyZ",
    rotate180: "KeyA",
    hold: "KeyC",
    pause: "Escape",
    restart: "KeyR",
};

const CONTROL_LABELS = {
    moveLeft: "Move Left",
    moveRight: "Move Right",
    softDrop: "Soft Drop",
    hardDrop: "Hard Drop",
    rotateCW: "Rotate CW",
    rotateCCW: "Rotate CCW",
    rotate180: "Rotate 180°",
    hold: "Hold",
    pause: "Pause",
    restart: "Restart",
};

const formatKey = (key) => {
    const names = {
        ArrowLeft: "←",
        ArrowRight: "→",
        ArrowUp: "↑",
        ArrowDown: "↓",
        Space: "SPACE",
        Escape: "ESC",
        KeyZ: "Z",
        KeyA: "A",
        KeyC: "C",
        KeyR: "R",
    };

    return names[key] || key;
};

export default function Controls() {
    const navigate = useNavigate();

    const [controls, setControls] = useState(() => {
        const saved = localStorage.getItem("tetrisControls");
        if (!saved) return { ...DEFAULT_CONTROLS };
        try {
            return { ...DEFAULT_CONTROLS, ...JSON.parse(saved) };
        } catch {
            return { ...DEFAULT_CONTROLS };
        }
    });

    const [listeningFor, setListeningFor] = useState(null);

    /* KEY LISTENER */
    useEffect(() => {
        if (!listeningFor) return;

        const handleKeyDown = (event) => {
            event.preventDefault();
            if (event.code === "Escape") {
                setListeningFor(null);
                return;
            }
            setControls((previous) => ({
                ...previous,
                [listeningFor]: event.code,
            }));
            setListeningFor(null);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [listeningFor]);

    const handleSave = () => {
        localStorage.setItem("tetrisControls", JSON.stringify(controls));
        navigate(-1);
    };

    const resetControls = () => {
        setControls({ ...DEFAULT_CONTROLS });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={settingsPanelStyle.settingsPanel}>
            <div className={styles.controls}>
                {/* HEADER */}
                <div className={styles.header}>
                    <div className={styles.headerBadge}>Configuration</div>
                    <h2>Controls</h2>
                    <p>Customize your key bindings for gameplay.</p>
                </div>

                {/* KEY BINDINGS */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h3>Key Bindings</h3>
                        <span>Click to rebind</span>
                    </div>

                    <div className={styles.controlList}>
                        {Object.entries(CONTROL_LABELS).map(([control, label]) => (
                            <div className={styles.controlRow} key={control}>
                                <span className={styles.controlName}>{label}</span>
                                <button
                                    type="button"
                                    className={`${styles.keyButton} ${
                                        listeningFor === control ? styles.listening : ""
                                    }`}
                                    onClick={() => setListeningFor(control)}
                                >
                                    {listeningFor === control
                                        ? "Press Key..."
                                        : formatKey(controls[control])}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ACTIONS */}
                <div className={styles.actions}>
                    <div className={styles.leftActions}>
                        <button type="button" className={styles.backButton} onClick={handleBack}>
                            Back
                        </button>
                        <button type="button" className={styles.resetButton} onClick={resetControls}>
                            Reset Defaults
                        </button>
                    </div>
                    <button type="button" className={styles.saveButton} onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}