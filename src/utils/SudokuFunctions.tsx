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
export default extract3x3Subgrids;
