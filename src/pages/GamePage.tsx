import { useState } from "react";
import SudokuGrid from "../components/SudokuGrid/SudokuGrid";
import "./GamePage.css"; // Assuming you have a CSS file for styles

function GamePage() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num);
  };
  const handleNumberUsed = () => {
    // Clear selected number after it's used
    setSelectedNumber(null);
  };

  return (
    <>
      <div className="game-page">
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              className="number-button"
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                border:
                  selectedNumber === num ? "2px solid blue" : "1px solid gray",
              }}
            >
              {num}
            </div>
          ))}
        </div>
        <SudokuGrid
          selectedNumber={selectedNumber}
          onNumberUsed={handleNumberUsed}
        />
      </div>
    </>
  );
}

export default GamePage;
