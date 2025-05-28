function extract3x3Subgrids(grid: number[][]): number[][][] {
  const subgrids: number[][][] = [];

  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const subgrid: number[][] = [];

      for (let i = 0; i < 3; i++) {
        const row: number[] = [];
        for (let j = 0; j < 3; j++) {
          row.push(grid[boxRow * 3 + i][boxCol * 3 + j]);
        }
        subgrid.push(row);
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
export { validateSudoku };
export default extract3x3Subgrids;
