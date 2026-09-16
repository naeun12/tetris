/** @format */

import { useEffect, useRef } from 'react';
import { Application, Container, Sprite, Texture } from 'pixi.js';

import {
    BOARD_WIDTH_PX,
    BOARD_HEIGHT_PX,
    CELL_SIZE,
} from '../component/config/BoardConfig.js';

import { getDropY } from '../component/collision/Collision.js';
import GameGrid from './GameGrid.jsx';

/**
 * Pre-renders a glossy cell sprite for a given color.
 */
function makeCellTexture(color) {
    const canvas = document.createElement('canvas');

    canvas.width = CELL_SIZE;
    canvas.height = CELL_SIZE;

    const ctx = canvas.getContext('2d');

    const pad = 1;

    // Main color
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = color;

    ctx.fillRect(
        pad,
        pad,
        CELL_SIZE - pad * 2,
        CELL_SIZE - pad * 2
    );

    // Reset alpha
    ctx.globalAlpha = 1;

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';

    ctx.fillRect(
        pad,
        pad,
        CELL_SIZE - pad * 2,
        4
    );

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';

    ctx.fillRect(
        pad,
        CELL_SIZE - pad - 4,
        CELL_SIZE - pad * 2,
        4
    );

    return Texture.from(canvas);
}

/**
 * Soft white outline used for the ghost piece.
 */
function makeGhostTexture() {
    const canvas = document.createElement('canvas');

    canvas.width = CELL_SIZE;
    canvas.height = CELL_SIZE;

    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;

    ctx.strokeRect(
        2,
        2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
    );

    return Texture.from(canvas);
}

export default function GameBoard({ gameData }) {
    /**
     * HTML canvas reference.
     */
    const canvasRef = useRef(null);

    /**
     * IMPORTANT:
     * gameDataRef is a REAL React ref.
     *
     * The ticker can continuously read:
     * gameDataRef.current
     *
     * without recreating the Pixi application.
     */
    const gameDataRef = useRef(gameData);

    /**
     * Keep gameDataRef updated whenever React receives
     * new board/piece data.
     */
    useEffect(() => {
        gameDataRef.current = gameData;
    }, [gameData]);

    /**
     * Create PixiJS only once.
     */
    useEffect(() => {
        let disposed = false;
        let app = null;

        const init = async () => {
            // Make sure canvas exists
            if (!canvasRef.current) {
                return;
            }

            /**
             * Create Pixi Application.
             */
            app = new Application();

            /**
             * PixiJS v8
             *
             * Use "canvas" instead of the deprecated "view".
             */
            await app.init({
                width: BOARD_WIDTH_PX,
                height: BOARD_HEIGHT_PX,

                backgroundAlpha: 0,

                canvas: canvasRef.current,

                antialias: false,

                autoDensity: true,

                resolution: window.devicePixelRatio || 1,
            });

            /**
             * Component may have unmounted while Pixi was initializing.
             */
            if (disposed) {
                app.destroy(true);
                app = null;
                return;
            }

            /**
             * Container for all game cells.
             */
            const layer = new Container();

            app.stage.addChild(layer);

            /**
             * Texture cache.
             *
             * Instead of creating a texture every frame,
             * reuse textures for each color.
             */
            const textureCache = {};

            /**
             * Get or create cell texture.
             */
            const getCellTexture = (color) => {
                if (!color) {
                    return null;
                }

                if (!textureCache[color]) {
                    textureCache[color] = makeCellTexture(color);
                }

                return textureCache[color];
            };

            /**
             * Ghost texture.
             */
            const ghostTexture = makeGhostTexture();

            /**
             * Remove all sprites from the game layer.
             */
            const clearLayer = () => {
                for (
                    let i = layer.children.length - 1;
                    i >= 0;
                    i--
                ) {
                    const child = layer.children[i];

                    layer.removeChild(child);

                    child.destroy();
                }
            };

            /**
             * Draw one cell.
             */
            const drawCell = (color, x, y, texture) => {
                if (!texture) {
                    return;
                }

                /**
                 * Don't draw outside the board.
                 */
                if (
                    x < 0 ||
                    x >= BOARD_WIDTH_PX / CELL_SIZE ||
                    y < 0 ||
                    y >= BOARD_HEIGHT_PX / CELL_SIZE
                ) {
                    return;
                }

                const sprite = new Sprite(texture);

                sprite.x = x * CELL_SIZE;
                sprite.y = y * CELL_SIZE;

                sprite.width = CELL_SIZE;
                sprite.height = CELL_SIZE;

                layer.addChild(sprite);
            };

            /**
             * Pixi ticker.
             *
             * Runs every frame.
             */
            const updateGame = () => {
                /**
                 * IMPORTANT:
                 * Read the latest React game data.
                 */
                const currentGameData = gameDataRef.current;

                /**
                 * Safety check.
                 */
                if (!currentGameData) {
                    return;
                }

                const board = currentGameData.board;
                const piece = currentGameData.piece;

                /**
                 * Safety check for board.
                 */
                if (!Array.isArray(board)) {
                    return;
                }

                /**
                 * Clear previous frame.
                 */
                clearLayer();

                /**
                 * ==========================================
                 * 1. LOCKED CELLS
                 * ==========================================
                 */
                for (let r = 0; r < board.length; r++) {
                    if (!Array.isArray(board[r])) {
                        continue;
                    }

                    for (
                        let c = 0;
                        c < board[r].length;
                        c++
                    ) {
                        const color = board[r][c];

                        /**
                         * Only draw occupied cells.
                         */
                        if (!color) {
                            continue;
                        }

                        const texture = getCellTexture(color);

                        drawCell(
                            color,
                            c,
                            r,
                            texture
                        );
                    }
                }

                /**
                 * ==========================================
                 * 2. GHOST + ACTIVE PIECE
                 * ==========================================
                 */
                if (!piece) {
                    return;
                }

                /**
                 * Safety checks.
                 */
                if (!Array.isArray(piece.shape)) {
                    return;
                }

                if (
                    typeof piece.x !== 'number' ||
                    typeof piece.y !== 'number'
                ) {
                    return;
                }

                /**
                 * ==========================================
                 * GHOST PIECE
                 * ==========================================
                 */
                const ghostY = getDropY(
                    piece.shape,
                    board,
                    piece.x,
                    piece.y
                );

                for (
                    let r = 0;
                    r < piece.shape.length;
                    r++
                ) {
                    if (!Array.isArray(piece.shape[r])) {
                        continue;
                    }

                    for (
                        let c = 0;
                        c < piece.shape[r].length;
                        c++
                    ) {
                        /**
                         * Empty cell in piece shape.
                         */
                        if (!piece.shape[r][c]) {
                            continue;
                        }

                        drawCell(
                            piece.color,
                            piece.x + c,
                            ghostY + r,
                            ghostTexture
                        );
                    }
                }

                /**
                 * ==========================================
                 * ACTIVE PIECE
                 * ==========================================
                 */
                const activeTexture = getCellTexture(
                    piece.color
                );

                for (
                    let r = 0;
                    r < piece.shape.length;
                    r++
                ) {
                    if (!Array.isArray(piece.shape[r])) {
                        continue;
                    }

                    for (
                        let c = 0;
                        c < piece.shape[r].length;
                        c++
                    ) {
                        /**
                         * Empty cell in piece shape.
                         */
                        if (!piece.shape[r][c]) {
                            continue;
                        }

                        drawCell(
                            piece.color,
                            piece.x + c,
                            piece.y + r,
                            activeTexture
                        );
                    }
                }
            };

            /**
             * Add ticker callback.
             */
            app.ticker.add(updateGame);

            /**
             * Store cleanup function on app so the
             * outer cleanup can remove the ticker.
             */
            app.__gameUpdate = updateGame;
        };

        init();

        /**
         * Cleanup.
         */
        return () => {
            disposed = true;

            if (app) {
                if (app.__gameUpdate) {
                    app.ticker.remove(app.__gameUpdate);
                }

                app.destroy(true);

                app = null;
            }
        };
    }, []);

    return (
        <div
            className="relative overflow-hidden rounded-lg border border-white/10"
            style={{
                width: BOARD_WIDTH_PX,
                height: BOARD_HEIGHT_PX,
            }}
        >
            {/* DOM Grid */}
            <div className="absolute inset-0">
                <GameGrid />
            </div>

            {/* PixiJS Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />
        </div>
    );
}