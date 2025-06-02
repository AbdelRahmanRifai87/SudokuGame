// src/components/SudokuGrid/SudokuCell.tsx
import "./style/SudokuCell.css";

type Props = {
  number?: number | "";
  isEditable: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  wasSolved?: boolean;
  isConflict?: boolean;
  onClick?: () => void;
};

function SudokuCell({
  number,
  isEditable,
  isSelected = false,
  wasSolved,
  isHighlighted = false,
  isConflict = false,
  onClick,
}: Props) {
  const classNames = [
    "sudoku-cell",
    isSelected ? "selected" : "",
    wasSolved ? "solved" : "",
    isHighlighted ? "highlighted" : "",
    isConflict ? "conflict" : "",
    !isEditable ? "fixed" : "",
  ].join(" ");
  return (
    <div className={classNames} onClick={onClick}>
      <span className="sudoku-number">{number !== 0 ? number : ""}</span>
    </div>
  );
}

export default SudokuCell;
