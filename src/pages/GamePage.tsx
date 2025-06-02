import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./GamePage.css"; // Assuming you have a CSS file for styles
import { useNavigate } from "react-router-dom";

import PuzzleGame from "./PuzzleGame";

// import { getSolvedGrid } from "../utils/SudokuFunctions";

function GamePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="back-arrow">
        <button onClick={() => navigate("/")}>
          {" "}
          <KeyboardBackspaceIcon />
        </button>
      </div>
      <div className="game-page">
        <PuzzleGame />
      </div>
    </>
  );
}

export default GamePage;
{
  /* <div className="pad">
            <span style={{}}>Key pad:</span>
            <div className="number-pad">
              {" "}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  className="number-button"
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  style={{
                    border:
                      selectedNumber === num
                        ? "2px solid blue"
                        : "1px solid gray",
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div> */
}
