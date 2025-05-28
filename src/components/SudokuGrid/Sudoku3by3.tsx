import SudokuCell from "./SudokuCell";
import "./style/Sudoku3by3.css";

type Props = {
  subgrid: number[][];
  subgridIndex: number;
  onCellSelect: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  grid: number[][];
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

  return (
    <div className="sudoku-grid">
      {subgrid.map((row, rowIndex) =>
        row.map((number, colIndex) => {
          const globalRow = startRow + rowIndex;
          const globalCol = startCol + colIndex;
          const isSelected =
            selectedCell?.row === globalRow && selectedCell?.col === globalCol;
          const sameRow = selectedCell?.row === globalRow;
          const sameCol = selectedCell?.col === globalCol;

          const selectedSubgridRow = Math.floor((selectedCell?.row ?? -1) / 3);
          const selectedSubgridCol = Math.floor((selectedCell?.col ?? -1) / 3);
          const currentSubgridRow = Math.floor(globalRow / 3);
          const currentSubgridCol = Math.floor(globalCol / 3);
          const sameSubgrid =
            selectedSubgridRow === currentSubgridRow &&
            selectedSubgridCol === currentSubgridCol;

          const isHighlighted =
            !isSelected && (sameRow || sameCol || sameSubgrid);
          const isConflict = conflicts.some(
            (c) => c.row === globalRow && c.col === globalCol
          );
          return (
            <SudokuCell
              key={`${globalRow}-${globalCol}`}
              number={number}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isConflict={isConflict}
              onClick={() => onCellSelect(globalRow, globalCol)}
            />
          );
        })
      )}
    </div>
  );
}

export default Sudoku3by3;
