import "./cell.css";
import type { cellProps } from "../interfaces";
import { useState, useEffect } from "react";

function cellComponent(
  gridState: Array<Array<cellProps>>,
  setGrid: Function,
  xIndex: number,
  yIndex: number,
  score: number,
  setScore: Function,
  remainingSeconds: number,
  setRemainingSeconds: Function,
) {
  const [outputSymbol, setOutputSymbol] = useState<string>(findOutputSymbol());
  useEffect(() => {
    setOutputSymbol(findOutputSymbol());
  }, [gridState[yIndex][xIndex]]);

  function findOutputSymbol() {
    if (gridState[yIndex][xIndex].isSolution) {
      return "✅";
    } else if (gridState[yIndex][xIndex].isFlagged) {
      return "🚩";
    } else if (gridState[yIndex][xIndex].isMine) {
      return "";
    } else {
      return gridState[yIndex][xIndex].neighboringMines.toString();
    }
  }

  function timerPenalty() {
    if (remainingSeconds >= 3) {
      setRemainingSeconds(() => remainingSeconds - 3);
    }
  }
  function handleRightClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setGrid((prevGrid: cellProps[][]) => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      newGrid[yIndex][xIndex].isFlagged = !newGrid[yIndex][xIndex].isFlagged;
      return newGrid;
    });
  }
  function handleLeftClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    triggerRevealAnimation(e.currentTarget);
    if (gridState[yIndex][xIndex].isSolution) {
      setScore(score + 1);
    } else {
      timerPenalty();
    }
  }

  function triggerRevealAnimation(cellButton: HTMLDivElement) {
    cellButton.classList.add("clicked");
    setTimeout(() => {
      cellButton.classList.remove("clicked");
    }, 150);
  }

  return (
    <div
      id="cellButton"
      onClick={(e) => {
        handleLeftClick(e);
      }}
      onContextMenu={handleRightClick}
    >
      <div id="cellText">{outputSymbol}</div>
    </div>
  );
}

export default cellComponent;
