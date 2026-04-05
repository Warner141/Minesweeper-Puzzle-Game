import type { score } from "../interfaces";
import "./highScorePanel.css";

export default function HighScorePanelComponent({
  scores,
  gamesPlayed,
}: {
  scores: score[];
  gamesPlayed: number;
}) {
  return (
    <div id="highScorePanel">
      <div id="highScoreTitle">Your Best Scores: </div>
      {scores.length === 0 ? (
        <div id="noScores">
          No scores yet. Play a game to see your scores here!
        </div>
      ) : (
        <div id="highScoreTable">
          <div id="scoreHeader">
            <div id="rank"> </div>
            <div id="score">Score</div>
            <div id="date">Date</div>
          </div>
          {scores.slice(0, 3).map((scoreItem: score, index: number) => (
            <div className="scoreEntry" key={index}>
              <div className="index">#{index + 1}</div>
              <div className="score">{scoreItem.score}</div>
              <div className="date">
                {new Date(scoreItem.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <div id="gamesPlayed">
        {gamesPlayed != -1 ? (
          <div>Games Played: {gamesPlayed}</div>
        ) : (
          <div>Create an account or log in to see your games played.</div>
        )}
      </div>
    </div>
  );
}
