import React, { useEffect, useState } from 'react';
import { generateMaze } from './utils/generateMaze';
import './components/Maze.css'; // Make sure this file exists and is styled correctly

function App() {
  const [mazeData, setMazeData] = useState(generateMaze(21, 21));
  const [playerPos, setPlayerPos] = useState(mazeData.playerStart);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasWon) return;

      const [r, c] = playerPos;
      let newR = r, newC = c;

      if (e.key === 'ArrowUp') newR--;
      else if (e.key === 'ArrowDown') newR++;
      else if (e.key === 'ArrowLeft') newC--;
      else if (e.key === 'ArrowRight') newC++;

      if (
        newR >= 0 &&
        newR < mazeData.maze.length &&
        newC >= 0 &&
        newC < mazeData.maze[0].length &&
        mazeData.maze[newR][newC] !== 'wall'
      ) {
        setPlayerPos([newR, newC]);

        if (newR === mazeData.exit[0] && newC === mazeData.exit[1]) {
          setHasWon(true);
          setTimeout(() => alert('🎉 You Win!'), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, mazeData, hasWon]);

  return (
    <div className="game-wrapper">
      <h1>Eye-Controlled Maze Game (Simulated)</h1>
      <div className="maze-container">
        <div
          className="maze-grid"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${mazeData.maze.length}, 20px)`,
            gridTemplateColumns: `repeat(${mazeData.maze[0].length}, 20px)`,
            border: '2px solid #ccc'
          }}
        >
          {mazeData.maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer =
                rowIndex === playerPos[0] && colIndex === playerPos[1];
              const isExit =
                rowIndex === mazeData.exit[0] && colIndex === mazeData.exit[1];

              let className = 'cell ';
              if (cell === 'wall') className += 'wall';
              else className += 'path';
              if (isPlayer) className += ' player';
              else if (isExit) className += ' exit';

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={className}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
