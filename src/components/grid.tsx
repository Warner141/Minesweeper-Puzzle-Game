import type { cellProps } from "../interfaces";
import { useEffect, useState } from "react";
import Cell from "./cell.tsx";
import "./grid.css";
import createGrid from "../utils/createGrid.ts";

export default function gridComponent(
  score: number,
  setScore: Function,
  setRemainingSeconds: Function,
  resetKey: number,
) {
  const [grid, setGrid] = useState(createGrid());

  function triggerTimerPenalty(cell: HTMLElement) {
    setRemainingSeconds((prevSeconds: number) =>
      prevSeconds >= 3 ? prevSeconds - 3 : 0,
    );
    cell.classList.remove("penalty");
    void cell.offsetWidth;
    cell.classList.add("penalty");
    cell.addEventListener(
      "animationend",
      () => cell.classList.remove("penalty"),
      { once: true },
    );

    const label = document.createElement("div");
    label.className = "cell-penalty-label";
    label.textContent = "-3s";
    cell.appendChild(label);
    label.addEventListener("animationend", () => label.remove());
  }

  function triggerClickAnimation(element: HTMLDivElement) {
    element.classList.add("clicked");
    setTimeout(() => {
      element.classList.remove("clicked");
    }, 150);
  }

  function handleLeftCellClick(element: HTMLDivElement, x: number, y: number) {
    triggerClickAnimation(element);

    if (grid[y][x].isSolution) {
      setScore((prevScore: number) => prevScore + 1);
    } else {
      triggerTimerPenalty(element);
    }
  }

  function handleRightCellClick(x: number, y: number) {
    setGrid((prevGrid: cellProps[][]) => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
      return newGrid;
    });
  }

  useEffect(() => {
    setGrid(createGrid());
  }, [score, resetKey]);

  return (
    <>
      {grid.map((row: cellProps[]) => (
        <div className="grid-row" key={row[0].yIndex}>
          {row.map((cell) => (
            <div className="cell" key={`${cell.xIndex}-${cell.yIndex}`}>
              <Cell
                cell={cell}
                xIndex={cell.xIndex}
                yIndex={cell.yIndex}
                handleLeftCellClick={handleLeftCellClick}
                handleRightCellClick={handleRightCellClick}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
