/** @format */

import { useRef, useState } from "react";

import styles from "../../../styles/battle/VsBattle.module.css";

import Board from "../../../game/tetris";

import VsBattleStats from "../../../game/battle/VsBattleStats.js";

import {
    cancelGarbage,
    queueGarbage,
    consumeGarbage,
} from "../../../game/battle/GarbageSystem.js";

export default function VsBattle() {
    const playerStatsRef =
        useRef(
            new VsBattleStats()
        );

    const enemyStatsRef =
        useRef(
            new VsBattleStats()
        );

    const playerGarbageRef =
        useRef([]);

    const enemyGarbageRef =
        useRef([]);

    const [
        playerGarbage,
        setPlayerGarbage,
    ] = useState([]);

    const [
        enemyGarbage,
        setEnemyGarbage,
    ] = useState([]);

    const handlePlayerAttack = (
        amount
    ) => {
        const result =
            cancelGarbage(
                playerGarbageRef.current,
                amount
            );

        playerGarbageRef.current =
            result.queue;

        setPlayerGarbage(
            result.queue
        );

        if (
            result.remainingOutgoing >
            0
        ) {
            const nextEnemyQueue =
                queueGarbage(
                    enemyGarbageRef.current,
                    result.remainingOutgoing
                );

            enemyGarbageRef.current =
                nextEnemyQueue;

            setEnemyGarbage(
                nextEnemyQueue
            );
        }

        return {
            remainingIncoming:
                result.remainingIncoming,
            remainingOutgoing:
                result.remainingOutgoing,
            queue: result.queue,
        };
    };

    const handleEnemyAttack = (
        amount
    ) => {
        const result =
            cancelGarbage(
                enemyGarbageRef.current,
                amount
            );

        enemyGarbageRef.current =
            result.queue;

        setEnemyGarbage(
            result.queue
        );

        if (
            result.remainingOutgoing >
            0
        ) {
            const nextPlayerQueue =
                queueGarbage(
                    playerGarbageRef.current,
                    result.remainingOutgoing
                );

            playerGarbageRef.current =
                nextPlayerQueue;

            setPlayerGarbage(
                nextPlayerQueue
            );
        }

        return {
            remainingIncoming:
                result.remainingIncoming,
            remainingOutgoing:
                result.remainingOutgoing,
            queue: result.queue,
        };
    };

    const handlePlayerGarbageApplied =
        (amount) => {
            const result =
                consumeGarbage(
                    playerGarbageRef.current,
                    amount
                );

            playerGarbageRef.current =
                result.queue;

            setPlayerGarbage(
                result.queue
            );
        };

    const handleEnemyGarbageApplied =
        (amount) => {
            const result =
                consumeGarbage(
                    enemyGarbageRef.current,
                    amount
                );

            enemyGarbageRef.current =
                result.queue;

            setEnemyGarbage(
                result.queue
            );
        };

    return (
        <div
            className={
                styles.vsBattle
            }
        >
            <div
                className={
                    styles.playerSide
                }
            >
                <div
                    className={
                        styles.sideHeader
                    }
                >
                    PLAYER
                </div>

                <div
                    className={
                        styles.boardContainer
                    }
                >
                    <Board
                        stats={
                            playerStatsRef.current
                        }
                        mode="vs"
                        side="player"
                        incomingGarbage={
                            playerGarbage
                        }
                        onAttack={
                            handlePlayerAttack
                        }
                        onGarbageApplied={
                            handlePlayerGarbageApplied
                        }
                    />
                </div>
            </div>

            <div
                className={
                    styles.vsCenter
                }
            >
                <div
                    className={
                        styles.vsBadge
                    }
                >
                    <span
                        className={
                            styles.vsText
                        }
                    >
                        VS
                    </span>
                </div>
            </div>

            <div
                className={
                    styles.enemySide
                }
            >
                <div
                    className={
                        styles.sideHeader
                    }
                >
                    OPPONENT
                </div>

                <div
                    className={
                        styles.boardContainer
                    }
                >
                    <Board
                        stats={
                            enemyStatsRef.current
                        }
                        mode="vs"
                        side="enemy"
                        incomingGarbage={
                            enemyGarbage
                        }
                        onAttack={
                            handleEnemyAttack
                        }
                        onGarbageApplied={
                            handleEnemyGarbageApplied
                        }
                    />
                </div>
            </div>
        </div>
    );
}