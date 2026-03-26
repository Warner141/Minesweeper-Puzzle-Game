import "./App.css";
import gridComponent from "./components/grid";
import timerComponent from "./components/timer";
import highScorePanelComponent from "./components/highScorePanel";
import instructionsComponent from "./components/instructions";
import { useState, useEffect } from "react";
import type { scoreEntryProps, score } from "./interfaces";
import Cookies from "js-cookie";
import {
  register,
  login,
  getStats,
  postScore,
  getLeaderboard,
  getUserRank,
} from "./api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const cookieScores = Cookies.get("scores");

  const [scores, setScores] = useState<scoreEntryProps[]>(
    cookieScores ? JSON.parse(cookieScores) : [],
  );

  useEffect(() => {
    Cookies.set("scores", JSON.stringify(scores));
  }, [scores]);

  let globalLeaderboard = [] as score[] | void;
  useEffect(() => {
    globalLeaderboard = getLeaderboard();
  }, []);

  const [score, setScore] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(120);
  if (remainingSeconds === 0) {
    setScores((prevScores) => [
      ...prevScores,
      {
        score: score,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
    ]);
    setScores((prevScores) => {
      const sortedScores = [...prevScores].sort((a, b) => b.score - a.score);
      return sortedScores;
    });
    setScore(0);
    setRemainingSeconds(120);
    console.log(scores);
  }
  return (
    <>
      <header id="header">
        <div id="title">Blind Spot</div>
        <div id="timer">
          Remaining Time:{" "}
          {timerComponent(remainingSeconds, setRemainingSeconds)}
        </div>
        <div id="score">Score: {score}</div>
      </header>
      <div id="body">
        <main id="game">
          {gridComponent(
            6,
            6,
            score,
            setScore,
            remainingSeconds,
            setRemainingSeconds,
          )}
        </main>
        <main id="sideBar">
          <div id="leftSideBar">
            <div id="highScore">{highScorePanelComponent(scores)}</div>
            <div id="leaderBoard">
              Leaderboard
              <div id="leaderBoardList">
                {globalLeaderboard
                  ? globalLeaderboard.map((score) => {
                      return (
                        <div>
                          <div>{score.username}</div>
                          <div>{score.score}</div>
                        </div>
                      );
                    })
                  : "An error occurred."}
              </div>
            </div>
          </div>
          <div id="rightSideBar">
            <div id="instructions">{instructionsComponent()}</div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
