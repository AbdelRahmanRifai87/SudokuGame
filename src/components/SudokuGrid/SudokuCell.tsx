// src/components/SudokuGrid/SudokuCell.tsx
import "./style/SudokuCell.css";

type Props = {
  number?: number | "";
  isSelected?: boolean;
  isHighlighted?: boolean;
  isConflict?: boolean;
  onClick?: () => void;
};

function SudokuCell({
  number,
  isSelected = false,
  isHighlighted = false,
  isConflict = false,
  onClick,
}: Props) {
  return (
    <div
      className={`sudoku-cell 
        ${isSelected ? "selected" : ""} 
        ${isHighlighted ? "highlighted" : ""}
        ${isConflict ? "conflict" : ""}`}
      onClick={onClick}
    >
      <span className="sudoku-number">{number !== 0 ? number : ""}</span>
    </div>
  );
}

export default SudokuCell;
