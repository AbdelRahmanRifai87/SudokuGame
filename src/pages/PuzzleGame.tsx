import NumberPad from "../components/NumPad";
import GeneratePuzzle from "../components/SudokuGrid/GeneratePuzzle";
import SudokuGrid from "../components/SudokuGrid/SudokuGrid";
import { useState } from "react";
import type { SudokuCell } from "../utils/SudokuFunctions";
import HintButton from "../components/HintButton";

export default function PuzzleGame() {
  const [Grid, setGrid] = useState<SudokuCell[][]>(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({ value: 0, isEditable: true }))
    )
  );
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const [hintCount, setHintCount] = useState(4);

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
  return (
    <>
      <div className="num-generate">
        <NumberPad
          selectedNumber={selectedNumber}
          onNumberClick={handleNumberClick}
        />
        <GeneratePuzzle setGrid={setGrid} setHintCount={setHintCount} />
      </div>
      <SudokuGrid
        selectedNumber={selectedNumber}
        onNumberUsed={handleNumberUsed}
        Grid={Grid}
        setGrid={setGrid}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
      />
      <HintButton
        grid={Grid}
        setGrid={setGrid}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        hintCount={hintCount}
        setHintCount={setHintCount}
      />
    </>
  );
}
