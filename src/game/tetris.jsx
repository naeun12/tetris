
import GameBoard from "./component/GameBoard";

const Tetris = ({ stats = null }) => (
    <main className="tetris-page">
        <GameBoard stats={stats} />
    </main>
);

export default Tetris;
