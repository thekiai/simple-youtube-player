import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBack: (seconds: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onSeekBack
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-center space-x-4">
        {/* -2 seconds button */}
        <button
          onClick={() => onSeekBack(-2)}
          className="flex items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors active:scale-95"
          aria-label="Go back 2 seconds"
        >
          <div className="flex items-center">
            <RotateCcw className="w-5 h-5 text-white" />
            <span className="text-xs text-white ml-1">2s</span>
          </div>
        </button>

        {/* -1 second button */}
        <button
          onClick={() => onSeekBack(-1)}
          className="flex items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors active:scale-95"
          aria-label="Go back 1 second"
        >
          <div className="flex items-center">
            <RotateCcw className="w-5 h-5 text-white" />
            <span className="text-xs text-white ml-1">1s</span>
          </div>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors active:scale-95"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="white" />
          ) : (
            <Play className="w-8 h-8 text-white" fill="white" />
          )}
        </button>
      </div>
    </div>
  );
};