import type { scoreEntryProps } from "../interfaces";
import "./highScorePanel.css";

function highScorePanelComponent(scores: Array<scoreEntryProps> = []) {
  return (
    <div id="highScorePanel">
      <div id="highScoreTitle">Your Best Scores: </div>
      {scores.length === 0 ? (
        <div id="noScores">
          No scores yet. Play a game to see your scores here!
        </div>
      ) : (
        <div>
          <div id="scoreHeader">
            <div id="score">Score</div>
            <div id="date">Date</div>
          </div>
          {scores
            .slice(0, 3)
            .map((scoreItem: scoreEntryProps, index: number) => (
              <div id="scoreEntry" key={index}>
                <div id="index">#{index + 1}</div>
                <div id="score">{scoreItem.score}</div>
                <div id="date">{scoreItem.date}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default highScorePanelComponent;
