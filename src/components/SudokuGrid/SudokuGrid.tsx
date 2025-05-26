import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Sudoku3by3 from "./Sudoku3by3";
import extract3x3Subgrids from "../../utils/SudokuFunctions";

type Props = {
  selectedNumber?: number | null;
  onNumberUsed?: () => void;
};

function SudokuGrid({ selectedNumber, onNumberUsed }: Props) {
  const [Grid, setGrid] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    if (
      selectedNumber !== null &&
      selectedNumber !== undefined &&
      selectedCell
    ) {
      const updatedGrid: number[][] = Grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === selectedCell.row && colIndex === selectedCell.col
            ? selectedNumber
            : cell
        )
      );
      setGrid(updatedGrid);
      console.log("Updated Grid:", updatedGrid);
      onNumberUsed?.();
    }
  }, [selectedNumber, selectedCell, Grid, onNumberUsed]);

  const subgrids = extract3x3Subgrids(Grid);

  return (
    <Box
      display={"flex"}
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box
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
        {subgrids.map((subgrid, subgridIndex) => (
          <Sudoku3by3
            key={subgridIndex}
            subgrid={subgrid}
            subgridIndex={subgridIndex}
            onCellSelect={(row, col) => setSelectedCell({ row, col })}
            selectedCell={selectedCell}
            grid={Grid}
          />
        ))}
      </Box>
    </Box>
  );
}
export default SudokuGrid;
