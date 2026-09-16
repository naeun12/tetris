import kaboom from "kaboom";

let gameStarted = false;

export default function Tetris() {
    const containerRef = (container) => {
        if (!container || gameStarted) return;

        gameStarted = true;

        const k = kaboom({
            width: 800,
            height: 700,
        });

        // Move Kaboom canvas into our React container
        container.appendChild(k.canvas);

        // Board
        k.loadSprite(
            "board",
            "/assets/images/gameAssets/border.png"
        );

        k.add([
            k.sprite("board"),
            k.pos(250, 50),
        ]);

        // Block
        const BLOCK_SIZE = 30;

        const piece = k.add([
            k.rect(BLOCK_SIZE, BLOCK_SIZE),
            k.color(0, 200, 255),
            k.pos(385, 80),
        ]);

        // Movement
        k.onKeyPress("left", () => {
            piece.move(-BLOCK_SIZE, 0);
        });

        k.onKeyPress("right", () => {
            piece.move(BLOCK_SIZE, 0);
        });

        // Falling
        let fallTimer = 0;

        k.onUpdate(() => {
            fallTimer += k.dt();

            if (fallTimer >= 0.5) {
                piece.move(0, BLOCK_SIZE);
                fallTimer = 0;
            }
        });
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}