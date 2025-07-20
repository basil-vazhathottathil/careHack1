import React from "react";
import styles from "./Maze.module.css";

const Maze = ({ mazeData, playerPos, gems }) => {
  const maze = mazeData.maze;
  const exit = mazeData.exit;

  return (
    <div className={styles.mazeWrapper}>
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
            const isExit = rowIndex === exit[0] && colIndex === exit[1];
            const isGem = gems.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );

            let classNames = `${styles.cell} `;
            if (cell === "wall") classNames += styles.wall;
            else classNames += ` ${styles.path}`;
            if (isPlayer) classNames += ` ${styles.player}`;
            else if (isExit) classNames += ` ${styles.exit}`;
            else if (isGem) classNames += ` ${styles.gem}`;

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
