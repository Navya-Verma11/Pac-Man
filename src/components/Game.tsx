import React, { useState, useEffect, useRef } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import ScorePanel from './ScorePanel';
import useGameState from '../hooks/useGameState';
import useSounds from '../hooks/useSounds';

const Game = () => {
  const { 
    gameState, 
    score, 
    highScore, 
    setHighScore,
    lives, 
    level,
    startGame, 
    endGame, 
    pauseGame, 
    resumeGame,
    addScore,
    loseLife,
    advanceLevel
  } = useGameState();

  const { playSound, toggleSound, isSoundOn } = useSounds();
  
  useEffect(() => {
    // Load high score from localStorage when component mounts
    const savedHighScore = localStorage.getItem('pacmanHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [setHighScore]);

  useEffect(() => {
    // Save high score to localStorage when it changes
    localStorage.setItem('pacmanHighScore', highScore.toString());
  }, [highScore]);
  
  const handleGameOver = () => {
    playSound('gameOver');
    endGame();
  };
  
  return (
    <div className="game-container flex flex-col items-center justify-center w-full max-w-4xl">
      {gameState === 'start' && (
        <StartScreen 
          onStartGame={startGame}
          highScore={highScore}
        />
      )}
      
      {gameState === 'playing' && (
        <>
          <ScorePanel 
            score={score} 
            highScore={highScore} 
            lives={lives} 
            level={level} 
          />
          <GameBoard
            level={level}
            onScoreUpdate={addScore}
            onLifeLost={loseLife}
            onGameOver={handleGameOver}
            onLevelComplete={advanceLevel}
            isPaused={gameState === 'paused'}
          />
          <GameControls 
            isPaused={gameState === 'paused'} 
            onPause={pauseGame} 
            onResume={resumeGame}
            isSoundOn={isSoundOn}
            onToggleSound={toggleSound}
          />
        </>
      )}
      
      {gameState === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="text-center p-8 bg-blue-900 rounded-lg shadow-lg border-4 border-yellow-400">
            <h2 className="text-3xl font-bold mb-4">Game Paused</h2>
            <button 
              onClick={resumeGame}
              className="px-6 py-2 bg-yellow-400 text-blue-900 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <GameOverScreen 
          score={score} 
          highScore={highScore}
          onRestart={startGame}
        />
      )}
    </div>
  );
};

export default Game;