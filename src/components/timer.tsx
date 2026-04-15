import "./grid.css";
import { useEffect } from "react";

function formattedTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function TimerComponent({
  remainingSeconds,
  setRemainingSeconds,
  isPaused,
}: {
  remainingSeconds: number;
  setRemainingSeconds: Function;
  isPaused: boolean;
}) {
  const shakingThreshold = 120;
  const pulseThreshold = 120;

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev: number) => prev - 1);
    }, 1000);

    if (remainingSeconds <= shakingThreshold) {
      const gridElement = document.getElementById("gameState");
      if (gridElement) {
        gridElement.classList.add("low-time");
      }
    } else {
      const gridElement = document.getElementById("grid");
      if (gridElement) {
        gridElement.classList.remove("low-time");
      }
    }
    return () => clearInterval(interval);
  }, [remainingSeconds, isPaused]);
  return (
    <div
      className={`${remainingSeconds <= pulseThreshold ? "red-text apply-pulse" : ""}`}
    >
      {formattedTime(remainingSeconds)}
    </div>
  );
}
