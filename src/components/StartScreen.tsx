import React, { useState, useEffect } from 'react';
import { Play, Trophy } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, highScore }) => {
  const [blinkClass, setBlinkClass] = useState('opacity-100');

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkClass(prev => prev === 'opacity-100' ? 'opacity-0' : 'opacity-100');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="start-screen flex flex-col items-center justify-center py-8 px-4 bg-blue-900 rounded-lg border-4 border-yellow-400 shadow-2xl min-w-[320px] w-full max-w-xl">
      <h2 className="text-5xl font-bold text-yellow-400 mb-6">PAC-MAN</h2>
      
      <div className="mb-8 flex items-center">
        <Trophy className="text-yellow-400 mr-2" size={24} />
        <p className="text-xl">High Score: <span className="text-yellow-400 font-bold">{highScore}</span></p>
      </div>
      
      <div className="game-instructions mb-8 text-center">
        <h3 className="text-xl font-bold mb-2 text-yellow-300">How to Play</h3>
        <ul className="text-left text-gray-200 space-y-2">
          <li>• Navigate the maze and collect all dots</li>
          <li>• Avoid the ghosts unless powered up</li>
          <li>• Use power pellets to hunt ghosts</li>
          <li>• Complete levels to increase difficulty</li>
        </ul>
      </div>
      
      <button 
        onClick={onStartGame}
        className={`px-8 py-4 bg-yellow-400 text-blue-900 rounded-full font-bold text-xl flex items-center transform hover:scale-105 transition-all ${blinkClass} duration-300`}
      >
        <Play className="mr-2" size={24} /> PLAY GAME
      </button>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-300 mb-2">Desktop: Use arrow keys to move</p>
        <p className="text-sm text-gray-300">Mobile: Swipe on screen to change direction</p>
      </div>
    </div>
  );
};

export default StartScreen;