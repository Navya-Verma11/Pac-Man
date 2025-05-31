import React from 'react';

interface ScorePanelProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ score, highScore, lives, level }) => {
  return (
    <div className="score-panel flex flex-wrap justify-between items-center w-full max-w-md mb-4 px-4 py-2 bg-blue-800 rounded-lg">
      <div className="score-container">
        <p className="text-sm text-gray-300">SCORE</p>
        <p className="text-2xl font-bold text-yellow-400">{score}</p>
      </div>
      
      <div className="high-score-container">
        <p className="text-sm text-gray-300">HIGH SCORE</p>
        <p className="text-2xl font-bold text-yellow-400">{Math.max(score, highScore)}</p>
      </div>
      
      <div className="lives-container flex items-center">
        <p className="text-sm text-gray-300 mr-2">LIVES</p>
        <div className="flex">
          {Array.from({ length: lives }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full mx-1"></div>
          ))}
        </div>
      </div>
      
      <div className="level-container">
        <p className="text-sm text-gray-300">LEVEL</p>
        <p className="text-xl font-bold text-white">{level}</p>
      </div>
    </div>
  );
};

export default ScorePanel;