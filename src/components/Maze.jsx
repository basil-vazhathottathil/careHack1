import React from 'react';
import styles from './Maze.module.css'; // Modular CSS

const Maze = ({ mazeData, playerPos }) => {
  const maze = mazeData.maze;
  const exit = mazeData.exit;

  const hasWon = playerPos[0] === exit[0] && playerPos[1] === exit[1];

  return (
    <div className={styles.mazeWrapper}>
      {/* {hasWon && (
        <div className={styles.winMessage}>
          🎉 You reached the exit!
        </div>
      )} */}

      <div
        className={styles.mazeGrid}
        style={{
          gridTemplateRows: `repeat(${maze.length}, 20px)`,
          gridTemplateColumns: `repeat(${maze[0].length}, 20px)`,
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPlayer =
              rowIndex === playerPos[0] && colIndex === playerPos[1];
            const isExit =
              rowIndex === exit[0] && colIndex === exit[1];

            let classNames = `${styles.cell} `;
            if (cell === 'wall') classNames += styles.wall;
            else classNames += ` ${styles.path}`;
            if (isPlayer) classNames += ` ${styles.player}`;
            else if (isExit) classNames += ` ${styles.exit}`;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classNames}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Maze;
