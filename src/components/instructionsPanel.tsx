import "./instructionsPanel.css";
export default function InstructionsComponent() {
  return (
    <div id="instructionsPanel">
      <div id="instructionsTitle">How to Play</div>
      <ul id="instructionsList">
        <li>Tiles are either mines or safe</li>
        <li>Safe tiles show nearby mine counts</li>
        <li>Only one hidden tile is safe</li>
        <li>Use the numbers to deduce it</li>
        <li>Click the correct tile to score</li>
        <li>Find as many before time ends</li>
        <li>Mistakes incur a 3 second penalty</li>
      </ul>
    </div>
  );
}
