import SudokuCell from "./SudokuCell";
import "./style/Sudoku3by3.css";

type Props = {
  subgrid: number[][];
  subgridIndex: number;
  onCellSelect: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  grid: number[][];
};

function Sudoku3by3({
  subgrid,
  subgridIndex,
  onCellSelect,
  selectedCell,
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

          return (
            <SudokuCell
              key={`${globalRow}-${globalCol}`}
              number={number}
              isSelected={isSelected}
              onClick={() => onCellSelect(globalRow, globalCol)}
            />
          );
        })
      )}
    </div>
  );
}

export default Sudoku3by3;
