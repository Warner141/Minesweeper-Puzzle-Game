import type { cellProps } from "../interfaces";
import { useEffect, useState } from "react";
import cellComponent from "./cell.tsx";
import "./grid.css";

function createGrid(rows: number, columns: number) {
  let grid: Array<Array<cellProps>> = [];
  let isSolutionFound = false;
  let remainingCells = rows * columns;

  for (let i = 0; i < rows; i++) {
    const tempRow = [] as Array<cellProps>;

    for (let j = 0; j < columns; j++) {
      let isSolution = false;
      if (remainingCells == 1 && !isSolutionFound) {
        // if it is the last tile and no cell had been chosen as the solution
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

function gridComponent(
  rows: number,
  columns: number,
  score: number,
  setScore: Function,
  remainingSeconds: number,
  setRemainingSeconds: Function,
) {
  const [grid, setGrid] = useState(createGrid(rows, columns));

  document.documentElement.style.setProperty(
    "--edgeLength",
    `${Math.min((854 * 0.8) / rows, (480 * 0.8) / columns)}px`,
  ); //sets the css variable "var(--edgeLength)"

  useEffect(() => {
    setTimeout(() => {
      setGrid(createGrid(rows, columns));
    }, 150);
  }, [score]);

  return (
    <div id="compartment">
      <div id="grid">
        {grid.map((row: Array<cellProps>) => (
          <ul id="gridRow" key={row[0].yIndex}>
            {row.map((cell) => (
              <li id="listItem" key={`${cell.xIndex}-${cell.yIndex}`}>
                {cellComponent(
                  grid,
                  setGrid,
                  cell.xIndex,
                  cell.yIndex,
                  score,
                  setScore,
                  remainingSeconds,
                  setRemainingSeconds,
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default gridComponent;
