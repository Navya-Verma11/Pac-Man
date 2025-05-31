import React from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  onPause,
  onResume,
  isSoundOn,
  onToggleSound
}) => {
  return (
    <div className="game-controls flex items-center justify-center gap-4 mt-6">
      <button
        onClick={isPaused ? onResume : onPause}
        className="p-3 bg-yellow-500 text-blue-900 rounded-full hover:bg-yellow-400 transition-colors"
        aria-label={isPaused ? "Resume game" : "Pause game"}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      
      <button
        onClick={onToggleSound}
        className="p-3 bg-yellow-500 text-blue-900 rounded-full hover:bg-yellow-400 transition-colors"
        aria-label={isSoundOn ? "Mute sounds" : "Enable sounds"}
      >
        {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      
      <div className="md:hidden mt-4">
        <p className="text-sm text-gray-300 mb-2">Mobile Controls: Swipe on the game board to change direction</p>
      </div>
      
      <div className="hidden md:block mt-4">
        <p className="text-sm text-gray-300 mb-2">Keyboard Controls: Arrow keys to move</p>
      </div>
    </div>
  );
};

export default GameControls;