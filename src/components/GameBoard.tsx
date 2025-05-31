import React, { useState, useEffect, useRef } from 'react';
import { useKeyPress } from '../hooks/useKeyPress';
import useTouchControls from '../hooks/useTouchControls';
import { drawMaze, drawDots, drawPacman, drawGhosts, drawGameObjects } from '../utils/drawUtils';
import { checkCollision, checkDotCollection, checkPowerPellet, checkGhostCollision } from '../utils/collisionUtils';
import { CELL_SIZE, GAME_SPEED, MAPS } from '../constants/gameConstants';

interface GameBoardProps {
  level: number;
  onScoreUpdate: (points: number) => void;
  onLifeLost: () => void;
  onGameOver: () => void;
  onLevelComplete: () => void;
  isPaused: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  level,
  onScoreUpdate,
  onLifeLost,
  onGameOver,
  onLevelComplete,
  isPaused
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameObjects, setGameObjects] = useState({
    pacman: { x: 14, y: 23, direction: 'right', nextDirection: 'right', mouthOpen: true },
    ghosts: [
      { x: 13, y: 11, direction: 'up', color: 'red', mode: 'scatter', name: 'blinky' },
      { x: 14, y: 11, direction: 'up', color: 'pink', mode: 'scatter', name: 'pinky' },
      { x: 15, y: 11, direction: 'up', color: 'cyan', mode: 'scatter', name: 'inky' },
      { x: 16, y: 11, direction: 'up', color: 'orange', mode: 'scatter', name: 'clyde' }
    ],
    dots: [],
    powerPellets: [],
    poweredUp: false,
    poweredUpTimer: 0,
    dotsCollected: 0,
    totalDots: 0
  });

  const [gameMap, setGameMap] = useState<number[][]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const upPressed = useKeyPress('ArrowUp');
  const downPressed = useKeyPress('ArrowDown');
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');
  
  const { direction: touchDirection } = useTouchControls(canvasRef);

  // Initialize game map based on level
  useEffect(() => {
    const currentMap = MAPS[level % MAPS.length];
    setGameMap(currentMap);
    
    // Initialize dots and power pellets based on map
    const dots: {x: number, y: number}[] = [];
    const powerPellets: {x: number, y: number}[] = [];
    
    currentMap.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) { // Dot
          dots.push({x, y});
        } else if (cell === 3) { // Power pellet
          powerPellets.push({x, y});
        }
      });
    });
    
    setGameObjects(prev => ({
      ...prev,
      dots,
      powerPellets,
      dotsCollected: 0,
      totalDots: dots.length,
      pacman: { ...prev.pacman, x: 14, y: 23, direction: 'right', nextDirection: 'right' }
    }));
  }, [level]);

  // Game loop
  useEffect(() => {
    if (isPaused) return;

    const updateGame = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(updateGame);
        return;
      }
      
      const deltaTime = time - lastTimeRef.current;
      
      if (deltaTime >= GAME_SPEED) {
        // Handle user input
        if (upPressed || touchDirection === 'up') {
          setGameObjects(prev => ({
            ...prev, 
            pacman: { ...prev.pacman, nextDirection: 'up' }
          }));
        } else if (downPressed || touchDirection === 'down') {
          setGameObjects(prev => ({
            ...prev, 
            pacman: { ...prev.pacman, nextDirection: 'down' }
          }));
        } else if (leftPressed || touchDirection === 'left') {
          setGameObjects(prev => ({
            ...prev, 
            pacman: { ...prev.pacman, nextDirection: 'left' }
          }));
        } else if (rightPressed || touchDirection === 'right') {
          setGameObjects(prev => ({
            ...prev, 
            pacman: { ...prev.pacman, nextDirection: 'right' }
          }));
        }

        // Update game objects (pacman position, ghost positions, etc.)
        setGameObjects(prev => {
          // Update pacman
          let nextPacmanX = prev.pacman.x;
          let nextPacmanY = prev.pacman.y;
          let newDirection = prev.pacman.direction;
          
          // Check if nextDirection is valid
          if (prev.pacman.nextDirection === 'up' && gameMap[prev.pacman.y - 1]?.[prev.pacman.x] !== 1) {
            newDirection = 'up';
          } else if (prev.pacman.nextDirection === 'down' && gameMap[prev.pacman.y + 1]?.[prev.pacman.x] !== 1) {
            newDirection = 'down';
          } else if (prev.pacman.nextDirection === 'left' && gameMap[prev.pacman.y]?.[prev.pacman.x - 1] !== 1) {
            newDirection = 'left';
          } else if (prev.pacman.nextDirection === 'right' && gameMap[prev.pacman.y]?.[prev.pacman.x + 1] !== 1) {
            newDirection = 'right';
          }
          
          // Update position based on direction
          if (newDirection === 'up' && gameMap[prev.pacman.y - 1]?.[prev.pacman.x] !== 1) {
            nextPacmanY--;
          } else if (newDirection === 'down' && gameMap[prev.pacman.y + 1]?.[prev.pacman.x] !== 1) {
            nextPacmanY++;
          } else if (newDirection === 'left' && gameMap[prev.pacman.y]?.[prev.pacman.x - 1] !== 1) {
            nextPacmanX--;
          } else if (newDirection === 'right' && gameMap[prev.pacman.y]?.[prev.pacman.x + 1] !== 1) {
            nextPacmanX++;
          }

          // Handle teleport tunnels
          if (nextPacmanX < 0) nextPacmanX = gameMap[0].length - 1;
          if (nextPacmanX >= gameMap[0].length) nextPacmanX = 0;
          
          // Update ghosts
          const updatedGhosts = prev.ghosts.map(ghost => {
            // Simple ghost AI - more complex behavior would be implemented here
            const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
              if (dir === 'up' && gameMap[ghost.y - 1]?.[ghost.x] !== 1) return true;
              if (dir === 'down' && gameMap[ghost.y + 1]?.[ghost.x] !== 1) return true;
              if (dir === 'left' && gameMap[ghost.y]?.[ghost.x - 1] !== 1) return true;
              if (dir === 'right' && gameMap[ghost.y]?.[ghost.x + 1] !== 1) return true;
              return false;
            });
            
            // Don't reverse direction unless it's the only option
            const oppositeDir = {
              'up': 'down',
              'down': 'up',
              'left': 'right',
              'right': 'left'
            }[ghost.direction];
            
            let filteredDirections = possibleDirections.filter(dir => dir !== oppositeDir);
            if (filteredDirections.length === 0) {
              filteredDirections = possibleDirections;
            }
            
            // Choose direction based on mode
            let newDir = ghost.direction;
            let targetX = nextPacmanX;
            let targetY = nextPacmanY;
            
            // In frightened mode, move randomly
            if (prev.poweredUp) {
              newDir = filteredDirections[Math.floor(Math.random() * filteredDirections.length)];
            } 
            // In scatter mode, each ghost goes to a corner
            else if (ghost.mode === 'scatter') {
              if (ghost.name === 'blinky') { targetX = gameMap[0].length - 1; targetY = 0; }
              else if (ghost.name === 'pinky') { targetX = 0; targetY = 0; }
              else if (ghost.name === 'inky') { targetX = gameMap[0].length - 1; targetY = gameMap.length - 1; }
              else if (ghost.name === 'clyde') { targetX = 0; targetY = gameMap.length - 1; }
              
              // Choose direction that gets closer to target
              newDir = filteredDirections.reduce((best, dir) => {
                let newX = ghost.x;
                let newY = ghost.y;
                
                if (dir === 'up') newY--;
                else if (dir === 'down') newY++;
                else if (dir === 'left') newX--;
                else if (dir === 'right') newX++;
                
                const newDist = Math.abs(newX - targetX) + Math.abs(newY - targetY);
                const bestDist = Math.abs(ghost.x - targetX) + Math.abs(ghost.y - targetY);
                
                return newDist < bestDist ? dir : best;
              }, ghost.direction);
            } 
            // In chase mode, pursue Pac-Man
            else {
              newDir = filteredDirections.reduce((best, dir) => {
                let newX = ghost.x;
                let newY = ghost.y;
                
                if (dir === 'up') newY--;
                else if (dir === 'down') newY++;
                else if (dir === 'left') newX--;
                else if (dir === 'right') newX++;
                
                const newDist = Math.abs(newX - targetX) + Math.abs(newY - targetY);
                const bestDist = Math.abs(ghost.x - targetX) + Math.abs(ghost.y - targetY);
                
                return newDist < bestDist ? dir : best;
              }, ghost.direction);
            }
            
            // Apply movement
            let newX = ghost.x;
            let newY = ghost.y;
            
            if (newDir === 'up') newY--;
            else if (newDir === 'down') newY++;
            else if (newDir === 'left') newX--;
            else if (newDir === 'right') newX++;
            
            // Handle teleport tunnels
            if (newX < 0) newX = gameMap[0].length - 1;
            if (newX >= gameMap[0].length) newX = 0;
            
            return { ...ghost, x: newX, y: newY, direction: newDir };
          });
          
          // Check for dot collection
          const remainingDots = prev.dots.filter(dot => {
            if (dot.x === nextPacmanX && dot.y === nextPacmanY) {
              onScoreUpdate(10);
              return false;
            }
            return true;
          });
          
          // Check for power pellet collection
          let isPoweredUp = prev.poweredUp;
          let poweredUpTimer = prev.poweredUpTimer;
          const remainingPowerPellets = prev.powerPellets.filter(pellet => {
            if (pellet.x === nextPacmanX && pellet.y === nextPacmanY) {
              isPoweredUp = true;
              poweredUpTimer = 400; // ~8 seconds at 50ms per frame
              onScoreUpdate(50);
              return false;
            }
            return true;
          });
          
          // Update power-up timer
          if (isPoweredUp) {
            poweredUpTimer--;
            if (poweredUpTimer <= 0) {
              isPoweredUp = false;
            }
          }
          
          // Check for ghost collisions
          let livesLost = false;
          const updatedGhostsAfterCollision = updatedGhosts.map(ghost => {
            if (ghost.x === nextPacmanX && ghost.y === nextPacmanY) {
              if (isPoweredUp) {
                onScoreUpdate(200);
                // Move ghost back to starting position
                return {
                  ...ghost,
                  x: 14,
                  y: 11,
                  mode: 'scatter'
                };
              } else {
                livesLost = true;
                return ghost;
              }
            }
            return ghost;
          });
          
          if (livesLost) {
            onLifeLost();
            // Reset positions after life lost
            return {
              ...prev,
              pacman: { x: 14, y: 23, direction: 'right', nextDirection: 'right', mouthOpen: true },
              ghosts: prev.ghosts.map(ghost => ({
                ...ghost,
                x: 13 + (prev.ghosts.indexOf(ghost)),
                y: 11,
                direction: 'up',
                mode: 'scatter'
              })),
              dots: remainingDots,
              powerPellets: remainingPowerPellets,
              poweredUp: false,
              poweredUpTimer: 0,
              dotsCollected: prev.totalDots - remainingDots.length
            };
          }
          
          // Check if all dots collected - level complete
          if (remainingDots.length === 0 && remainingPowerPellets.length === 0) {
            onLevelComplete();
          }
          
          return {
            ...prev,
            pacman: {
              ...prev.pacman,
              x: nextPacmanX,
              y: nextPacmanY,
              direction: newDirection,
              mouthOpen: !prev.pacman.mouthOpen
            },
            ghosts: updatedGhostsAfterCollision,
            dots: remainingDots,
            powerPellets: remainingPowerPellets,
            poweredUp: isPoweredUp,
            poweredUpTimer: poweredUpTimer,
            dotsCollected: prev.totalDots - remainingDots.length
          };
        });
        
        lastTimeRef.current = time;
      }
      
      requestRef.current = requestAnimationFrame(updateGame);
    };
    
    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [
    gameMap, 
    upPressed, 
    downPressed, 
    leftPressed, 
    rightPressed, 
    touchDirection, 
    isPaused,
    onScoreUpdate,
    onLifeLost,
    onLevelComplete
  ]);

  // Render game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    drawMaze(ctx, gameMap, CELL_SIZE);
    
    // Draw dots and power pellets
    drawDots(ctx, gameObjects.dots, gameObjects.powerPellets, CELL_SIZE);
    
    // Draw Pac-Man
    drawPacman(ctx, gameObjects.pacman, CELL_SIZE);
    
    // Draw ghosts
    drawGhosts(ctx, gameObjects.ghosts, gameObjects.poweredUp, CELL_SIZE);
    
  }, [gameObjects, gameMap]);

  return (
    <div className="game-board relative">
      <canvas 
        ref={canvasRef}
        width={28 * CELL_SIZE} 
        height={31 * CELL_SIZE}
        className="border-2 border-blue-500 rounded-lg shadow-lg shadow-blue-500/30"
      />
    </div>
  );
};

export default GameBoard;