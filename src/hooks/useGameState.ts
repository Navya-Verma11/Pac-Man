import { useState } from 'react';

type GameState = 'start' | 'playing' | 'paused' | 'gameOver';

const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
  };

  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    }
  };

  const resumeGame = () => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const endGame = () => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const addScore = (points: number) => {
    setScore(prev => prev + points);
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      }
      return newLives;
    });
  };

  const advanceLevel = () => {
    setLevel(prev => prev + 1);
  };

  return {
    gameState,
    score,
    highScore,
    setHighScore,
    lives,
    level,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    addScore,
    loseLife,
    advanceLevel
  };
};

export default useGameState;