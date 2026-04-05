import type { cellProps } from "../interfaces";

export default function createGrid() {
  const rows = 6;
  const columns = 6;

  let grid: cellProps[][] = [];
  let isSolutionFound = false;
  let remainingCells = rows * columns;

  for (let i = 0; i < rows; i++) {
    const tempRow = [] as cellProps[];

    for (let j = 0; j < columns; j++) {
      let isSolution = false;
      if (remainingCells == 1 && !isSolutionFound) {
        isSolution = true;
      } else if (Math.random() < 1 / remainingCells && !isSolutionFound) {
        isSolution = true;
        isSolutionFound = true;
      }
      tempRow.push({
        isMine: !isSolution && Math.random() < 0.5,
        neighboringMines: 0,
        isSolution: isSolution,
        xIndex: j,
        yIndex: i,
      } as cellProps);
      remainingCells--;
    }
    grid.push(tempRow);
  }

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (!grid[i][j].isMine) {
        let neighboringMines = 0;
        for (const [dx, dy] of directions) {
          const newX = j + dx;
          const newY = i + dy;

          if (newX >= 0 && newX < columns && newY >= 0 && newY < rows) {
            if (grid[newY][newX].isMine) {
              neighboringMines++;
            }
          }
        }
        grid[i][j].neighboringMines = neighboringMines;
      }
    }
  }
  return grid;
}
