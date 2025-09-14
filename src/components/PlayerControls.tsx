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
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-center space-x-3">
        {/* 戻るボタン */}
        <button
          onClick={() => onSeekBack(-5)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go back 5 seconds"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700" />
            <span className="text-xs text-gray-700 ml-1">5s</span>
          </div>
        </button>

        <button
          onClick={() => onSeekBack(-2)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go back 2 seconds"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700" />
            <span className="text-xs text-gray-700 ml-1">2s</span>
          </div>
        </button>

        <button
          onClick={() => onSeekBack(-1)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go back 1 second"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700" />
            <span className="text-xs text-gray-700 ml-1">1s</span>
          </div>
        </button>

        {/* 再生ボタン */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center justify-center w-16 h-16 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors active:scale-95 shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Play className="w-6 h-6 text-white" fill="white" />
          )}
        </button>

        {/* 送るボタン */}
        <button
          onClick={() => onSeekBack(1)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go forward 1 second"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700 rotate-180" />
            <span className="text-xs text-gray-700 ml-1">1s</span>
          </div>
        </button>

        <button
          onClick={() => onSeekBack(2)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go forward 2 seconds"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700 rotate-180" />
            <span className="text-xs text-gray-700 ml-1">2s</span>
          </div>
        </button>

        <button
          onClick={() => onSeekBack(5)}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
          aria-label="Go forward 5 seconds"
        >
          <div className="flex items-center">
            <RotateCcw className="w-4 h-4 text-gray-700 rotate-180" />
            <span className="text-xs text-gray-700 ml-1">5s</span>
          </div>
        </button>
      </div>
    </div>
  );
};