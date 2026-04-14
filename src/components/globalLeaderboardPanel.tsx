import type { score } from "../interfaces";
import "./globalLeaderboardPanel.css";

export default function GlobalLeaderboardComponent({
  loading,
  globalLeaderboard,
  username,
  userRank,
  highScore,
}: {
  loading: boolean;
  globalLeaderboard: score[];
  username: string;
  userRank: number;
  highScore: score;
}) {
  console.log(globalLeaderboard);
  return (
    <div id="leaderboardPanel">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div id="leaderboardTitle">Global Leaderboard </div>
          {globalLeaderboard.length === 0 ? (
            <div className="no-scores">The global leaderboard is empty.</div>
          ) : (
            <div id="leaderboardTable">
              <div id="leaderboardScoreHeader">
                <div id="rankColumn"> </div>
                <div id="usernameColumn">Player</div>
                <div id="scoreColumn">Score</div>
                <div id="dateColumn">Date</div>
              </div>
              {globalLeaderboard.map((scoreItem: score, index: number) => (
                <div
                  className={`leaderboardScoreEntry${userRank === index + 1 ? " bold" : ""}`}
                  key={index}
                >
                  <div className="index">#{index + 1}</div>
                  <div className="username">
                    {scoreItem.username.length < 11
                      ? scoreItem.username
                      : scoreItem.username.slice(0, 11) + "..."}
                  </div>
                  <div className="score">{scoreItem.score}</div>
                  <div className="date">
                    {new Date(scoreItem.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
              {userRank > 10 ? (
                <div className="leaderboardScoreEntry" id="userRank">
                  <div className="index">#{userRank}</div>
                  <div className="username">
                    {username.length < 11
                      ? username
                      : username.slice(0, 11) + "..."}
                  </div>
                  <div className="score">
                    {highScore ? highScore.score : "-"}
                  </div>
                  <div className="date">
                    {highScore
                      ? new Date(highScore.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "--- --, ----"}
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
                <>
                  {userRank === -1 ? (
                    <div className="leaderboardScoreEntry" id="emptyScoreEntry">
                      <div className="index">#{"-"}</div>
                      <div className="username">
                        {username.length < 11
                          ? username
                          : username.slice(0, 11) + "..."}
                      </div>
                      <div className="score">{"-"}</div>
                      <div className="date">{"---/--/----"}</div>
                    </div>
                  ) : (
                    <div id="topTen">
                      You've cracked the top 10! Don't stop now!
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
