function instructionsComponent() {
  return (
    <div id="panel">
      <div id="title">How to Play:</div>
      <div id="text">
        This game takes place on a typical minesweeper board where each tile is
        either a mine or "safe". All but one of the safe tiles display the
        number of neighboring mines. Your task is to find the one unrevealed
        safe tile using your deduction and logic skills
      </div>
    </div>
  );
}

export default instructionsComponent;
