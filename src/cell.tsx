import "./cell.css";
import type { cellProps } from "./App";

function cellComponent(gridState: Array<Array<cellProps>>, changeGridState: Function, xIndex: number, yIndex: number, hiddenValue: number, edgeLength: string) {
  document.documentElement.style.setProperty('--edgeLength', edgeLength); //sets the css variable "var(--edgeLength)"
  console.log(hiddenValue)
  function onCellButtonClick() {
    let newGridState = gridState.slice()
    if (newGridState[xIndex][yIndex].outputSymbol == "P") {newGridState[xIndex][yIndex].outputSymbol = ""} 
    else {newGridState[xIndex][yIndex].outputSymbol = "P"}
    changeGridState(newGridState)
  }

  return (
  <div id="cellBody">
    <button id="cellButton" onClick={onCellButtonClick}>
      {gridState[xIndex][yIndex].outputSymbol}
    </button>
  </div>);
}

export default cellComponent;