import { useState } from "react";
import { getHintedGrid } from "../utils/SudokuFunctions";
import type { SudokuCell } from "../utils/SudokuFunctions";
import "./SudokuGrid/style/HintButton.css";
import { useEffect } from "react";

type Props = {
  grid: SudokuCell[][];
  setGrid: React.Dispatch<React.SetStateAction<SudokuCell[][]>>;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >;
  selectedCell: { row: number; col: number } | null;
  hintCount: number;
  setHintCount: React.Dispatch<React.SetStateAction<number>>;
};

export default function HintButton({
  grid,
  setGrid,
  selectedCell,
  setSelectedCell,
  hintCount,
  setHintCount,
}: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleHint = () => {
    if (!selectedCell) {
      setErrorMsg("Please select a cell to get a hint.");
      return;
    }
    if (hintCount === 0) {
      setErrorMsg("No hints left!");
      return;
    }

    const { newGrid, message } = getHintedGrid(grid, selectedCell);
    if (message) {
      setErrorMsg(message); // Display this message to the user
      return;
    }
    if (newGrid) {
      setGrid(newGrid);
      setHintCount(hintCount - 1);
      setSelectedCell(null);
      setErrorMsg(null);
    } else {
      setErrorMsg("No hint could be generated for the selected cell.");
    }
  };
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <>
      <button
        onClick={handleHint}
        className="hint-button"
        disabled={hintCount === 0}
      >
        Hint ({hintCount} left)
      </button>
      {errorMsg && <div className="hint-error-message">{errorMsg} </div>}
    </>
  );
}
