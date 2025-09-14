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
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-center space-x-4">

        {/* 戻すボタン列 */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <button
            onClick={() => onSeekBack(-1)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go back 1 second"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-700 ml-1">1s</span>
            </div>
          </button>

          <button
            onClick={() => onSeekBack(-2)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go back 2 seconds"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-700 ml-1">2s</span>
            </div>
          </button>

          <button
            onClick={() => onSeekBack(-5)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go back 5 seconds"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-700 ml-1">5s</span>
            </div>
          </button>
        </div>

        {/* 再生ボタン列 */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="flex items-center justify-center w-20 h-20 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors active:scale-95 shadow-lg"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white" fill="white" />
            )}
          </button>
        </div>

        {/* 送るボタン列 */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <button
            onClick={() => onSeekBack(1)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go forward 1 second"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700 rotate-180" />
              <span className="text-xs text-gray-700 ml-1">1s</span>
            </div>
          </button>

          <button
            onClick={() => onSeekBack(2)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go forward 2 seconds"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700 rotate-180" />
              <span className="text-xs text-gray-700 ml-1">2s</span>
            </div>
          </button>

          <button
            onClick={() => onSeekBack(5)}
            className="flex items-center justify-center w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-colors active:scale-95"
            aria-label="Go forward 5 seconds"
          >
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-700 rotate-180" />
              <span className="text-xs text-gray-700 ml-1">5s</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};