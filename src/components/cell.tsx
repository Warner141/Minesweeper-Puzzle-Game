import "./cell.css";
import type { cellProps } from "../interfaces";
import { useState, useEffect } from "react";

export default function Cell({
  cell,
  xIndex,
  yIndex,
  handleLeftCellClick,
  handleRightCellClick,
}: {
  cell: cellProps;
  xIndex: number;
  yIndex: number;
  handleLeftCellClick: Function;
  handleRightCellClick: Function;
}) {
  const [outputSymbol, setOutputSymbol] = useState<string>(findOutputSymbol());

  useEffect(() => {
    setOutputSymbol(findOutputSymbol());
  }, [cell]);

  function findOutputSymbol() {
    if (cell.isSolution) {
      return "✅";
    } else if (!cell.isMine) {
      return cell.neighboringMines.toString();
    } else if (cell.isFlagged) {
      return "🏳️";
    } else {
      return "";
    }
  }

  return (
    <div
      className="cell-button"
      style={{ position: "relative" }}
      onClick={(e) => {
        handleLeftCellClick(e.currentTarget, xIndex, yIndex);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightCellClick(xIndex, yIndex);
      }}
    >
      {outputSymbol}
    </div>
  );
}
