import "./menu.css";
export default function MenuComponent({
  onResume,
  onRestart,
  isPaused,
  isGameOver,
  isStartup,
}: {
  onResume: () => void;
  onRestart: () => void;
  isPaused: boolean;
  isGameOver: boolean;
  isStartup: boolean;
}) {
  return (
    <div id="menuPanel">
      {isPaused ? (
        <div id="pauseMenu">
          <div id="menuTitle">Paused</div>
          <div className="menuButton" onClick={onResume}>
            Resume
          </div>
          <div className="menuButton" onClick={onRestart}>
            Restart
          </div>
        </div>
      ) : isStartup ? (
        <div id="startMenu">
          <div id="menuTitle">Blind Spot</div>
          <div className="menuButton" onClick={onRestart}>
            Start Game
          </div>
        </div>
      ) : isGameOver ? (
        <div id="gameOverMenu">
          <div id="menuTitle">Game Over</div>
          <div className="menuButton" onClick={onRestart}>
            Play Again
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
