import "./grid.css";
import { useEffect, useRef } from "react";

function formattedTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function timerComponent(
  remainingSeconds: number,
  setRemainingSeconds: Function,
) {
  const shakingThreshold = 15;

  let isTimeoutSet = useRef<boolean>(false);
  useEffect(() => {
    if (isTimeoutSet.current) {
      return;
    } else {
      isTimeoutSet.current = true;
      setTimeout(() => {
        if (remainingSeconds > 0) {
          setRemainingSeconds((prevSeconds: number) => prevSeconds - 1);
        }
        isTimeoutSet.current = false;
      }, 1000);
    }
    if (remainingSeconds < shakingThreshold && remainingSeconds > 0) {
      const gridElement = document.getElementById("grid");
      if (gridElement) {
        gridElement.classList.add("apply-shake");
      }
    } else {
      const gridElement = document.getElementById("grid");
      if (gridElement) {
        gridElement.classList.remove("apply-shake");
      }
    }
  }, [remainingSeconds]);
  return formattedTime(remainingSeconds);
}

export default timerComponent;
