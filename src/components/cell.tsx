import "./cell.css";
import type { cellProps } from "../interfaces";
import { useState } from "react";

function cellComponent(
  gridState: Array<Array<cellProps>>,
  xIndex: number,
  yIndex: number,
  edgeLength: string,
) {
  document.documentElement.style.setProperty("--edgeLength", edgeLength); //sets the css variable "var(--edgeLength)"

  const [outputSymbol, changeOutputSymbol] =
    useState<string>(findOutputSymbol());

  function findOutputSymbol() {
    if (gridState[yIndex][xIndex].isSolution) {
      return "";
    } else if (gridState[yIndex][xIndex].isMine) {
      return "";
    } else {
      return gridState[yIndex][xIndex].neighboringMines.toString();
    }
  }

  function onCellButtonClick() {
    if (gridState[yIndex][xIndex].isSolution) {
      console.log("You win!", { yIndex, xIndex });
      changeOutputSymbol("W");
    } else {
      changeOutputSymbol("L");
    }
  }

  return (
    <div id="cellButton" onClick={onCellButtonClick}>
      <div id="cellText">{outputSymbol}</div>
    </div>
  );
}

export default cellComponent;
