function extract3x3Subgrids(grid: SudokuCell[][]): SudokuCell[][][] {
  const subgrids: SudokuCell[][][] = [];

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const subgrid: SudokuCell[][] = [];

      for (let row = 0; row < 3; row++) {
        const currentRow: SudokuCell[] = [];
        for (let col = 0; col < 3; col++) {
          currentRow.push(grid[boxRow * 3 + row][boxCol * 3 + col]);
        }
        subgrid.push(currentRow);
      }

      subgrids.push(subgrid);
    }
  }

  return subgrids;
}
function validateSudoku(grid: number[][]): { row: number; col: number }[] {
  const conflicts: Set<string> = new Set();

  // Helper to register conflicts
  const addConflict = (row: number, col: number) => {
    conflicts.add(`${row},${col}`);
  };

  // Validate rows and columns
  for (let i = 0; i < 9; i++) {
    const rowMap = new Map<number, number[]>();
    const colMap = new Map<number, number[]>();

    for (let j = 0; j < 9; j++) {
      const rowVal = grid[i][j];
      const colVal = grid[j][i];

      if (rowVal !== 0) {
        if (!rowMap.has(rowVal)) rowMap.set(rowVal, []);
        rowMap.get(rowVal)!.push(j);
      }

      if (colVal !== 0) {
        if (!colMap.has(colVal)) colMap.set(colVal, []);
        colMap.get(colVal)!.push(j);
      }
    }

    rowMap.forEach((indices, val) => {
      if (indices.length > 1) {
        indices.forEach((j) => addConflict(i, j));
      }
    });

    colMap.forEach((indices, val) => {
      if (indices.length > 1) {
        indices.forEach((j) => addConflict(j, i));
      }
    });
  }

  // Validate 3x3 subgrids
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const seen = new Map<number, [number, number][]>();

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = blockRow * 3 + i;
          const col = blockCol * 3 + j;
          const val = grid[row][col];

          if (val !== 0) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push([row, col]);
          }
        }
      }

      seen.forEach((cells, val) => {
        if (cells.length > 1) {
          cells.forEach(([r, c]) => addConflict(r, c));
        }
      });
    }
  }

  // Convert conflict set back to array of {row, col}
  return Array.from(conflicts).map((conflict) => {
    const [row, col] = conflict.split(",").map(Number);
    return { row, col };
  });
}

export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

function getShuffledNumbers(): number[] {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

export function solveSudoku(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = getShuffledNumbers();
        for (let num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function applySolvedGrid(
  original: SudokuCell[][],
  solved: number[][]
): SudokuCell[][] {
  return original.map((row, i) =>
    row.map((cell, j) => {
      const isNewlySolved = cell.value === 0 && solved[i][j] !== 0;
      return {
        value: solved[i][j],
        isEditable: false,
        wasSolved: isNewlySolved,
      };
    })
  );
}

export function getHintedGrid(
  grid: SudokuCell[][],
  selectedCell: { row: number; col: number } | null
): { newGrid: SudokuCell[][] | null; message?: string } {
  if (!selectedCell) {
    return { newGrid: null, message: "No cell selected." };
  }

  const { row, col } = selectedCell;
  const cell = grid[row][col];

  if (!cell.isEditable) {
    return { newGrid: null, message: "The selected cell is not editable." };
  }

  const numericGrid = grid.map((r) => r.map((c) => c.value));
  const solved = getSolvedGrid(numericGrid);
  if (!solved) {
    return {
      newGrid: null,
      message: "Could not solve the puzzle to provide a hint.",
    };
  }

  if (cell.value === solved[row][col]) {
    return {
      newGrid: null,
      message: "The selected cell already has the correct value.",
    };
  }

  const newGrid = grid.map((r, ri) =>
    r.map((c, ci) =>
      ri === row && ci === col
        ? { ...c, value: solved[ri][ci], wasSolved: true, isEditable: false }
        : c
    )
  );

  return { newGrid };
}

export function convertToNumberGrid(grid: SudokuCell[][]): number[][] {
  return grid.map((row) => row.map((cell) => cell.value));
}
export function convertToSudokuCellGrid(grid: number[][]): SudokuCell[][] {
  return grid.map((row) =>
    row.map((num) => ({
      value: num,
      isEditable: false, // Solved cells are not editable
    }))
  );
}

export function getSolvedGrid(grid: number[][]): number[][] | null {
  // Make a deep copy of the grid so the original is not modified
  const gridCopy = grid.map((row) => [...row]);

  if (solveSudoku(gridCopy)) {
    return gridCopy; // solved grid
  } else {
    return null; // puzzle not solvable
  }
}

// 1. Generate a fully solved Sudoku grid by starting with empty grid and solve it
export function generateFullGrid(): number[][] {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(grid);
  return grid;
}

// 2. Count solutions - backtracking that counts all possible solutions, stop if more than 1 found
export function countSolutions(grid: number[][], limit = 2): number {
  let count = 0;

  function backtrack(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              if (backtrack()) return true; // early stop if limit reached
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  backtrack();
  return count;
}

// 3. Main generator function
export type SudokuCell = {
  value: number;
  isEditable: boolean;
  wasSolved?: boolean;
};

export function generatePuzzle(
  difficulty: "easy" | "medium" | "hard"
): SudokuCell[][] {
  const difficultyLevels = {
    easy: 35,
    medium: 45,
    hard: 55,
  };

  const cellsToRemove = difficultyLevels[difficulty];
  const fullGrid = generateFullGrid();
  const puzzle = fullGrid.map((row) => [...row]); // shallow copy is fine here

  let attempts = 0;
  let removed = 0;

  while (removed < cellsToRemove && attempts < 1000) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] === 0) {
      attempts++;
      continue;
    }

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    // Deep copy the puzzle before solution check
    const puzzleCopy = puzzle.map((r) => [...r]);
    const solutionsCount = countSolutions(puzzleCopy);

    if (solutionsCount !== 1) {
      puzzle[row][col] = backup; // revert
    } else {
      removed++;
    }

    attempts++;
  }

  // Final conflict check
  const conflicts = validateSudoku(puzzle);
  if (conflicts.length > 0) {
    console.warn("Generated puzzle has conflicts. Regenerating...");
    return generatePuzzle(difficulty);
  }

  // Convert to SudokuCell grid
  const sudokuCells: SudokuCell[][] = puzzle.map((row) =>
    row.map((num) => ({
      value: num,
      isEditable: num === 0,
    }))
  );

  return sudokuCells;
}

export type Cell = { row: number; col: number };

export function getCellStatus(
  globalRow: number,
  globalCol: number,
  selectedCell: Cell | null,
  conflicts: Cell[]
): {
  isSelected: boolean;
  isHighlighted: boolean;
  isConflict: boolean;
} {
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

  const isHighlighted = !isSelected && (sameRow || sameCol || sameSubgrid);

  const isConflict = conflicts.some(
    (c) => c.row === globalRow && c.col === globalCol
  );

  return { isSelected, isHighlighted, isConflict };
}

export { validateSudoku };
export default extract3x3Subgrids;
