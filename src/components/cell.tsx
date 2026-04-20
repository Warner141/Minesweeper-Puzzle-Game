import "./cell.css";
import type { cellProps } from "../interfaces";
import { useState, useEffect } from "react";
import flagIcon from "../assets/triangle.svg";

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
    if (cell.isFlagged && (cell.isMine || cell.isSolution)) {
      return "flag";
    } else if (cell.isSolution) {
      return "";
    } else if (!cell.isMine) {
      return cell.neighboringMines.toString();
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
      {outputSymbol === "flag" ? (
        <img className="flag-icon" src={flagIcon} alt="🏳️" />
      ) : (
        outputSymbol
      )}
    </div>
  );
}
