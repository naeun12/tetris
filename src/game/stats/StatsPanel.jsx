/** @format */

import { useEffect, useState } from "react";

import MarathonStatsPanel from "../modes/marathon/MarathonStatsPanel";

export default function StatsPanel({ mode, stats }) {
    const [, setRefresh] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setRefresh((value) => value + 1);
        }, 100);

        return () => {
            clearInterval(id);
        };
    }, []);

    switch (mode) {
        case "Marathon Mode":
            return (
                <div>
                    <MarathonStatsPanel
                        stats={stats}
                    />
                </div>
            );

        case "40-Line Sprint":
            return (
                <div>
                    <h2>40-Line Sprint</h2>
                </div>
            );

        case "Ultra Attack":
            return (
                <div>
                    <h2>Ultra Attack</h2>
                </div>
            );

        case "Free Play / Practice":
            return (
                <div>
                    <h2>Practice</h2>
                </div>
            );

        default:
            return null;
    }
}