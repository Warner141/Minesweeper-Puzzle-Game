import "./game.css";
import gridComponent from "../components/grid";
import TimerComponent from "../components/timer";
import HighScorePanelComponent from "../components/highScorePanel";
import InstructionsComponent from "../components/instructionsPanel";
import { useState, useEffect, type JSX } from "react";
import type { score } from "../interfaces";
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
    setIsPaused(!isPaused);
    setRemainingSeconds((prevSeconds) => {
      return prevSeconds - 1;
    });
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

  interface gamePageData {
    cookieScores: score[] | void;
    DBScores: score[] | void;
    globalLeaderboard: score[] | void;
    gamesPlayed: number;
    userRank: number | void;
    username: string | void;
  }

  const fetchData = async (token: string | void) => {
    const globalLeaderboard = await getLeaderboard();
    let DBScores = [] as score[];
    let gamesPlayed = -1;
    let userRank = -1;
    let cookieScores = Cookies.get("scores");
    let username = "";
    if (token) {
      const stats = await getStats(token);
      DBScores = stats.scores;
      gamesPlayed = stats.gamesPlayed;
      username = stats.username;
      userRank = await getUserRank(token);
    }
    const data = {
      cookieScores: cookieScores ? JSON.parse(cookieScores) : undefined,
      DBScores: DBScores,
      globalLeaderboard: globalLeaderboard,
      gamesPlayed: gamesPlayed,
      userRank: userRank,
      username: username,
    } as gamePageData;

    return data;
  };
  const [scores, setScores] = useState<score[]>([]);
  const [data, setData] = useState({
    cookieScores: [],
    DBScores: [],
    globalLeaderboard: [],
    gamesPlayed: 0,
    userRank: -1,
    username: "",
  } as gamePageData);

  useEffect(() => {
    fetchData(props.token).then((result) => setData(result));
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
        fetchData(props.token).then((result) => {
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
              ❚❚
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
