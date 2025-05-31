import { CELL_SIZE } from '../constants/gameConstants';

// Draw the maze
export const drawMaze = (ctx: CanvasRenderingContext2D, map: number[][], cellSize: number) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1) { // Wall
        ctx.fillStyle = '#1D4ED8'; // Blue wall
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        
        // Add wall highlights
        ctx.fillStyle = '#2563EB';
        ctx.fillRect(
          x * cellSize + 2, 
          y * cellSize + 2, 
          cellSize - 4, 
          cellSize - 4
        );
      }
    }
  }
};

// Draw dots and power pellets
export const drawDots = (
  ctx: CanvasRenderingContext2D, 
  dots: {x: number, y: number}[], 
  powerPellets: {x: number, y: number}[],
  cellSize: number
) => {
  // Draw regular dots
  ctx.fillStyle = '#FFF';
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(
      dot.x * cellSize + cellSize / 2,
      dot.y * cellSize + cellSize / 2,
      cellSize / 8,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
  
  // Draw power pellets
  ctx.fillStyle = '#FFF';
  powerPellets.forEach(pellet => {
    ctx.beginPath();
    ctx.arc(
      pellet.x * cellSize + cellSize / 2,
      pellet.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
};

// Draw Pac-Man
export const drawPacman = (
  ctx: CanvasRenderingContext2D, 
  pacman: {x: number, y: number, direction: string, mouthOpen: boolean},
  cellSize: number
) => {
  const centerX = pacman.x * cellSize + cellSize / 2;
  const centerY = pacman.y * cellSize + cellSize / 2;
  const radius = cellSize / 2 - 2;
  
  // Angles for mouth
  let startAngle = 0.2 * Math.PI;
  let endAngle = 1.8 * Math.PI;
  
  if (pacman.direction === 'up') {
    startAngle = 1.25 * Math.PI;
    endAngle = 2.75 * Math.PI;
  } else if (pacman.direction === 'down') {
    startAngle = 0.25 * Math.PI;
    endAngle = 1.75 * Math.PI;
  } else if (pacman.direction === 'left') {
    startAngle = 0.75 * Math.PI;
    endAngle = 2.25 * Math.PI;
  } else if (pacman.direction === 'right') {
    startAngle = 1.75 * Math.PI;
    endAngle = 0.25 * Math.PI;
  }
  
  // If mouth is closed, draw full circle
  if (!pacman.mouthOpen) {
    startAngle = 0;
    endAngle = 2 * Math.PI;
  }
  
  // Draw Pac-Man body
  ctx.fillStyle = '#FACC15'; // Yellow
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fill();
  
  // Draw eye
  ctx.fillStyle = '#000';
  
  // Position eye based on direction
  let eyeX = centerX + radius / 3;
  let eyeY = centerY - radius / 2;
  
  if (pacman.direction === 'up') {
    eyeX = centerX + radius / 3;
    eyeY = centerY - radius / 3;
  } else if (pacman.direction === 'down') {
    eyeX = centerX + radius / 3;
    eyeY = centerY + radius / 3;
  } else if (pacman.direction === 'left') {
    eyeX = centerX - radius / 3;
    eyeY = centerY - radius / 2;
  }
  
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, radius / 8, 0, Math.PI * 2);
  ctx.fill();
};

// Draw ghosts
export const drawGhosts = (
  ctx: CanvasRenderingContext2D, 
  ghosts: Array<{x: number, y: number, color: string, direction: string, mode: string}>,
  poweredUp: boolean,
  cellSize: number
) => {
  ghosts.forEach(ghost => {
    const centerX = ghost.x * cellSize + cellSize / 2;
    const centerY = ghost.y * cellSize + cellSize / 2;
    const radius = cellSize / 2 - 2;
    
    // Select color based on ghost and game state
    let color = ghost.color;
    if (poweredUp) {
      color = 'blue';
    }
    
    // Draw ghost body
    ctx.fillStyle = getGhostColor(color);
    
    // Body (semi-circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius / 3, radius, Math.PI, 0, false);
    
    // Bottom zig-zag
    ctx.lineTo(centerX + radius, centerY + radius / 2);
    
    // Create zig-zag effect at the bottom
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(centerX + radius - (radius / 3) * (i + 1), centerY + radius / 2 - ((i % 2) * radius / 3));
    }
    
    ctx.lineTo(centerX - radius, centerY + radius / 2);
    ctx.closePath();
    ctx.fill();
    
    // Eyes base (white)
    const eyeRadius = radius / 4;
    const eyeYPos = centerY - radius / 4;
    const leftEyeX = centerX - radius / 3;
    const rightEyeX = centerX + radius / 3;
    
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeYPos, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeYPos, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils (based on direction)
    ctx.fillStyle = '#000';
    
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;
    
    if (ghost.direction === 'up') {
      pupilOffsetY = -eyeRadius / 2;
    } else if (ghost.direction === 'down') {
      pupilOffsetY = eyeRadius / 2;
    } else if (ghost.direction === 'left') {
      pupilOffsetX = -eyeRadius / 2;
    } else if (ghost.direction === 'right') {
      pupilOffsetX = eyeRadius / 2;
    }
    
    // Left eye pupil
    ctx.beginPath();
    ctx.arc(leftEyeX + pupilOffsetX, eyeYPos + pupilOffsetY, eyeRadius / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye pupil
    ctx.beginPath();
    ctx.arc(rightEyeX + pupilOffsetX, eyeYPos + pupilOffsetY, eyeRadius / 2, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Helper function to get ghost color
const getGhostColor = (color: string): string => {
  switch (color) {
    case 'red': return '#EF4444';
    case 'pink': return '#EC4899';
    case 'cyan': return '#06B6D4';
    case 'orange': return '#F97316';
    case 'blue': return '#3B82F6';
    default: return '#3B82F6';
  }
};

// Draw all game objects in one pass
export const drawGameObjects = (
  ctx: CanvasRenderingContext2D,
  gameMap: number[][],
  gameObjects: any,
  cellSize: number
) => {
  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw maze
  drawMaze(ctx, gameMap, cellSize);
  
  // Draw dots and power pellets
  drawDots(ctx, gameObjects.dots, gameObjects.powerPellets, cellSize);
  
  // Draw Pac-Man
  drawPacman(ctx, gameObjects.pacman, cellSize);
  
  // Draw ghosts
  drawGhosts(ctx, gameObjects.ghosts, gameObjects.poweredUp, cellSize);
};