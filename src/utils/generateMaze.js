// utils/generateMaze.js

export default function generateMaze(rows = 21, cols = 21) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill('wall'));

  // Directions: up, right, down, left
  const directions = [
    [-2, 0], [0, 2], [2, 0], [0, -2]
  ];

  function isValid(r, c) {
    return r > 0 && r < rows - 1 && c > 0 && c < cols - 1;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(r, c) {
    maze[r][c] = 'path';
    for (const [dr, dc] of shuffle(directions)) {
      const nr = r + dr;
      const nc = c + dc;
      const wallR = r + dr / 2;
      const wallC = c + dc / 2;
      if (isValid(nr, nc) && maze[nr][nc] === 'wall') {
        maze[wallR][wallC] = 'path';
        carve(nr, nc);
      }
    }
  }

  // Start from a random odd cell
  const startRow = 2 * Math.floor(Math.random() * ((rows - 1) / 2)) + 1;
  const startCol = 2 * Math.floor(Math.random() * ((cols - 1) / 2)) + 1;
  carve(startRow, startCol);

  // Get list of all path cells
  const pathCells = [];
  for (let r = 1; r < rows; r += 2) {
    for (let c = 1; c < cols; c += 2) {
      if (maze[r][c] === 'path') {
        pathCells.push([r, c]);
      }
    }
  }

  // Random player and exit positions from path cells
  const playerPos = pathCells[Math.floor(Math.random() * pathCells.length)];
  let exitPos;
  do {
    exitPos = pathCells[Math.floor(Math.random() * pathCells.length)];
  } while (exitPos[0] === playerPos[0] && exitPos[1] === playerPos[1]);

  return { maze, playerStart: playerPos, exit: exitPos };
}
