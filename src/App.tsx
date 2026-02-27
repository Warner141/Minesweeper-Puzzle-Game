import "./App.css";
import cellComponent from "./cell.tsx"

const rows = 5 //the number of rows so really the height
const columns = 10 // ^ see above ^
const edgeLength = `${1000/Math.max(columns, rows)}px`
let grid: Array<Array<Record<string, number>>> = []

for (let i = 0; i < rows; i++) {
  const tempRow = [] as Array<Record<string, number>>

  for (let j = 0; j < columns; j++) {
    tempRow.push({"hiddenValue": 6, } as Record<string, number>)
  }

  grid.push(tempRow)
}

function App() {
  return (
    <div>
      {grid.map((row: Array<Record<string, number>>) => (
        <ul id = "gridRow">
        {row.map((cell) => (
          <li id = "listItem" key={cell.id}>
            {cellComponent(cell.hiddenValue, edgeLength)} 
        </li>
        ))}
        </ul>
      ))}
    </div>);
}

export default App;
