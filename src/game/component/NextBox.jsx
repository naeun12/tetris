
import NextPiece from "./NextPiece";

const NextBox = ({ types = [] }) => (
    <div className="box next-box">
        <h3>Next</h3>
        {types.map((t, i) => (
            <NextPiece key={`${t}-${i}`} type={t} />
        ))}
    </div>
);

export default NextBox;

