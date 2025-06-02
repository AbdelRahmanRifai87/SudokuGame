import { useNavigate } from "react-router-dom";
import "./StartingPage.css";

function StartingPage() {
  const navigate = useNavigate();

  return (
    <div className="bubble-background">
      {[...Array(30)].map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = 10 + Math.random() * 30;
        const duration = 5 + Math.random() * 10;
        const deltaX = (Math.random() - 0.5) * 200; // random X movement
        const deltaY = (Math.random() - 0.5) * 200; // random Y movement

        const style = {
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          transform: `translate(${deltaX}px, ${deltaY}px)`,
        };

        return <span key={i} className="bubble" style={style}></span>;
      })}
      <div className="cover">
        <div className="starting-page">
          <h1>Welcome to Sudoku</h1>
          <div className="buttons">
            <button onClick={() => navigate("/game")}>Start Sudoku Game</button>
            <button onClick={() => navigate("/manual-solver")}>
              Manual Solver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartingPage;
