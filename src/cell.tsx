import "./cell.css";
import type { cellProps } from "./App";

function cellComponent(gridState: Array<Array<cellProps>>, changeGridState: Function, xIndex: number, yIndex: number, edgeLength: string) {
  document.documentElement.style.setProperty('--edgeLength', edgeLength); //sets the css variable "var(--edgeLength)"

  function onCellButtonClick() {
    let newGridState = gridState.slice()

    if (newGridState[yIndex][xIndex].outputSymbol == "P") {newGridState[yIndex][xIndex].outputSymbol = ""} 
    else {newGridState[yIndex][xIndex].outputSymbol = "P"}

    changeGridState(newGridState)
  }

  return (
  <div id="cellBody">
    <button id="cellButton" onClick={onCellButtonClick}>
      {gridState[yIndex][xIndex].outputSymbol}
    </button>
  </div>);
}

export default cellComponent;