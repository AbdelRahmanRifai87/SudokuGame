import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Sudoku3by3 from "./Sudoku3by3";
import extract3x3Subgrids, {
  validateSudoku,
} from "../../utils/SudokuFunctions";
import "./style/SudokuGrid.css";

type Props = {
  selectedNumber?: number | null;
  onNumberUsed?: () => void;
};
const solvedGrid = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];
//  Array(9)
//       .fill(null)
//       .map(() => Array(9).fill(0))
function SudokuGrid({ selectedNumber, onNumberUsed }: Props) {
  // Initialize a 9x9 grid with zeros
  const [Grid, setGrid] = useState(solvedGrid);

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

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
          row.map((cell, colIndex) =>
            rowIndex === selectedCell.row && colIndex === selectedCell.col
              ? selectedNumber
              : cell
          )
        )
      );

      onNumberUsed?.();
    }
  }, [selectedNumber, selectedCell, onNumberUsed]);

  useEffect(() => {
    const conflictCells = validateSudoku(Grid);
    setConflicts(conflictCells);
  }, [Grid]);

  const subgrids = extract3x3Subgrids(Grid);

  // Handler for the button
  const handleCheckSolution = () => {
    const conflictCells = validateSudoku(Grid);
    if (conflictCells.length === 0 && Grid.flat().every((num) => num !== 0)) {
      setMessage("Congratulations! The solution is correct.");
      setShowMessage(true);
    } else {
      setMessage("There are conflicts or incomplete cells in the solution.");
      setConflicts(conflictCells); // Highlight conflicts on button press as well
      setShowMessage(true);
    }
  };
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

  return (
    <Box
      className="sudoku-grid-container"
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      height="100vh"
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
