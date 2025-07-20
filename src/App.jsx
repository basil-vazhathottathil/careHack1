import React, { useEffect, useState, useCallback } from 'react';
import Maze from './components/Maze';
import generateMaze from './utils/generateMaze';
import confetti from 'canvas-confetti';
import './App.css';

const App = () => {
  const [mazeData, setMazeData] = useState(generateMaze(21, 21));
  const [playerPos, setPlayerPos] = useState(mazeData.playerStart);
  const [hasWon, setHasWon] = useState(false);

  const movePlayer = useCallback((dx, dy) => {
    const [x, y] = playerPos;
    const newX = x + dx;
    const newY = y + dy;

    if (
      newX >= 0 &&
      newX < mazeData.maze.length &&
      newY >= 0 &&
      newY < mazeData.maze[0].length &&
      mazeData.maze[newX][newY] !== 'wall'
    ) {
      setPlayerPos([newX, newY]);

      if (newX === mazeData.exit[0] && newY === mazeData.exit[1]) {
        setHasWon(true);
        confetti();
        setTimeout(() => {
          const newMaze = generateMaze(21, 21);
          setMazeData(newMaze);
          setPlayerPos(newMaze.playerStart);
          setHasWon(false);
        }, 2000);
      }
    }
  }, [playerPos, mazeData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer(-1, 0);
          break;
        case 'ArrowDown':
        case 's':
          movePlayer(1, 0);
          break;
        case 'ArrowLeft':
        case 'a':
          movePlayer(0, -1);
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="app">
      <h1>Maze Game</h1>
      {hasWon && <div className="win-message">🎉 You Win! 🎉</div>}
      <div className="maze-container">
        <Maze mazeData={mazeData} playerPos={playerPos} />
      </div>
    </div>
  );
};

export default App;
