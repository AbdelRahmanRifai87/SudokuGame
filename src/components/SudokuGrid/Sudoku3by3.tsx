import SudokuCell from "./SudokuCell";
import "./style/Sudoku3by3.css";
import { getCellStatus } from "../../utils/SudokuFunctions";
import type { SudokuCell as CellType } from "../../utils/SudokuFunctions";

type Props = {
  subgrid: CellType[][];
  subgridIndex: number;
  onCellSelect: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  grid: CellType[][];
  conflicts: { row: number; col: number }[];
};

function Sudoku3by3({
  subgrid,
  subgridIndex,
  onCellSelect,
  selectedCell,
  conflicts,
}: Props) {
  // Compute global row/col offsets for this subgrid
  const startRow = Math.floor(subgridIndex / 3) * 3;
  const startCol = (subgridIndex % 3) * 3;

  const renderCell = (
    cell: CellType,
    rowIndex: number,
    colIndex: number,
    startRow: number,
    startCol: number
  ) => {
    const globalRow = startRow + rowIndex;
    const globalCol = startCol + colIndex;

    const { isSelected, isHighlighted, isConflict } = getCellStatus(
      globalRow,
      globalCol,
      selectedCell,
      conflicts
    );

    return (
      <SudokuCell
        key={`${globalRow}-${globalCol}`}
        number={cell.value}
        isEditable={cell.isEditable}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        wasSolved={cell.wasSolved}
        isConflict={isConflict}
        onClick={() => onCellSelect(globalRow, globalCol)}
      />
    );
  };

  return (
    <div className="sudoku-grid">
      {subgrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          return renderCell(cell, rowIndex, colIndex, startRow, startCol);
        })
      )}
    </div>
  );
}

export default Sudoku3by3;
