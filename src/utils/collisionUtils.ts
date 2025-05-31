// Check if a position is a wall
export const checkCollision = (x: number, y: number, map: number[][]) => {
  // Make sure coordinates are in bounds
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) {
    return true;
  }
  
  return map[y][x] === 1; // 1 represents a wall
};

// Check if Pac-Man collected a dot
export const checkDotCollection = (
  pacmanX: number, 
  pacmanY: number, 
  dots: {x: number, y: number}[]
) => {
  return dots.findIndex(dot => dot.x === pacmanX && dot.y === pacmanY);
};

// Check if Pac-Man collected a power pellet
export const checkPowerPellet = (
  pacmanX: number, 
  pacmanY: number, 
  powerPellets: {x: number, y: number}[]
) => {
  return powerPellets.findIndex(pellet => pellet.x === pacmanX && pellet.y === pacmanY);
};

// Check if Pac-Man collided with a ghost
export const checkGhostCollision = (
  pacmanX: number, 
  pacmanY: number, 
  ghosts: Array<{x: number, y: number, mode: string}>
) => {
  return ghosts.findIndex(ghost => ghost.x === pacmanX && ghost.y === pacmanY);
};