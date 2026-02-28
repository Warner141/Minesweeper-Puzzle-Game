import "./App.css";
import cellComponent from "./cell.tsx"
import { useState } from "react";

export interface cellProps {
  hiddenValue: number
  isFlagged: boolean
  xIndex: number
  yIndex: number
  outputSymbol: string
}

const rows = 8 //the number of rows so really the height
const columns = 15 // ^ see above ^
const edgeLength = `${Math.min(854/columns, 480/rows)}px`
let grid: Array<Array<cellProps>> = []

for (let i = 0; i < rows; i++) {
  const tempRow = [] as Array<cellProps>

  for (let j = 0; j < columns; j++) {
    tempRow.push({"hiddenValue": 6, "isFlagged": false, "xIndex": j, "yIndex": i, "outputSymbol": ""} as cellProps)
  }

  grid.push(tempRow)
}



function App() {
  const [gridState, changeGridState] = useState(grid)
  return (
    <div>
      {gridState.map((row: Array<cellProps>) => (
        <ul id = "gridRow">
          {row.map((cell) => (
            <li id = "listItem" key={`${cell.xIndex}-${cell.yIndex}`}>
              {cellComponent(gridState, changeGridState, cell.xIndex, cell.yIndex, edgeLength)} 
          </li>
          ))}
        </ul>
      ))}
    </div>);
}

export default App;
