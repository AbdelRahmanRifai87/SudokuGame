import SudokuGrid from "../components/SudokuGrid/SudokuGrid";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import NumberPad from "../components/NumPad";
import { useState } from "react";
import type { SudokuCell } from "../utils/SudokuFunctions";
import {
  convertToNumberGrid,
  getSolvedGrid,
  applySolvedGrid,
} from "../utils/SudokuFunctions";
import { Button } from "@mui/material";

function ManualSolverPage() {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [Grid, setGrid] = useState<SudokuCell[][]>(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({ value: 0, isEditable: true }))
    )
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const handleNumberClick = (num: number) => {
    setSelectedNumber(num);
  };
  const handleNumberUsed = () => {
    // Clear selected number after it's used
    setSelectedNumber(null);
  };
  const Solve = () => {
    const numberGrid = convertToNumberGrid(Grid);

    const solvedGrid = getSolvedGrid(numberGrid);
    if (solvedGrid) {
      // const solvedSudokuGrid = convertToSudokuCellGrid(solvedGrid);
      const updatedGrid = applySolvedGrid(Grid, solvedGrid);
      console.log(updatedGrid);
      setGrid(updatedGrid); // Update your state
    } else {
      console.log("This puzzle has no solution.");
    }
  };

  return (
    <>
      <div className="back-arrow">
        <button onClick={() => navigate("/")}>
          {" "}
          <KeyboardBackspaceIcon />
        </button>
      </div>
      <div className="game-page">
        <div className="num-generate">
          <NumberPad
            selectedNumber={selectedNumber}
            onNumberClick={handleNumberClick}
          />
        </div>
        <SudokuGrid
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          selectedNumber={selectedNumber}
          onNumberUsed={handleNumberUsed}
          Grid={Grid}
          setGrid={setGrid}
        />
        <Button onClick={Solve}>solve</Button>
      </div>
    </>
  );
}
export default ManualSolverPage;
