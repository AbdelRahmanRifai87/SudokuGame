import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Sudoku3by3 from "./Sudoku3by3";
import extract3x3Subgrids, {
  validateSudoku,
} from "../../utils/SudokuFunctions";
import "./style/SudokuGrid.css";
import type { SudokuCell } from "../../utils/SudokuFunctions";

type Props = {
  selectedNumber?: number | null;
  onNumberUsed?: () => void;
  Grid: SudokuCell[][];
  setGrid: React.Dispatch<React.SetStateAction<SudokuCell[][]>>;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >;
  selectedCell: { row: number; col: number } | null;
};

function SudokuGrid({
  selectedNumber,
  onNumberUsed,
  Grid,
  setGrid,
  selectedCell,
  setSelectedCell,
}: Props) {
  const [conflicts, setConflicts] = useState<{ row: number; col: number }[]>(
    []
  );

  const [message, setMessage] = useState<string>("");

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (
      selectedNumber !== null &&
      selectedNumber !== undefined &&
      selectedCell
    ) {
      setGrid((prevGrid) =>
        prevGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (
              rowIndex === selectedCell.row &&
              colIndex === selectedCell.col &&
              cell.isEditable
            ) {
              return { ...cell, value: selectedNumber! };
            }
            return cell;
          })
        )
      );

      onNumberUsed?.();
    }
  }, [selectedNumber, selectedCell, onNumberUsed]);

  useEffect(() => {
    const numericGrid = Grid.map((row) => row.map((cell) => cell.value));
    const conflictCells = validateSudoku(numericGrid);
    setConflicts(conflictCells);
  }, [Grid]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (showMessage) {
      // After 5 seconds start fading out
      const timer1 = setTimeout(() => {
        setShowMessage(false);
      }, 4500); // start fadeout before message disappears

      // After 5.5 seconds clear the message text
      const timer2 = setTimeout(() => {
        setMessage("");
      }, 5500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showMessage]);

  // Handler for the button
  const handleCheckSolution = () => {
    const numericGrid = Grid.map((row) => row.map((cell) => cell.value));
    const conflictCells = validateSudoku(numericGrid);

    if (
      conflictCells.length === 0 &&
      Grid.flat().every((cell) => cell.value !== 0)
    ) {
      setMessage("Congratulations! The solution is correct.");
      setShowMessage(true);
    } else {
      setMessage("There are conflicts or incomplete cells in the solution.");
      setConflicts(conflictCells); // Highlight conflicts on button press as well
      setShowMessage(true);
    }
  };

  const subgrids = extract3x3Subgrids(Grid);
  useEffect(() => console.log(`subgrid ${subgrids}`), []);

  return (
    <Box
      className="sudoku-grid-container"
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      height="100vh"
      zIndex={1}
    >
      <Box
        className="sudoku-grid"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3,1fr)",
          gap: 1.5,
          width: "500px",
          height: "500px",
          backgroundColor: "#f0f0f0",
          padding: 2,
          borderRadius: "8px",
        }}
      >
        {subgrids.map((subgrid, subgridIndex) => {
          // Calculate global starting row and col for each 3x3 subgrid

          return (
            <Sudoku3by3
              key={subgridIndex}
              subgrid={subgrid}
              subgridIndex={subgridIndex}
              onCellSelect={(row, col) => setSelectedCell({ row, col })}
              selectedCell={selectedCell}
              grid={Grid}
              conflicts={conflicts}
            />
          );
        })}
      </Box>

      <Box sx={{ position: "relative", marginLeft: "20px" }}>
        <Button variant="contained" onClick={handleCheckSolution}>
          Check Solution
        </Button>

        {message && (
          <Box
            mt={2}
            className={`message ${showMessage ? "visible" : "hidden"}`}
            sx={{
              backgroundColor: `${
                message.includes("Congratulations") ? "green" : "red"
              }`,
            }}
          >
            {message}
          </Box>
        )}
      </Box>
    </Box>
  );
}
export default SudokuGrid;
