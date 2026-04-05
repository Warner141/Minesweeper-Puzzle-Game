import type { score } from "../interfaces";
import "./globalLeaderboardPanel.css";

export default function GlobalLeaderboardComponent({
  globalLeaderboard,
  username,
  userRank,
  highScore,
}: {
  globalLeaderboard: score[];
  username: string;
  userRank: number;
  highScore: score;
}) {
  return (
    <div id="leaderboardPanel">
      <div id="leaderboardTitle">Global Leaderboard </div>
      {globalLeaderboard.length === 0 ? (
        <div id="noScores">The global leaderboard is empty.</div>
      ) : (
        <div id="leaderboardTable">
          <div id="leaderboardScoreHeader">
            <div id="rankColumn"> </div>
            <div id="usernameColumn">Player</div>
            <div id="scoreColumn">Score</div>
            <div id="dateColumn">Date</div>
          </div>
          {globalLeaderboard.map((scoreItem: score, index: number) => (
            <div className="leaderboardScoreEntry" key={index}>
              <div className="index">#{index + 1}</div>
              <div className="username">{scoreItem.username}</div>
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
          {userRank >= 10 ? (
            <div className="leaderboardScoreEntry" id="userRank">
              <div className="index">#{userRank}</div>
              <div className="username">{username}</div>
              <div className="score">{highScore.score}</div>
              <div className="date">
                {new Date(highScore.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ) : (
            <div />
          )}
          {username === "" ? (
            <div id="noAccount">
              Create an account or log in to compete on the leaderboard.
            </div>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
