import React, { useState, useEffect, useRef } from "react";
import Maze from "./components/Maze";
import generateMaze from "./utils/generateMaze";
import Confetti from "react-confetti";
import "./App.css";

const ROWS = 21;
const COLS = 21;
const GEM_COUNT = 5;
const GEM_POINTS = 10;

function App() {
  const [mazeData, setMazeData] = useState(generateMaze(ROWS, COLS));
  const [playerPos, setPlayerPos] = useState(mazeData.playerStart);
  const [hasWon, setHasWon] = useState(false);
  const [gems, setGems] = useState(generateGems(mazeData.maze, mazeData.playerStart, mazeData.exit));
  const [score, setScore] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const directionStartTime = useRef({});
  const lastDirection = useRef(null);
  const movementCooldown = useRef(false);

  // Confetti on win
  useEffect(() => {
    if (hasWon) {
      setTimeout(() => {
        const newMaze = generateMaze(ROWS, COLS);
        setMazeData(newMaze);
        setPlayerPos(newMaze.playerStart);
        setHasWon(false);
        setGems(generateGems(newMaze.maze, newMaze.playerStart, newMaze.exit));
        setScore(0);
      }, 2000);
    }
  }, [hasWon]);

  const movePlayer = (dx, dy) => {
    if (hasWon) return;

    const [newRow, newCol] = [playerPos[0] + dx, playerPos[1] + dy];
    const { maze, exit } = mazeData;

    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] !== "wall"
    ) {
      setPlayerPos([newRow, newCol]);

      // Check for gem collection
      const filteredGems = gems.filter(
        (g) => g[0] !== newRow || g[1] !== newCol
      );
      if (filteredGems.length !== gems.length) {
        setGems(filteredGems);
        setScore((prev) => prev + GEM_POINTS);
      }

      if (newRow === exit[0] && newCol === exit[1]) {
        setHasWon(true);
      }
    }
  };

  // Keyboard fallback
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          movePlayer(-1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePlayer(1, 0);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          movePlayer(0, -1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos, gems]);

  // Eye tracking movement logic
  useEffect(() => {
    if (!window.webgazer) return;

    window.webgazer.setGazeListener((data, elapsedTime) => {
      if (!data || movementCooldown.current) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;

      const dx = data.x - centerX;
      const dy = data.y - centerY;

      let dir = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 100 ? "right" : dx < -100 ? "left" : null;
      } else {
        dir = dy > 100 ? "down" : dy < -100 ? "up" : null;
      }

      if (!dir) {
        lastDirection.current = null;
        return;
      }

      if (dir !== lastDirection.current) {
        lastDirection.current = dir;
        directionStartTime.current[dir] = Date.now();
      } else {
        const duration = Date.now() - directionStartTime.current[dir];
        const steps = Math.floor(duration / 1000);

        if (steps > 0) {
          for (let i = 0; i < steps; i++) {
            switch (dir) {
              case "up":
                movePlayer(-1, 0);
                break;
              case "down":
                movePlayer(1, 0);
                break;
              case "left":
                movePlayer(0, -1);
                break;
              case "right":
                movePlayer(0, 1);
                break;
              default:
                break;
            }
          }
          movementCooldown.current = true;
          setTimeout(() => {
            movementCooldown.current = false;
            directionStartTime.current[dir] = Date.now();
          }, 1000); // delay before allowing more movement
        }
      }
    }).begin();

    return () => {
      if (window.webgazer) window.webgazer.clearGazeListener();
;
    };
  }, [playerPos, gems]);

  // For responsive confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
      <h1>Maze Game</h1>
      {hasWon && <div className="win-message">🎉 You Win! 🎉</div>}
      <div className="score">💎 Score: {score}</div>
      {hasWon && <Confetti width={windowSize.width} height={windowSize.height} />}
      <div className="maze-container">
        <Maze mazeData={mazeData} playerPos={playerPos} gems={gems} />
      </div>
    </div>
  );
}

function generateGems(maze, start, exit) {
  const gems = [];
  const visited = new Set();
  const isValid = (r, c) =>
    r >= 0 &&
    r < maze.length &&
    c >= 0 &&
    c < maze[0].length &&
    maze[r][c] === "path" &&
    !(r === start[0] && c === start[1]) &&
    !(r === exit[0] && c === exit[1]);

  while (gems.length < GEM_COUNT) {
    const r = Math.floor(Math.random() * maze.length);
    const c = Math.floor(Math.random() * maze[0].length);
    const key = `${r}-${c}`;
    if (isValid(r, c) && !visited.has(key)) {
      gems.push([r, c]);
      visited.add(key);
    }
  }

  return gems;
}

export default App;
