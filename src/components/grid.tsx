import cellComponent from "./cell.tsx";
import { useState } from "react";

export interface cellProps {
  hiddenValue: number;
  isFlagged: boolean;
  xIndex: number;
  yIndex: number;
  outputSymbol: string;
}

function gridComponent(rows: number, columns: number) {
  const edgeLength = `${Math.min(854 / columns, 480 / rows)}px`;

  let grid: Array<Array<cellProps>> = [];
  const [gridState, changeGridState] = useState(grid);

  for (let i = 0; i < rows; i++) {
    const tempRow = [] as Array<cellProps>;

    for (let j = 0; j < columns; j++) {
      tempRow.push({
        hiddenValue: 6,
        isFlagged: false,
        xIndex: j,
        yIndex: i,
        outputSymbol: "",
      } as cellProps);
    }

    grid.push(tempRow);
  }

  return (
    <div>
      {gridState.map((row: Array<cellProps>) => (
        <ul id="gridRow">
          {row.map((cell) => (
            <li id="listItem" key={`${cell.xIndex}-${cell.yIndex}`}>
              {cellComponent(
                gridState,
                changeGridState,
                cell.xIndex,
                cell.yIndex,
                edgeLength,
              )}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default gridComponent;
