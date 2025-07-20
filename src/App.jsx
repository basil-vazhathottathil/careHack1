import React, { useEffect, useState } from 'react';
import generateMaze from './utils/generateMaze';
import Maze from './components/Maze';

const rows = 15;
const cols = 15;

function getRandomFreeCell(maze) {
  let x, y;
  do {
    y = Math.floor(Math.random() * maze.length);
    x = Math.floor(Math.random() * maze[0].length);
  } while (maze[y][x] !== 0);
  return { x, y };
}

function App() {
  const [maze, setMaze] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [exitPosition, setExitPosition] = useState({ x: 0, y: 0 });
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const newMaze = generateMaze(rows, cols);
    const start = getRandomFreeCell(newMaze);
    let exit;
    do {
      exit = getRandomFreeCell(newMaze);
    } while (exit.x === start.x && exit.y === start.y);

    setMaze(newMaze);
    setPlayerPosition(start);
    setExitPosition(exit);
    setHasWon(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasWon) return;

      const { x, y } = playerPosition;
      let newX = x;
      let newY = y;

      if (e.key === 'ArrowUp') newY -= 1;
      else if (e.key === 'ArrowDown') newY += 1;
      else if (e.key === 'ArrowLeft') newX -= 1;
      else if (e.key === 'ArrowRight') newX += 1;

      if (
        newX >= 0 &&
        newX < cols &&
        newY >= 0 &&
        newY < rows &&
        maze[newY][newX] === 0
      ) {
        setPlayerPosition({ x: newX, y: newY });

        if (newX === exitPosition.x && newY === exitPosition.y) {
          setHasWon(true);
          alert('🎉 You reached the goal!');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, maze, hasWon, exitPosition]);

  return (
    <div className="App">
      <h2 style={{ textAlign: 'center' }}>👁️ Eye Maze</h2>
      <Maze maze={maze} playerPosition={playerPosition} exitPosition={exitPosition} />
    </div>
  );
}

export default App;
