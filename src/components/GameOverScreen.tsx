import React from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  score, 
  highScore, 
  onRestart 
}) => {
  const isNewHighScore = score > highScore;
  
  return (
    <div className="game-over-screen flex flex-col items-center justify-center py-8 px-4 bg-blue-900 rounded-lg border-4 border-red-500 shadow-2xl min-w-[320px] w-full max-w-xl animate-fadeIn">
      <h2 className="text-5xl font-bold text-red-500 mb-6">GAME OVER</h2>
      
      <div className="mb-6">
        <p className="text-2xl mb-2">Your Score: <span className="text-yellow-400 font-bold">{score}</span></p>
        <div className="flex items-center">
          <Trophy className="text-yellow-400 mr-2" size={20} />
          <p className="text-xl">High Score: <span className="text-yellow-400 font-bold">{Math.max(score, highScore)}</span></p>
        </div>
      </div>
      
      {isNewHighScore && (
        <div className="mb-6 py-2 px-4 bg-yellow-500 text-blue-900 rounded-md animate-pulse">
          <p className="font-bold text-xl">New High Score!</p>
        </div>
      )}
      
      <button 
        onClick={onRestart}
        className="px-8 py-4 bg-yellow-400 text-blue-900 rounded-full font-bold text-xl flex items-center hover:bg-yellow-300 transition-colors"
      >
        <RotateCcw className="mr-2" size={24} /> PLAY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;