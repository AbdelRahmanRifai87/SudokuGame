// src/components/SudokuGrid/SudokuCell.tsx
import "./style/SudokuCell.css";

type Props = {
  number?: number | "";
  isSelected?: boolean;
  onClick?: () => void;
};

function SudokuCell({ number, isSelected = false, onClick }: Props) {
  return (
    <div
      className={`sudoku-cell ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span className="sudoku-number">{number !== 0 ? number : ""}</span>
    </div>
  );
}

export default SudokuCell;
