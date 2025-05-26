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
        <SudokuGrid
          selectedNumber={selectedNumber}
          onNumberUsed={handleNumberUsed}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                backgroundColor: "#f0f0f0",
                padding: "10px",
                cursor: "pointer",
                border:
                  selectedNumber === num ? "2px solid blue" : "1px solid gray",
                borderRadius: "4px",
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default GamePage;
