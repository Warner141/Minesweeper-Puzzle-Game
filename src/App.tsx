import "./App.css";
import gridComponent from "./components/grid";
import timerComponent from "./components/timer";
import highScorePanelComponent from "./components/highScorePanel";
import { useState, useEffect } from "react";
import type { scoreEntryProps } from "./interfaces";
import Cookies from "js-cookie";

function App() {
  const cookieScores = Cookies.get("scores");

  const [scores, setScores] = useState<scoreEntryProps[]>(
    cookieScores ? JSON.parse(cookieScores) : [],
  );

  useEffect(() => {
    Cookies.set("scores", JSON.stringify(scores));
  }, [scores]);

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
          {timerComponent(remainingSeconds, setRemainingSeconds)}
        </div>
        <div id="score">{score}</div>
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
          <div id="instructions"></div>
          <div id="highScore">{highScorePanelComponent(scores)}</div>
        </main>
      </div>
    </>
  );
}

export default App;
