import "./game.css";
import gridComponent from "../components/grid";
import TimerComponent from "../components/timer";
import HighScorePanelComponent from "../components/highScorePanel";
import InstructionsComponent from "../components/instructionsPanel";
import { useState, useEffect, type JSX } from "react";
import type { score, gamePageData } from "../interfaces";
import Cookies from "js-cookie";
import NavBar from "../components/navBar";
import { getStats, postScore, getLeaderboard, getUserRank } from "../api";
import GlobalLeaderboardComponent from "../components/globalLeaderboardPanel";
import MenuComponent from "../components/menu";

function GamePage(props: { token: string }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isStartup, setIsStartup] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  function handlePauseButton() {
    if (!isStartup && !isGameOver) {
      setIsPaused(!isPaused);
      setRemainingSeconds((prevSeconds) => {
        return prevSeconds - 1;
      });
    }
  }
  function onResume() {
    setIsPaused(false);
    setRemainingSeconds((prevSeconds) => {
      return prevSeconds - 1;
    });
  }
  function onRestart() {
    setScore(0);
    setRemainingSeconds(120);
    setIsGameOver(false);
    setResetKey((prevKey: number) => prevKey + 1);
    setIsStartup(false);
    setIsPaused(false);
  }

  const fetchGamePageData = async (token: string | null) => {
    const globalLeaderboard = await getLeaderboard();
    const cookieScores = Cookies.get("scores");

    return token
      ? await (async () => {
          const stats = await getStats(token);

          return {
            cookieScores: cookieScores ? JSON.parse(cookieScores) : null,
            DBScores: stats.scores,
            globalLeaderboard: globalLeaderboard,
            gamesPlayed: stats.gamesPlayed,
            userRank: await getUserRank(token),
            username: stats.username,
          } as gamePageData;
        })()
      : ({
          cookieScores: cookieScores ? JSON.parse(cookieScores) : null,
          DBScores: null,
          globalLeaderboard: globalLeaderboard,
          gamesPlayed: null,
          userRank: null,
          username: null,
        } as gamePageData);
  };
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<score[]>([]);
  const [data, setData] = useState({
    cookieScores: null,
    DBScores: null,
    globalLeaderboard: null,
    gamesPlayed: null,
    userRank: null,
    username: null,
  } as gamePageData);

  useEffect(() => {
    fetchGamePageData(props.token)
      .then((result) => setData(result))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setScores(
      data.DBScores && data.DBScores.length != 0
        ? data.DBScores
        : data.cookieScores
          ? data.cookieScores
          : [],
    );
  }, [data.DBScores, data.cookieScores]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(120);

  useEffect(() => {
    if (remainingSeconds === 0) {
      setScores((prevScores) => {
        const updatedScores = [
          ...prevScores,
          {
            score: score,
            createdAt: new Date(),
          } as score,
        ]
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        Cookies.set("scores", JSON.stringify(updatedScores));
        return updatedScores;
      });
      setIsPaused(false);
      setIsGameOver(true);

      postScore(props.token, score).then(() => {
        fetchGamePageData(props.token).then((result) => {
          setData(result);
          setScores(
            result.DBScores && result.DBScores.length != 0
              ? result.DBScores
              : result.cookieScores
                ? result.cookieScores
                : [],
          );
        });
      });
    }
  }, [remainingSeconds]);

  let gridState: JSX.Element = gridComponent(
    score,
    setScore,
    setRemainingSeconds,
    resetKey,
  );

  return (
    <>
      <NavBar username={data.username} />
      <div id="body">
        <div id="leftSideBar">
          <InstructionsComponent />
          <HighScorePanelComponent
            loading={loading}
            scores={scores}
            gamesPlayed={data.gamesPlayed}
          />
        </div>
        <div id="game">
          <div id="gameHeader">
            <div id="timer">
              Remaining Time:
              <TimerComponent
                remainingSeconds={remainingSeconds}
                setRemainingSeconds={setRemainingSeconds}
                isPaused={isPaused || isGameOver || isStartup}
              />
            </div>
            <div id="score">Score: {score}</div>
            <div id="pauseButton" onClick={handlePauseButton}>
              <img
                src="src\assets\Controls-Pause.svg"
                alt="❚❚"
                width="15"
                height="15"
              ></img>
            </div>
          </div>

          {isPaused || isGameOver || isStartup ? (
            <MenuComponent
              onResume={onResume}
              onRestart={onRestart}
              isPaused={isPaused}
              isGameOver={isGameOver}
              isStartup={isStartup}
            />
          ) : (
            gridState
          )}
        </div>

        <div id="rightSideBar">
          <GlobalLeaderboardComponent
            loading={loading}
            globalLeaderboard={
              data.globalLeaderboard ? data.globalLeaderboard : []
            }
            username={data.username ? data.username : ""}
            userRank={data.userRank ? data.userRank : -1}
            highScore={scores[0]}
          />
        </div>
      </div>
    </>
  );
}

export default GamePage;
